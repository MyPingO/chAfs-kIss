import os
import stripe
from schemes import *
from firebase_admin import auth
from typing import Dict, List, Union
from google.cloud.firestore import ArrayRemove
from fastapi import APIRouter, HTTPException, Request, Depends
from .firebase import db, get_login_uid, update_user_coin_count
from .edamam import get_recipe_nutrition, filter_nutrition_data
from .openai_client import get_meal_response, get_recipe_for_meal

router = APIRouter()
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
stripe_webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")

# --Routes-- #


"""
 Returns a filtered response from the OpenAI API for a given MealQuery
 
    Parameters:
        MealQuery:
            query: str
            
    Returns:
        MealResponse:
            response: list[str]
"""


query_max_length = 350
@router.post("/generate_meals", response_model=MealResponse) # TODO: Check for coin count, set unused_meals in db
async def generate_meals(meal_query: MealQuery, uid: str = Depends(get_login_uid)) -> MealResponse:
    # Get coin count from Firestore
    doc = db.collection('users').document(uid).get()
    coin_count = doc.to_dict().get('coin_count', 0)
    if coin_count < 1:
        raise HTTPException(status_code=402, detail="Insufficient plates to generate meals. Please purchase more.")
    
    query = meal_query.query
    if (len(query) > query_max_length):
        raise HTTPException(status_code=400, detail="Query length must be less than 350 characters")
    
    meal_response = await get_meal_response(
        query=query,
        restrictions=meal_query.restrictions,
    )
    
    # Update coin count and unused_meals in Firestore
    db.collection('users').document(uid).update({
        'coin_count': max(coin_count - 1, 0),
        'unused_meals': meal_response
    })

    
    return MealResponse(response=meal_response)


"""
Returns a filtered response from the OpenAI API for a given RecipeQuery 

Parameters:
    RecipeQuery:
        meal: str
        restrictions: list[str]
        
Returns:

    RecipeReport:
        recipe: Recipe
            ingredients: list[str]
            instructions: list[str]
        nutrition: Nutrition
            healthLabels: list[str]
            nutrients: dict[str, dict[str, Union[str, float, int]]]
            dailyValue: dict[str, dict[str, Union[str, float, int]]]
            cuisineType: list[str]
            mealType: list[str]
            dishType: list[str]
            dietLabels: list[str]
            PROCNT_KCAL: dict[str, Union[str, float, int]]
            FAT_KCAL: dict[str, Union[str, float, int]]
            CHOCDF_KCAL: dict[str, Union[str, float, int]]
"""

@router.post("/generate_recipe_report", response_model=RecipeReport)
async def generate_recipe_report(recipe_query: RecipeQuery, uid: str = Depends(get_login_uid)) -> RecipeReport:
    meal = recipe_query.meal
    # Check if meal is in unused_meals field in users' document
    doc = db.collection('users').document(uid).get()
    unused_meals: list[str] = doc.to_dict().get('unused_meals', [])
    if meal not in unused_meals:
        raise HTTPException(status_code=400, detail="Invalid recipe generation request. Please generate a meal first.")
    
    # Generate recipe for meal
    try:
        recipe_response = await get_recipe_for_meal(
            meal=meal,
            restrictions=recipe_query.restrictions,
        )
        # Remove meal from unused_meals in Firestore
        db.collection('users').document(uid).update({
            'unused_meals': ArrayRemove([meal])
        })
    except Exception as e:
        print(f"HTTPException: {str(e)}")
        recipe_response = f"Error generating recipe, please contact support.\n Error: {str(e)}"
        
    # Get nutrition data for recipe
    try:
        recipe_nutrition = await get_recipe_nutrition(
            ingredients=recipe_response["ingredients"],
        )
        recipe_nutrition = filter_nutrition_data(recipe_nutrition)
    except Exception as e:
        print(f"HTTPException: {str(e)}")
        recipe_nutrition = f"Error fetching nutrition data: {str(e)}"

    
    recipe = Recipe(ingredients=recipe_response["ingredients"], instructions=recipe_response["instructions"])
    nutrition = Nutrition(**recipe_nutrition)
    return RecipeReport(recipe=recipe, nutrition=nutrition)

@router.post("/login")
async def login(login: Login):
    token = login.token
    try:
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token['uid']
        user_ref = db.collection('users').document(user_id)
        doc = user_ref.get()
        # Add user to Firestore if they don't exist
        if not doc.exists:
            user_ref.set({'coin_count': 0, 'unused_meals': []})
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.post("/create-stripe-checkout")
async def create_stripe_checkout(StripeCheckoutScheme: StripeScheme, uid: str = Depends(get_login_uid)):
    quantity = StripeCheckoutScheme.quantity
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": "Plate",
                        },
                        "unit_amount": quantity * 10,
                    },
                    "quantity": quantity,
                },
            ],
            metadata={
                "user_id": uid,
                "quantity": quantity,
            },
            mode="payment",
            success_url=os.getenv("FRONTEND_URL") or "http://localhost:5173",
            cancel_url=os.getenv("FRONTEND_URL") or "http://localhost:5173",
        )
        return {"session_id": checkout_session["id"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, stripe_webhook_secret
        )

    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail='Invalid payload')
    except stripe.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail='Invalid signature')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f'Invalid request: {e}')

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Extract user_id and quantity from the session's metadata
        user_id = session['metadata']['user_id'] if 'user_id' in session['metadata'] else None
        if not user_id:
            raise HTTPException(status_code=400, detail='User ID not found')
        quantity = int(session['metadata']['quantity'])

        # Update the user's coin_count in Firestore
        await update_user_coin_count(user_id, quantity)
    else:
        print('Unhandled event type {}'.format(event['type']))

    return {"status": "success"}




