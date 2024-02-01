import os
import httpx
from fastapi import HTTPException

app_id = os.getenv("EDAMAM_APP_ID")
app_key = os.getenv("EDAMAM_APP_KEY")

async def get_recipe_nutrition(ingredients: dict):
    params = {
    "app_id": app_id,
    "app_key": app_key,
}
    ingredients = {"ingr": ingredients}

    url = "https://api.edamam.com/api/nutrition-details"

    async with httpx.AsyncClient() as client:
        response = await client.post(url, params=params, json=ingredients, headers={"Content-Type": "application/json"})
        if response.status_code == 200:
            return response.json()
        else:
            detail = {
                404: "The specified URL was not found or couldn't be retrieved",
                409: "The provided ETag token does not match the input data",
                422: "Couldn't parse the recipe or extract the nutritional info",
                555: "Recipe with insufficient quality to process correctly",
            }.get(response.status_code, f"Error calling Edamam API: {response.status_code}")
            raise HTTPException(
                status_code=response.status_code, detail=detail
            )