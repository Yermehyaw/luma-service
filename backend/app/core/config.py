from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Luna API"
    DATABASE_URL: str = "postgresql+asyncpg://luna_user:luna_password@localhost:5432/luna_db"
    REDIS_URL: str = "redis://localhost:6379"
    CLERK_PEM_PUBLIC_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
