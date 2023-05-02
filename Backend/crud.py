import models
from database import SessionLocal
from sqlalchemy import func


def delete_chapter_flashcards(db: SessionLocal, chapter_id: int):
    db_flashcards = db.query(models.Flashcard).filter(models.Flashcard.chapter_id == chapter_id).all()
    for db_flashcard in db_flashcards:
        db.delete(db_flashcard)
    db.commit()


def delete_subject_chapters(db: SessionLocal, subject_id: int):
    db_chapters = db.query(models.Chapter).filter(models.Chapter.subject_id == subject_id).all()
    for db_chapter in db_chapters:
        delete_chapter_flashcards(db, db_chapter.id)
        db.delete(db_chapter)
    db.commit()


def update_chapter_flashcards(db: SessionLocal, chapter_id: int, new_hide: bool):
    db_flashcards = db.query(models.Flashcard).filter(models.Flashcard.chapter_id == chapter_id).all()
    for db_flashcard in db_flashcards:
        db_flashcard.hide = new_hide


def create_subject(db: SessionLocal, input_name: str):
    new_subject = models.Subject()
    new_subject.name = input_name
    new_subject.hide = False
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)
    return new_subject


def get_subjects(db: SessionLocal):
    subjects = db.query(models.Subject).all()
    subjects_list = [subject.as_dict() for subject in subjects]
    return subjects_list


def get_subjects_study(db: SessionLocal):
    return db.query(models.Subject).filter(models.Subject.hide == False).all()


def update_subject_name(db: SessionLocal, subject_id: int, new_name: str):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    db_subject.name = new_name
    db.commit()
    return db_subject


def update_subject_hide(db: SessionLocal, subject_id: int, new_hide: bool):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    db_subject.hide = new_hide
    db_chapters = db.query(models.Chapter).filter(models.Chapter.subject_id == subject_id).all()
    for db_chapter in db_chapters:
        update_chapter_hide(db, db_chapter.id, new_hide)
    db.commit()
    db.refresh(db_subject)
    return db_subject


def delete_subject(db: SessionLocal, subject_id: int):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    delete_subject_chapters(db, subject_id)
    if db_subject:
        db.delete(db_subject)
        db.commit()
        return True
    return False


def create_chapter(db: SessionLocal, input_name: str, subject_id: int):
    new_chapter = models.Chapter()
    new_chapter.name = input_name
    new_chapter.subject_id = subject_id
    new_chapter.hide = False
    db.add(new_chapter)
    db.commit()
    db.refresh(new_chapter)
    return new_chapter


def get_chapters(db: SessionLocal, subject_id: int):
    return db.query(models.Chapter).filter(models.Chapter.subject_id == subject_id).all()


def get_chapters_study(db: SessionLocal):
    return db.query(models.Chapter).filter(models.Chapter.hide == False).all()


def update_chapter_name(db: SessionLocal, chapter_id: int, new_name: str):
    db_chapter = db.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()
    db_chapter.name = new_name
    db.commit()
    return db_chapter


def update_chapter_hide(db: SessionLocal, chapter_id: int, new_hide: bool):
    db_chapter = db.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()
    db_chapter.hide = new_hide
    update_chapter_flashcards(db, chapter_id, new_hide)
    db.commit()
    return db_chapter


def delete_chapter(db: SessionLocal, chapter_id: int):
    db_chapter = db.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()
    delete_chapter_flashcards(db, chapter_id)
    if db_chapter:
        db.delete(db_chapter)
        db.commit()
        return True
    return False


def create_flashcard(db: SessionLocal, chapter_id: int, input_question: str, input_answer: str):
    new_flashcard = models.Flashcard()
    new_flashcard.chapter_id = chapter_id
    new_flashcard.front_of_card = input_question
    new_flashcard.back_of_card = input_answer
    new_flashcard.hide = False
    new_flashcard.correct = False
    db.add(new_flashcard)
    db.commit()
    db.refresh(new_flashcard)
    return new_flashcard


def get_flashcards(db: SessionLocal, chapter_id: int):
    return db.query(models.Flashcard).filter(models.Flashcard.chapter_id == chapter_id).all()


def get_flashcards_study(db: SessionLocal):
    return db.query(models.Flashcard).filter(models.Flashcard.hide == False).all()


def get_flashcards_score(db: SessionLocal):
    correct = db.query(func.count(models.Flashcard.id)).filter(models.Flashcard.correct == True).scalar()
    total = db.query(func.count(models.Flashcard.id)).scalar()
    score = (correct / total) * 100
    return score


def update_flashcard_score(db: SessionLocal):
    db.query(models.Flashcard).update({models.Flashcard.correct: False})
    db.commit()


def update_flashcard_reset_score(db: SessionLocal):
    db.query(models.Flashcard).update({models.Flashcard.correct: False})
    db.commit()


def update_flashcard_question(db: SessionLocal, flashcard_id: int, new_question: str):
    db_flashcard = db.query(models.Flashcard).filter(models.Flashcard.id == flashcard_id).first()
    db_flashcard.front_of_card = new_question
    db.commit()
    return db_flashcard


def update_flashcard_answer(db: SessionLocal, flashcard_id: int, new_answer: str):
    db_flashcard = db.query(models.Flashcard).filter(models.Flashcard.id == flashcard_id).first()
    db_flashcard.back_of_card = new_answer
    db.commit()
    return db_flashcard


def update_flashcard_correct(db: SessionLocal, flashcard_id: int, new_correct: bool):
    db_flashcard = db.query(models.Flashcard).filter(models.Flashcard.id == flashcard_id).first()
    db_flashcard.correct = new_correct
    db.commit()
    return db_flashcard


def update_flashcard_hide(db: SessionLocal, flashcard_id: int, new_hide: bool):
    db_flashcard = db.query(models.Flashcard).filter(models.Flashcard.id == flashcard_id).first()
    db_flashcard.hide = new_hide
    db.commit()
    return db_flashcard


def delete_flashcard(db: SessionLocal, flashcard_id: int):
    db_flashcard = db.query(models.Flashcard).filter(models.Flashcard.id == flashcard_id).first()
    if db_flashcard:
        db.delete(db_flashcard)
        db.commit()
        return True
    return False


