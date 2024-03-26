from typing import List, Dict, Union
from pydantic import BaseModel, Field

class MealQuery(BaseModel):
    query: str = Field(
        ...,
        example="What's a good high-protein, low-carb meal for a post-workout dinner?",
    )
    restrictions: list[str] = Field(list[str], example=["peanuts", "Halal", "dairy"])

class MealResponse(BaseModel):
    response: list[str]

class RecipeQuery(BaseModel):
    meal: str = Field(
        ...,
        example="Pizza",
    )
    restrictions: list[str] = Field(list[str], example=["White Flour"])
    
class Recipe(BaseModel):
    ingredients: list[str]
    instructions: list[str]

class Nutrition(BaseModel):
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

class RecipeReport(BaseModel):
    recipe: Recipe
    nutrition: Nutrition

class FollowUpQuery(BaseModel):
    query: str = Field(
        ...,
        example="What's a good side dish to complement this meal?",
    )
    
class UserInfo(BaseModel):
    token: str = Field()
    
class StripeScheme(BaseModel):
    quantity: int = Field(
        ...,
        example=10,
    )

class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True
