from pydantic import BaseModel, Field


class MealQuery(BaseModel):
    query: str = Field(
        ...,
        example="What's a good high-protein, low-carb meal for a post-workout dinner?",
    )
    restrictions: list[str] = Field([], example=["peanuts", "Halal", "dairy"])


class RecipeQuery(BaseModel):
    meal: str = Field(
        ...,
        example="Pizza",
    )
    restrictions: list[str] = Field([], example=["White Flour"])


class FollowUpQuery(BaseModel):
    query: str = Field(
        ...,
        example="What's a good side dish to complement this meal?",
    )


class Token(BaseModel):
    access_token: str
    token_type: str


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
