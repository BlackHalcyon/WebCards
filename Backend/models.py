# Classes for Tables will go here
# Create 3 classes for the 3 tables: Subject, Chapter, and Flashcard
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Varchar
from sqlalchemy.orm import relationship

from .database import Base
# Subject variables:
    # id int
    # name str
    # hide bool
Class Subject(Base):
__Tablename__ = "Subject"
id = Column(Integer, primary_key=True, index=True)
name Column (String)
hide = Column(Boolean, default= True)

# Chapter variables:
    # id int
    # subject_id int references subject.id
    # name str
    # hide bool
Class Chapter(Base):
__Tablename__ = "Chapter"
id= Column(Integer, primary_key=True, index=True)
subject_id = Column(Integer, ForeignKey("subject.id"))
name = Column (String)
hide = Column(Boolean, default= True)

# Flashcard variables:
    # id int
    # chapter_id int references chapter.id
    # front_of_card str
    # back_of_card str
    # hide bool
    # correct bool
Class Flashcard(Base):
__Tablename__= "Flashcard"
id = Column(Integer, primary_key=True, index=True)
chapter_id = Column(Integer, ForeignKey("chapter.id"))
front_of_card = Column (String)
back_of_card = Column (String)
hide = Column(Boolean, default= True)
correct = Column(Boolean, default= True)
