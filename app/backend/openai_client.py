import os
import openai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# get API key env file
openai.api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI()

meal_assistant = client.beta.assistants.create(
    name="Meal Assistant",
    instructions="You are a personal chef. You suggest meals to users based on their input. You MUST respond with a list of 5-10 meals. You CANNOT respond with a list of ingredients or any other information besides what the meal is. When describing what the meal is you MUST keep it as one, concise, descriptive sentence. If no file was given, it means it was intentionally not provided.",
    tools=[{"type": "retrieval"}],
    model="gpt-4-1106-preview",
)


def get_meal_response(query: str):
    thread = client.beta.threads.create()
    # this adds a message to the thread
    _message = client.beta.threads.messages.create(
        thread_id=thread.id, content=query, role="user"
    )

    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=meal_assistant.id,
    )

    while run.status != "completed":
        run = client.beta.threads.runs.retrieve(run.id, thread_id=thread.id)
    messages = client.beta.threads.messages.list(thread.id)

    assistant_responses = [msg.content for msg in messages if msg.role == "assistant"]
    return assistant_responses
