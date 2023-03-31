# Classes for Tables will go here
# Create 3 classes for the 3 tables: Subject, Chapter, and Flashcard

# Subject variables:
    # id int
    # name str
    # hide bool

# Chapter variables:
    # id int
    # subject_id int references subject.id
    # name str
    # hide bool

# Flashcard variables:
    # id int
    # chapter_id int references chapter.id
    # front_of_card str
    # back_of_card str
    # hide bool
    # correct bool

