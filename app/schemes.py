from pydantic import BaseModel, Field


class MealQuery(BaseModel):
    query: str = Field(
        ...,
        example="What's a good high-protein, low-carb meal for a post-workout dinner?",
    )
    restrictions: list[str] = Field([], example=["peanuts", "Halal", "dairy"])


class RecipeQuery(BaseModel):
    query: str = Field(...)


class FollowUpQuery(BaseModel):
    query: str = Field(
        ...,
        example="What's a good side dish to complement this meal?",
    )
