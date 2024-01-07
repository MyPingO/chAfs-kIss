from schemes import *
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi import APIRouter, Depends, HTTPException
from .login_manager import hash_password, verify_password
from .models import *
from .database import get_db
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
        query = meal_query.query,
        restrictions = meal_query.restrictions,
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
@router.post("/generate_recipe")
async def generate_recipe(recipe_query: RecipeQuery) -> dict[str, dict[str, list[str]]]:
    recipe_response = await get_recipe_for_meal(
        meal = recipe_query.meal,
        restrictions=recipe_query.restrictions,
    )
    
    return {"response": recipe_response}


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
@router.post("/signup")
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        username = user.username,
        email = user.email,
        password = hash_password(user.password),
    )

    # Add user to database
    db.add(new_user)
    db.commit()


@router.post("/login")
async def login_user(user: UserCreate, db: Session = Depends(get_db)):
        
        # Check if user already exists
        db_user = db.query(User).filter(User.email == user.email).first()
        if not db_user:
            raise HTTPException(status_code=400, detail="User does not exist")
        
        # Check if password matches
        if not verify_password(user.password, db_user.password):
            raise HTTPException(status_code=400, detail="Password incorrect")
        
        # Return user
        return {"user": db_user}
