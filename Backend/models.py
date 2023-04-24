from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    hide = Column(Boolean, default= True)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    name = Column(String)
    hide = Column(Boolean, default=True)


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id"))
    front_of_card = Column(String)
    back_of_card = Column(String)
    hide = Column(Boolean, default=False)
    correct = Column(Boolean, default=False)


