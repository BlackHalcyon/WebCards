from pydantic import BaseSettings


class Settings(BaseSettings):
    app_name: str = "WebCards API"
    db_user: str
    db_name: str
    db_url: str
    db_password: str

    class Config:
        env_file = ".env"
