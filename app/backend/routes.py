from fastapi import APIRouter
from schemes import MealQuery, RecipeQuery, FollowUpQuery
from .openai_client import get_meal_response

router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Hello World"}


@router.get("/generate-meals")
async def generate_meals():
    meal_response = get_meal_response(
        "Know any good French recipes that feature chicken and vegetablesg that doesn't include dairy or gluten?"
    )
    return {"response": meal_response}
