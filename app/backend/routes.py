import os
import stripe
from schemes import *
from fastapi import APIRouter, HTTPException, Request
from .edamam import get_recipe_nutrition, filter_nutrition_data
from .openai_client import get_meal_response, get_recipe_for_meal

router = APIRouter()
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

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
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': 'Token',
                        },
                        'unit_amount': quantity * 10,
                    },
                    'quantity': quantity,
                },
            ],
            mode='payment',
            success_url=os.getenv('FRONTEND_URL') or 'http://localhost:5173',  # Redirect user here after successful payment
            cancel_url=os.getenv('FRONTEND_URL') or 'http://localhost:5173',  # Redirect user here if payment was cancelled
        )
        return {"session_id": checkout_session['id']}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/webhook")
async def stripe_webhook(request: Request):
    webhook_secret = "your_webhook_secret"
    request_data = await request.body()

    # Verify the webhook signature
    try:
        event = stripe.Webhook.construct_event(
            payload=request_data, 
            sig_header=request.headers.get('stripe-signature'), 
            secret=webhook_secret
        )
    except ValueError as e:
        # Invalid payload
        return HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Perform some logic after a successful checkout
        pass

    return {"status": "success"}