from schemes import *
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from .edamam import get_recipe_nutrition
from fastapi import APIRouter, Depends, HTTPException
from .login_manager import hash_password, verify_password
from .openai_client import get_meal_response, get_recipe_for_meal

router = APIRouter()

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
    except HTTPException as e:
        print(f"HTTPException: {e.detail}")
        recipe_nutrition = None

    return {"recipe": recipe_response, "nutrition": recipe_nutrition}


"""
Creates a new user in the database with the given User object if the user does not already exist

Parameters:
    User:
        username: str
        email: str
        password: str

Raises:
    HTTPException:
        status_code: 400
        detail: "Email already registered"

Returns:
    dict[str, User]:
        user: User
"""
