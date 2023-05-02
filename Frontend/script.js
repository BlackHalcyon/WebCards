//CLICKS
$(document).ready(function () {
  if ($('#subjects').length) {
    fetchSubjects();
  }

  if ($('#chapters').length) {
    const urlParams = new URLSearchParams(window.location.search);
    const subjectId = urlParams.get('subject_id');
    if (subjectId) {
      fetchChapters(subjectId);
    } else {
      console.error('Subject ID is missing from URL');
    }
  }

  if ($('#flashcards').length) {
  const urlParams = new URLSearchParams(window.location.search);
  const chapterId = urlParams.get('chapter_id');
    if (chapterId) {
      fetchFlashcards(chapterId);
    } else {
      console.error('Chapter ID is missing from URL');
    }
  }

  if ($('#flashcardScore').length) {
    fetchFlashcardScore();
  }

   if ($('#flashcardContainer').length) {
    fetchFlashcardsStudy();
  }

  $('#settingsButton').click(function () {
    window.location.href = 'settings.html';
  });

  $('body').on('click', '#studyActiveButton', function (event) {
  event.preventDefault();
  resetFlashcardScore();
  window.location.href = 'study-active.html';
  });

  $('body').on('click', '#studyActiveNav', function (event) {
    event.preventDefault();
    resetFlashcardScore();
    window.location.href = 'study-active.html';
  });

  $('.subject-hide-checkbox').on('change', toggleSubjectHide);

  $('#createSubjectButton').click(createSubject);

  $('#createChapterButton').on('click', createChapter);

  $('#createFlashcardButton').on('click', createFlashcard);

});

//FUNCTIONS
function editChapters() {
  const subjectId = $(this).data('subject-id');
  window.location.href = `create-edit-chapters.html?subject_id=${subjectId}`;
}

//creates new subject
function createSubject() {
  const subjectName = prompt('Enter the new subject name:');

  if (subjectName) {
    $.ajax({
      url: `http://127.0.0.1:8000/create/subject/${subjectName}`,
      type: 'PUT',
      success: function (data) {
        $('#subjects').empty();
        fetchSubjects();
      },
      error: function (error) {
        console.error('Error creating subject:', error);
      },
    });
  }
}

//creates a new chapter
function createChapter() {
  const chapterName = prompt('Enter the new chapter name:');
  const urlParams = new URLSearchParams(window.location.search);
  const subjectId = urlParams.get('subject_id');

  if (chapterName && subjectId) {
    $.ajax({
      url: `http://127.0.0.1:8000/create/chapter/${chapterName}/${subjectId}`,
      type: 'PUT',
      success: function (data) {
        $('#chapters').empty();
        fetchChapters(subjectId);
      },
      error: function (error) {
        console.error('Error creating chapter:', error);
      },
    });
  }
}

function createFlashcard() {
  const question = prompt('Enter the question:');
  const answer = prompt('Enter the answer:');
  const urlParams = new URLSearchParams(window.location.search);
  const chapterId = urlParams.get('chapter_id');

  if (question && answer && chapterId) {
    $.ajax({
      url: `http://127.0.0.1:8000/create/flashcard/${chapterId}/${question}/${answer}`,
      type: 'PUT',
      success: function (data) {
        $('#flashcards').empty();
        fetchFlashcards(chapterId);
      },
      error: function (error) {
        console.error('Error creating flashcard:', error);
      },
    });
  }
}



//retrieves all subjects for display
function fetchSubjects() {
  $.ajax({
    url: 'http://127.0.0.1:8000/get/subjects',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      populateSubjects(data);
    },
    error: function (error) {
      console.error('Error fetching subjects:', error);
    },
  });
}

//displays all subjects with associated buttons
function populateSubjects(subjects) {
  subjects.forEach(function (subject) {
    $('#subjects').append(`
      <div class="editButtons">
        <div class="editButtons-wrapper">
          <span>${subject.name}</span>
          <div class="buttons-container">
            <button class="editSubjectButton" data-subject-id="${subject.id}">Edit Subject Name</button>
            <button class="editChaptersButton" data-subject-id="${subject.id}">Edit Chapters</button>
            <label>
              <input class="hideSubjectCheckbox" data-subject-id="${subject.id}" type="checkbox" ${subject.hide ? 'checked' : ''}>
              Hide
            </label>
            <button class="deleteSubjectButton" data-subject-id="${subject.id}">Delete</button>
          </div>
        </div>
      </div>
    `);
  });

  $('.editSubjectButton').click(editSubjectName);
  $('.editChaptersButton').click(editChapters);
  $('.hideSubjectCheckbox').change(toggleSubjectHide);
  $('.deleteSubjectButton').click(deleteSubject);
}

