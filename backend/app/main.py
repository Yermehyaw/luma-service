from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import queue

app = FastAPI(
    title="Luna API",
    description="Backend API for the Luna Multi-Tenant Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(queue.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Luna API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
