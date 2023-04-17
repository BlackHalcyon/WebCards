import models
from database import SessionLocal


def create_subject(db: SessionLocal, input_name: str):
    new_subject = models.Subject()
    new_subject.name = input_name
    new_subject.hide = False
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)
    return new_subject


def get_subjects(db: SessionLocal):
    return db.query(models.Subject).filter(models.Subject.hide == False).all()


def update_subject(db: SessionLocal, subject_id: int, new_name: str, new_hide: bool):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    db_subject.name = new_name
    db_subject.hide = new_hide
    db.commit()
    return db_subject


def delete_subject(db: SessionLocal, subject_id: int):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if db_subject:
        db.delete(db_subject)
        db.commit()
        return True
    return False


def create_chapter(db: SessionLocal, input_name: str):
    new_chapter = models.Chapter()
    new_chapter.name = input_name
    new_chapter.hide = False
    db.add(new_chapter)
    db.commit()
    db.refresh(new_chapter)
    return new_chapter


def get_chapter(db: SessionLocal):
    return db.query(models.Chapter).filter(models.Chapter.hide == False).all()

def update_chapter(db: SessionLocal, chapter_id: int, new_name: str, new_hide: bool):
    db_chapter = b.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()
    db_subject.name = new_name
    db.hide = new_hide
    db.commit()
    return db_subject

def create_flashcard(db: SessionLocal, input_question: str, input_answer: str):
    new_flashcard = models.Flashcard()
    new_flascard.front_of_card = input_question
    new_flashcard.back_of_card = input_answer
    new_flashcard.hide = False
    new_flashcard.correct = False
    db.add(new_flashcard)
    db.commit()
    db.refresh(new_flashcard)
    return new_flashcard

def get_flashcard(db: SessionLocal):
    return db.query(models.Flashcard).filter(models.Flashcard.hide == false).all()

def update_flashcard(db: SessionLocal 