//prompts user to enter a new name for a subject
function editSubjectName() {
  const subjectId = $(this).data('subject-id');
  const currentName = $(this).prev().text();
  const newName = prompt('Enter the new subject name:', currentName);

  if (newName && newName !== currentName) {
    updateSubjectName(subjectId, newName);
  }
}

//calls the endpoint to update with the new subject name
function updateSubjectName(subjectId, newName) {
  $.ajax({
    url: `http://127.0.0.1:8000/update/subject/name/${subjectId}/${newName}/`,
    type: 'POST',
    success: function (data) {
      $('#subjects').empty();
      fetchSubjects();
    },
    error: function (error) {
      console.error('Error updating subject name:', error);
    },
  });
}

function toggleSubjectHide() {
  const subjectId = $(this).data('subject-id');
  const subjectHide = $(this).prop('checked');
  updateSubjectHide(subjectId, subjectHide).then((updatedSubject) => {
    $(this).prop('checked', updatedSubject.hide);
  });
}

function updateSubjectHide(subjectId, subjectHide) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `http://127.0.0.1:8000/update/subject/hide/${subjectId}/${subjectHide}`,
      type: 'POST',
      success: function (data) {
        resolve(data);
      },
      error: function (error) {
        console.error('Error updating subject hide:', error);
        reject(error);
      },
    });
  });
}


//deletes subject and all associated chapters and flashcards
function deleteSubject() {
  const subjectId = $(this).data('subject-id');

  $.ajax({
    url: `http://127.0.0.1:8000/delete/subject/${subjectId}`,
    type: 'DELETE',
    success: function (data) {
      $('#subjects').empty();
      fetchSubjects();
    },
    error: function (error) {
      console.error('Error deleting subject:', error);
    },
  });
}

//retrieves all chapters for display depending on subject selected
function fetchChapters(subjectId) {
  $.ajax({
    url: `http://127.0.0.1:8000/get/chapters/${subjectId}`,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      populateChapters(data);
    },
    error: function (error) {
      console.error('Error fetching chapters:', error);
    },
  });
}

//displays all chapters with associated buttons
function populateChapters(chapters) {
  chapters.forEach(function (chapter) {
    $('#chapters').append(`
      <div class="editButtons">
        <div class="editButtons-wrapper">
        <span>${chapter.name}</span>
        <div class="buttons-container">
        <button class="editChapterButton" data-chapter-id="${chapter.id}">Edit Chapter Name</button>
        <button class="editFlashcardsButton" data-chapter-id="${chapter.id}">Edit Flashcards</button>
        <label>
          <input class="hideChapterCheckbox" data-chapter-id="${chapter.id}" type="checkbox" ${chapter.hide ? 'checked' : ''}>
          Hide
        </label>
        <button class="deleteChapterButton" data-chapter-id="${chapter.id}">Delete</button>
      </div>
    `);
  });
  $('.editChapterButton').click(editChapterName);
  $('.editFlashcardsButton').click(editFlashcards);
  $('.hideChapterCheckbox').change(toggleChapterHide);
  $('.deleteChapterButton').click(deleteChapter);
}

function editChapterName() {
  const chapterId = $(this).data('chapter-id');
  const currentName = $(this).prev().text();
  const newName = prompt('Enter the new chapter name:', currentName);

  if (newName && newName !== currentName) {
    updateChapterName(chapterId, newName);
  }
}

function updateChapterName(chapterId, newName) {
  $.ajax({
    url: `http://127.0.0.1:8000/update/chapter/name/${chapterId}/${newName}/`,
    type: 'POST',
    success: function (data) {
      $('#chapters').empty();
      const urlParams = new URLSearchParams(window.location.search);
      fetchChapters(urlParams.get('subject_id'));
    },
    error: function (error) {
      console.error('Error updating chapter name:', error);
    },
  });
}

// Update chapter hide connect to endpoint
function updateChapterHide(chapterId, chapterHide) {
  $.ajax({
    url: `http://127.0.0.1:8000/update/chapter/hide/${chapterId}/${chapterHide}`,
    type: 'POST',
    success: function (data) {
      $('#chapters').empty();
      const urlParams = new URLSearchParams(window.location.search);
      fetchChapters(urlParams.get('subject_id'));
    },
    error: function (error) {
      console.error('Error updating chapter hide:', error);
    },
  });
}

// update chapter hide checkbox
function toggleChapterHide() {
  const chapterId = $(this).data('chapter-id');
  const chapterHide = $(this).prop('checked');
  updateChapterHide(chapterId, chapterHide);
}

