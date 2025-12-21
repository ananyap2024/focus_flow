import os
from dotenv import load_dotenv
from fastapi import FastAPI
from focusflow.routes import notifications

# Load environment variables
load_dotenv()


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="FocusFlow Backend",
    description="Agentic backend for prioritizing notifications.",
    version="0.1.0"
)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include Routers
app.include_router(notifications.router, prefix="/api", tags=["notifications"])

@app.get("/")
async def root():
    return {"message": "Welcome to FocusFlow Backend. Use /docs for API documentation."}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
