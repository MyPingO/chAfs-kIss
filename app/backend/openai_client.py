import os
import openai
from openai import AsyncOpenAI
from dotenv import load_dotenv
import re

load_dotenv()

# get API key env file
openai.api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI()

#### Completions API ####
async def get_meal_response(query: str, restrictions: list[str] = None) -> list[str]:
    
    instructions = "Suggest 4 meals per user input, adhering strictly to any restrictions or assuming none if unspecified. Respond succinctly names and number responses."
    restrictions_str = str.join(", ", restrictions)
    
    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": instructions},
            {"role": "user", "content": query + (f" User specified restrictions: {restrictions_str if restrictions_str else 'None'}")},
        ],
        max_tokens=50,
    )
    response_text = response.choices[0].message.content
    print(response_text)
    # Remove newline characters and extra spaces
    response_text = response_text.replace('\n', ' ').strip()
    # Split the response using regex to separate each meal
    meals_dirty = re.split(r"\d+\.\s*", response_text)

    # Clean up the meals: strip whitespace and filter out empty strings
    meals_clean = [meal.strip() for meal in meals_dirty if meal.strip()]
    
    return meals_clean

async def get_recipe_for_meal(meal: str, restrictions: list[str] = None) -> dict[str, list[str]]:

    instructions = "You create recipes for a given meal, adhering strictly to any restrictions or assuming none if unspecified. Specify ingredients first, then instructions. Respond succinctly and number responses."
    restrictions_str = str.join(", ", restrictions)
    query = f"Generate a detailed recipe for {meal}." + (f" User specified restrictions: {restrictions_str if restrictions_str else 'None'}")

    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": instructions},
            {"role": "user", "content": query},
        ],
        max_tokens=300,
    )

    # Split the response into ingredients and instructions
    split_pattern = r'(?i)instructions\s*:?'
    split_response = re.split(split_pattern, response.choices[0].message.content, maxsplit=1)
    ingredients_list = split_response[0].split('\n')
    instructions_list = split_response[1].split('\n')
    

    return { "ingredients": ingredients_list, "instructions": instructions_list }



# Example usage:
# meal_suggestions = get_meal_response("I'm looking for vegetarian dinner options.")
# print(meal_suggestions)

#### Assistant API ####

# meal_assistant = client.beta.assistants.create(
#     name="Meal Assistant",
#     instructions="You are a personal chef. You suggest meals to users based on their input. You MUST respond with a list of 5. DO NOT respond with a list of ingredients or any other information besides what the meal is. When describing what the meal is you MUST keep it as one, concise, descriptive sentence. If no file was given, it means it was intentionally not provided.",
#     tools=[{"type": "retrieval"}],
#     model="gpt-4-1106-preview",
# )


# def get_meal_response(query: str):
#     thread = client.beta.threads.create()
#     # this adds a message to the thread
#     _message = client.beta.threads.messages.create(
#         thread_id=thread.id, content=query, role="user"
#     )

#     run = client.beta.threads.runs.create(
#         thread_id=thread.id,
#         assistant_id=meal_assistant.id,
#     )

#     while run.status != "completed":
#         run = client.beta.threads.runs.retrieve(run.id, thread_id=thread.id)
#     messages = client.beta.threads.messages.list(thread.id)

#     assistant_responses = [msg.content for msg in messages if msg.role == "assistant"]
#     return assistant_responses
