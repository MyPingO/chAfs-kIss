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
            
def filter_nutrition_data(nutrition_response: dict):
    # Get nutrition[healthLabels, totalNutrients[ENERC_KCAL, FAT, CHOCDF.net, FIBTG, SUGAR, PROCNT, CHOLE, NA, CA, MG], totalDaily[ENERC_KCAL, FAT, CHOCDF, SUGAR, PROCNT, CHOLE, FIBTG, NA, CA, MG], cuisineType, mealType, dishType, dietLabels, PROCNT_KCAL, FAT_KCAL, CHOCDF_KCAL]

    healthLabels = nutrition_response['healthLabels']
    totalNutrients = nutrition_response['totalNutrients']
    totalDaily = nutrition_response['totalDaily']
    cuisineType = nutrition_response['cuisineType']
    mealType = nutrition_response['mealType']
    dishType = nutrition_response['dishType']
    dietLabels = nutrition_response['dietLabels']
    PROCNT_KCAL = nutrition_response['totalNutrientsKCal']['PROCNT_KCAL']
    FAT_KCAL = nutrition_response['totalNutrientsKCal']['FAT_KCAL']
    CHOCDF_KCAL = nutrition_response['totalNutrientsKCal']['CHOCDF_KCAL']
    
    nutrition_data = {
        "healthLabels": healthLabels,
        "nutrients": totalNutrients,
        "dailyValue": totalDaily,
        "cuisineType": cuisineType,
        "mealType": mealType,
        "dishType": dishType,
        "dietLabels": dietLabels,
        "PROCNT_KCAL": PROCNT_KCAL,
        "FAT_KCAL": FAT_KCAL,
        "CHOCDF_KCAL": CHOCDF_KCAL,
    }
    
    return nutrition_data
    
    