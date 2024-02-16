import uvicorn
from fastapi import FastAPI
from dotenv import load_dotenv
from backend.routes import router
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)