function deleteChapter() {
  const chapterId = $(this).data('chapter-id');

  $.ajax({
    url: `http://127.0.0.1:8000/delete/chapter/${chapterId}`,
    type: 'DELETE',
    success: function (data) {
      $('#chapters').empty();
      const urlParams = new URLSearchParams(window.location.search);
      fetchChapters(urlParams.get('subject_id'));
    },
    error: function (error) {
      console.error('Error deleting chapter:', error);
    },
  });
}

function editFlashcards() {
  const chapterId = $(this).data('chapter-id');
  window.location.href = `create-edit-flashcards.html?chapter_id=${chapterId}`;
}

function fetchFlashcards(chapterId) {
  $.ajax({
    url: `http://127.0.0.1:8000/get/flashcards/${chapterId}`,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      populateFlashcards(data);
    },
    error: function (error) {
      console.error('Error fetching flashcards:', error);
    },
  });
}

function populateFlashcards(flashcards) {
  const flashcardsContainer = $('#flashcards');
  flashcards.forEach(function (flashcard) {
    flashcardsContainer.append(`
      <div class="editButtons">
        <div class="editButtons-wrapper">
          <span>${flashcard.front_of_card}</span>
          <span>${flashcard.back_of_card}</span>
          <div class="buttons-container">
            <button class="editQuestionButton" data-flashcard-id="${flashcard.id}">Edit Question</button>
            <button class="editAnswerButton" data-flashcard-id="${flashcard.id}">Edit Answer</button>
            <label>
              <input class="hideFlashcardCheckbox" data-flashcard-id="${flashcard.id}" type="checkbox" ${flashcard.hide ? 'checked' : ''}>
              Hide
            </label>
            <button class="deleteFlashcardButton" data-flashcard-id="${flashcard.id}">Delete</button>
          </div>
        </div>
      </div>
    `);
    $('.editQuestionButton').click(editFlashcardQuestion);
    $('.editAnswerButton').click(editFlashcardAnswer);
    $('.hideFlashcardCheckbox').change(updateFlashcardHide);
    $('.deleteFlashcardButton').click(deleteFlashcard);
  });
}

// Edit the flashcard question only
function editFlashcardQuestion() {
  const flashcardId = $(this).data('flashcard-id');
  const currentQuestion = $(this).prev().text();

  const newQuestion = prompt('Enter the new question:', currentQuestion);

  if (newQuestion && newQuestion !== currentQuestion) {
    updateFlashcardQuestion(flashcardId, newQuestion, null);
  }
}

// Update the flashcard with question
function updateFlashcardQuestion(flashcardId, newQuestion) {
  $.ajax({
    url: `http://127.0.0.1:8000/update/flashcard/question/${flashcardId}/${newQuestion}`,
    type: 'POST',
    success: function (data) {
      $('#flashcards').empty();
      const urlParams = new URLSearchParams(window.location.search);
      fetchFlashcards(urlParams.get('chapter_id'));
    },
    error: function (error) {
      console.error('Error updating flashcard:', error);
    },
  });
}

// Edit the flashcard answer only
function editFlashcardAnswer() {
  const flashcardId = $(this).data('flashcard-id');
  const currentAnswer = $(this).prev().prev().text();

  const newAnswer = prompt('Enter the new answer:', currentAnswer);

  if (newAnswer && newAnswer !== currentAnswer) {
    updateFlashcardAnswer(flashcardId, newAnswer);
  }
}

function updateFlashcardAnswer(flashcardId, newAnswer) {
  $.ajax({
    url: `http://127.0.0.1:8000/update/flashcard/answer/${flashcardId}/${newAnswer}`,
    type: 'POST',
    success: function (data) {
      $('#flashcards').empty();
      const urlParams = new URLSearchParams(window.location.search);
      fetchFlashcards(urlParams.get('chapter_id'));
    },
    error: function (error) {
      console.error('Error updating flashcard:', error);
    },
  });
}

// Update the flashcard hide status
function updateFlashcardHide() {
  const flashcardId = $(this).data('flashcard-id');
  const newHideStatus = $(this).prop('checked');

  $.ajax({
    url: `http://127.0.0.1:8000/update/flashcard/hide/${flashcardId}/${newHideStatus}`,
    type: 'POST',
    data: {},
    success: function (data) {
      $('#flashcards').empty();
      const urlParams = new URLSearchParams(window.location.search);
      fetchFlashcards(urlParams.get('chapter_id'));
    },
    error: function (error) {
      console.error('Error updating flashcard hide status:', error);
    },
  });
}

