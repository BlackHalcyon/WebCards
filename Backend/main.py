from fastapi import FastAPI
from sqlalchemy import text
from database import SessionLocal
from fastapi.middleware.cors import CORSMiddleware
import crud

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.put("/create/{subject_name}")
async def create_subject(subject_name: str):
    crud.create_subject(SessionLocal(), subject_name)
    return 201


@app.get("/get/subjects")
async def get_subjects():
    return crud.get_subjects(SessionLocal())


@app.post("/update/{subject_id}/{new_name}/{new_hide}")
async def update_subject(subject_id: int, new_name: str, new_hide: bool):
    crud.update_subject(SessionLocal(), subject_id, new_name, new_hide)
    return 201


@app.delete("/delete/{subject_id}")
async def delete_subject(subject_id: int):
    crud.delete_subject(SessionLocal(), subject_id)
    return 201


@app.put("/create/{chapter_name}")
async def create_chapter(chapter_name: str):
    crud.create_chapter(SessionLocal(), chapter_name)
    return 201


@app.get("/get/chapters")
async def get_chapters():
    return crud.get_chapters(SessionLocal())


@app.post("/update/{chapter_id}/{new_name}/{new_hide}")
async def update_chapter(chapter_id: int, new_name: str, new_hide: bool):
    crud.update_chapter(SessionLocal(), chapter_id, new_name, new_hide)
    return 201


@app.delete("/delete/{chapter_id}")
async def delete_chapter(chapter_id: int):
    crud.delete_chapter(SessionLocal(), chapter_id)
    return 201


@app.put("/create/{flashcard_question}/{flashcard_answer}")
async def create_flashcard(flashcard_question: str, flashcard_answer: str):
    crud.create_flashcard(SessionLocal(), flashcard_question, flashcard_answer)
    return 201


@app.get("/get/flashcards")
async def get_flashcards():
    return crud.get_flashcards(SessionLocal())


@app.post("/update/{flashcard_id}/{new_question}/{new_answer}/{new_correct}/{new_hide}")
async def update_flashcard(flashcard_id: int, new_question: str, new_answer: str, new_correct: bool, new_hide: bool):
    crud.update_flashcard(SessionLocal(), flashcard_id, new_question, new_answer, new_correct, new_hide)
    return 201


@app.delete("/delete/{chapter_id}")
async def delete_chapter(chapter_id: int):
    crud.delete_subject(SessionLocal(), chapter_id)
    return 201
