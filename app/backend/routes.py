import os
import stripe
from schemes import *
from .firebase import db
from fastapi import APIRouter, HTTPException, Request
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


@router.post("/generate_meals")
async def generate_meals(meal_query: MealQuery) -> dict[str, list[str]]:
    meal_response = await get_meal_response(
        query=meal_query.query,
        restrictions=meal_query.restrictions,
    )

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
    recipe_response = await get_recipe_for_meal(
        meal=recipe_query.meal,
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
                            "name": "Token",
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
        return HTTPException(status_code=400, detail='Invalid payload')
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HTTPException(status_code=400, detail='Invalid signature')

    # Handle the checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Extract user_id and quantity from the session's metadata
        user_id = session['metadata']['user_id'] if 'user_id' in session['metadata'] else None
        if not user_id:
            return HTTPException(status_code=400, detail='User ID not found')
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
        return HTTPException(status_code=404, detail='User not found')