//deletes flashcard
function deleteFlashcard() {
  const flashcardId = $(this).data('flashcard-id');

  $.ajax({
    url: `http://127.0.0.1:8000/delete/flashcard/${flashcardId}`,
    type: 'DELETE',
    success: function (data) {
      $('#flashcards').empty();
      const urlParams = new URLSearchParams(window.location.search);
      fetchFlashcards(urlParams.get('chapter_id'));
    },
    error: function (error) {
      console.error('Error deleting flashcard:', error);
    },
  });
}

//retrieves the flashcard score to display
function fetchFlashcardScore() {
  $.ajax({
    url: 'http://127.0.0.1:8000/get/flashcard/score/mode',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      displayFlashcardScore(data);
    },
    error: function(error) {
      console.error('Error fetching flashcard score:', error);
    },
  });
}

//displays the % of cards correct / total
function displayFlashcardScore(score) {
  $('#flashcardScore').text(score + '%');
}

//gets all of the flashcards to set up study mode when the active page is opened
function fetchFlashcardsStudy() {
  $.ajax({
    url: `http://127.0.0.1:8000/get/flashcards/study/mode`,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      initializeFlashcardSession(data);
    },
    error: function (error) {
      console.error('Error fetching flashcards:', error);
    },
  });
}

//displays the flashcards for the study view
let flashcards = [];
let currentFlashcardIndex = 0;
let showingFront = true;

function initializeFlashcardSession(data) {
  console.log('Fetched flashcards:', data);
  flashcards = data;
  currentFlashcardIndex = 0;
  showFlashcardFront();
}

//displays the front of the flashcard in the html container and sets buttons for front
function showFlashcardFront() {
  if (flashcards[currentFlashcardIndex]) {
    $('#flashcardContainer').html(`
      <p>${flashcards[currentFlashcardIndex].front_of_card}</p>
      <button onclick="flipFlashcard()">Flip</button>
    `);
    showingFront = true;
  }
}

//displays the back of the flashcard in the html container and sets buttons for back
function showFlashcardBack() {
  if (flashcards[currentFlashcardIndex]) {
    $('#flashcardContainer').html(`
      <p>${flashcards[currentFlashcardIndex].back_of_card}</p>
      <button onclick="correctAnswer()">Correct</button>
      <button onclick="wrongAnswer()">Wrong</button>
    `);
    showingFront = false;
  }
}

//called when user selects flip to show other side of flashcard
function flipFlashcard() {
  if (showingFront) {
    showFlashcardBack();
  } else {
    showFlashcardFront();
  }
}

//moves to the next flashcard, called when "correct" or "wrong" is clicked
function nextFlashcard() {
  currentFlashcardIndex++;
  if (currentFlashcardIndex >= flashcards.length) {
    currentFlashcardIndex = 0; // Loop back to the first flashcard if at the end
  }
  showFlashcardFront();
}

// if "correct" is selected, flashcard.correct is updated to true, then move to next flashcard and refresh the score
function correctAnswer() {
  const flashcard = flashcards[currentFlashcardIndex];
  const flashcardId = flashcard.id;
  const newCorrect = true;

  $.ajax({
    url: `http://127.0.0.1:8000/update/flashcard/correct/${flashcardId}/${newCorrect}`,
    type: 'POST',
    success: function (data) {
      // Refresh the flashcards list
      fetchFlashcardsStudy();
      nextFlashcard();
      fetchFlashcardScore();
    },
    error: function (error) {
      console.error('Error updating flashcard:', error);
    },
  });
}

//if "wrong" is selected, flashcard.correct is updated to false, then move to next flashcard and refresh the score
function wrongAnswer() {
  const flashcard = flashcards[currentFlashcardIndex];
  const flashcardId = flashcard.id;
  const newQuestion = flashcard.front_of_card;
  const newAnswer = flashcard.back_of_card;
  const newCorrect = false;
  const newHide = flashcard.hide;

  $.ajax({
    url: `http://127.0.0.1:8000/update/flashcard/${flashcardId}/${newQuestion}/${newAnswer}/${newCorrect}/${newHide}`,
    type: 'POST',
    success: function (data) {
      nextFlashcard();
      fetchFlashcardScore();
    },
    error: function (error) {
      console.error('Error updating flashcard:', error);
    },
  });
}

//Sets all flashcards.correct to false, so score is 0 at start
function resetFlashcardScore() {
  $.ajax({
    url: 'http://127.0.0.1:8000/update/flashcard/reset/score',
    type: 'POST',
    async: false,
    success: function (data) {
      console.log('Flashcard score reset successfully');
    },
    error: function (error) {
      console.error('Error resetting flashcard score:', error);
    },
  });
}