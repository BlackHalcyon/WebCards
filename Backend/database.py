from functools import lru_cache
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import config

@lru_cache()
def env():
    return config.Settings()

SQLALCHEMY_DATABASE_URL = f"postgresql://{env().db_user}:{env().db_password}@{env().db_url}/{env().db_name}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
