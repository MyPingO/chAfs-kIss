import os
import stripe
from schemes import *
from firebase_admin import auth
from .firebase import db, get_login_uid
from fastapi import APIRouter, HTTPException, Request, Depends
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
        dict[str, list[str]]:
            response: list[str]

"""


query_max_length = 350
@router.post("/generate_meals") # TODO: Check for coin count, set unused_meals in db
async def generate_meals(meal_query: MealQuery, uid: str = Depends(get_login_uid)) -> dict[str, list[str]]:
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
        'coin_count': coin_count - 1,
        'unused_meals': meal_response
    })

    
    return {"response": meal_response}


"""
Returns a filtered response from the OpenAI API for a given RecipeQuery 

Parameters:
    RecipeQuery:
        meal: str
        restrictions: list[str]
        
Returns:

    dict[str, list[str]]:
        ingredients: list[str]
        instructions: list[str]
        
"""

@router.post("/generate_recipe_report")
async def generate_recipe_report(recipe_query: RecipeQuery) -> dict:
    meal = recipe_query.meal
    # Check if meal is in unused_meals in db

    
    recipe_response = await get_recipe_for_meal(
        meal=meal,
        restrictions=recipe_query.restrictions,
    )
    try:
        recipe_nutrition = await get_recipe_nutrition(
            ingredients=recipe_response["ingredients"],
        )
        recipe_nutrition = filter_nutrition_data(recipe_nutrition)

    except HTTPException as e:
        print(f"HTTPException: {e.detail}")
        recipe_nutrition = None

    return {"recipe": recipe_response, "nutrition": recipe_nutrition}

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
            user_ref.set({'coin_count': 0})
            user_ref.set({'unused_meals': []}) # list of strings
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.post("/create-stripe-checkout")
async def create_stripe_checkout(StripeCheckoutSession: StripeCheckoutSession):
    quantity = StripeCheckoutSession.quantity
    user_id = StripeCheckoutSession.user_id
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
                "user_id": user_id,
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
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail='Invalid signature')

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

async def update_user_coin_count(user_id: str, quantity: int):
    user_ref = db.collection('users').document(user_id)
    doc = user_ref.get()
    
    if doc.exists:
        current_coins = doc.to_dict().get('coin_count', 0)
        new_coin_count = current_coins + quantity
        user_ref.update({'coin_count': new_coin_count})
    else:
        raise HTTPException(status_code=404, detail='User not found')


