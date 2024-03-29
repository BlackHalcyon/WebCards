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


@app.put("/create/subject/{subject_name}")
async def create_subject(subject_name: str):
    crud.create_subject(SessionLocal(), subject_name)
    return 201


@app.get("/get/subjects")
async def get_subjects():
    return crud.get_subjects(SessionLocal())


@app.get("/get/subjects/study")
async def get_subjects_study():
    return crud.get_subjects_study(SessionLocal())


@app.post("/update/subject/name/{subject_id}/{new_name}")
async def update_subject_name(subject_id: int, new_name: str):
    crud.update_subject_name(SessionLocal(), subject_id, new_name)
    return 201


@app.post("/update/subject/hide/{subject_id}/{new_hide}")
async def update_subject_hide(subject_id: int, new_hide: bool):
    crud.update_subject_hide(SessionLocal(), subject_id, new_hide)
    return 201


@app.delete("/delete/subject/{subject_id}")
async def delete_subject(subject_id: int):
    crud.delete_subject(SessionLocal(), subject_id)
    return 201


@app.put("/create/chapter/{chapter_name}/{subject_id}")
async def create_chapter(chapter_name: str, subject_id: int):
    crud.create_chapter(SessionLocal(), chapter_name, subject_id)
    return 201


@app.get("/get/chapters/{subject_id}")
async def get_chapters(subject_id: int):
    return crud.get_chapters(SessionLocal(), subject_id)


@app.get("/get/chapters/study/mode")
async def get_chapters_study():
    return crud.get_chapters_study(SessionLocal())


@app.post("/update/chapter/name/{chapter_id}/{new_name}")
async def update_chapter_name(chapter_id: int, new_name: str):
    crud.update_chapter_name(SessionLocal(), chapter_id, new_name)
    return 201


@app.post("/update/chapter/hide/{chapter_id}/{new_hide}")
async def update_chapter_hide(chapter_id: int, new_hide: bool):
    crud.update_chapter_hide(SessionLocal(), chapter_id, new_hide)
    return 201


@app.delete("/delete/chapter/{chapter_id}")
async def delete_chapter(chapter_id: int):
    crud.delete_chapter(SessionLocal(), chapter_id)
    return 201


@app.put("/create/flashcard/{chapter_id}/{flashcard_question}/{flashcard_answer}")
async def create_flashcard(chapter_id: int, flashcard_question: str, flashcard_answer: str):
    crud.create_flashcard(SessionLocal(), chapter_id, flashcard_question, flashcard_answer)
    return 201


@app.get("/get/flashcards/{chapter_id}")
async def get_flashcards(chapter_id: int):
    return crud.get_flashcards(SessionLocal(), chapter_id)


@app.get("/get/flashcards/study/mode")
async def get_flashcards_study():
    return crud.get_flashcards_study(SessionLocal())


@app.get("/get/flashcard/score/mode")
async def get_flashcard_score():
    return crud.get_flashcards_score(SessionLocal())


@app.post("/update/flashcard/score/mode")
async def update_flashcard_score():
    crud.update_flashcard_score(SessionLocal())
    return 201


@app.post("/update/flashcard/reset/score")
async def update_flashcard_reset_score():
    crud.update_flashcard_reset_score(SessionLocal())
    return 201


@app.post("/update/flashcard/question/{flashcard_id}/{new_question}")
async def update_flashcard_question(flashcard_id: int, new_question: str):
    crud.update_flashcard_question(SessionLocal(), flashcard_id, new_question)
    return 201


@app.post("/update/flashcard/answer/{flashcard_id}/{new_answer}")
async def update_flashcard_answer(flashcard_id: int, new_answer: str):
    crud.update_flashcard_answer(SessionLocal(), flashcard_id, new_answer)
    return 201


@app.post("/update/flashcard/correct/{flashcard_id}/{new_correct}")
async def update_flashcard_correct(flashcard_id: int, new_correct: bool):
    crud.update_flashcard_correct(SessionLocal(), flashcard_id, new_correct)
    return 201


@app.post("/update/flashcard/hide/{flashcard_id}/{new_hide}")
async def update_flashcard_hide(flashcard_id: int, new_hide: bool):
    crud.update_flashcard_hide(SessionLocal(), flashcard_id, new_hide)
    return 201


@app.delete("/delete/flashcard/{flashcard_id}")
async def delete_flashcard(flashcard_id: int):
    crud.delete_flashcard(SessionLocal(), flashcard_id)
    return 201

