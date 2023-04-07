from fastapi import Depends, FastAPI
from sqlalchemy import text

from database import SessionLocal

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/get_an_int")
async def get_an_int():
    return {"message": 5}

@app.get("/get_a_list_strings")
async def get_a_list_strings():
    x = ["A", "LIST", "OF", "STRINGS"]
    return {"message": x}

@app.get("/test_db")
async def test_db():
    db = get_db()
    subjects = SessionLocal().execute(text("select * from subjects"))
    string = []
    for subject in subjects.all():
        string.append(subject[1])
    return {"message": string}

@app.get("/testinggg")
async def testinggg():
    return {"message": 'yuh'}