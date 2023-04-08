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
