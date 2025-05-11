# routes/recipe_api.py

import requests
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

SPOONACULAR_API_KEY = "your_api_key_here"

@router.get("/recipe")
def get_recipe(food_name: str):
    try:
        # Step 1: Search recipe by name
        search_url = f"https://api.spoonacular.com/recipes/complexSearch"
        search_params = {
            "query": food_name,
            "number": 1,
            "apiKey": SPOONACULAR_API_KEY
        }

        search_response = requests.get(search_url, params=search_params)
        search_data = search_response.json()

        if not search_data["results"]:
            return JSONResponse(content={"error": "Recipe not found"}, status_code=404)

        recipe_id = search_data["results"][0]["id"]

        # Step 2: Get recipe details
        detail_url = f"https://api.spoonacular.com/recipes/{recipe_id}/information"
        detail_params = {
            "includeNutrition": False,
            "apiKey": SPOONACULAR_API_KEY
        }

        detail_response = requests.get(detail_url, params=detail_params)
        detail_data = detail_response.json()

        ingredients = [ing["original"] for ing in detail_data.get("extendedIngredients", [])]
        instructions = detail_data.get("instructions", "No instructions available.")

        return {
            "ingredients": ingredients,
            "instructions": instructions
        }

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
