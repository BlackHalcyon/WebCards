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
    }
  }

  if ($('#flashcardScore').length) {
    fetchFlashcardScore();
  }

   if ($('#flashcardContainer').length) {
    fetchFlashcards();
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

});

//FUNCTIONS
function editChapters() {
  const subjectId = $(this).data('subject-id');
  window.location.href = `settings-chapters.html?subject_id=${subjectId}`;
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
      <div class="subject">
        <span>${subject.name}</span>
        <button class="editSubjectButton" data-subject-id="${subject.id}">Edit Subject Name</button>
        <button class="editChaptersButton" data-subject-id="${subject.id}">Edit Chapters</button>
        <label>
          <input class="hideSubjectCheckbox" data-subject-id="${subject.id}" type="checkbox" ${subject.hide ? 'checked' : ''}>
          Hide
        </label>
        <button class="deleteSubjectButton" data-subject-id="${subject.id}">Delete</button>
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
      <div class="chapter">
        <span>${chapter.name}</span>
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

// Update chapter hide connect to endpoint
function updateChapterHide(chapterId, chapterHide) {
  $.ajax({
    url: `http://127.0.0.1:8000/update/chapter/hide/${chapterId}/${chapterHide}`,
    type: 'POST',
    success: function (data) {
      $('#chapters').empty();
      fetchChapters();
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

//displays the % of cards correct / total
function displayFlashcardScore(score) {
  $('#flashcardScore').text(score + '%');
}

//gets all of the flashcards to set up study mode when the active page is opened
function fetchFlashcards() {
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

//displays the front text of the flashcard in the html container and sets buttons for front
function showFlashcardFront() {
  if (flashcards[currentFlashcardIndex]) {
    $('#flashcardContainer').html(`
      <p>${flashcards[currentFlashcardIndex].front_of_card}</p>
      <button onclick="flipFlashcard()">Flip</button>
    `);
    showingFront = true;
  }
}

//displays the back text of the flashcard in the html container and sets buttons for back
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
  const newQuestion = flashcard.front_of_card;
  const newAnswer = flashcard.back_of_card;
  const newCorrect = true;
  const newHide = flashcard.hide;

  $.ajax({
    url: `http://127.0.0.1:8000/update/flashcard/${flashcardId}/${newQuestion}/${newAnswer}/${newCorrect}/${newHide}`,
    type: 'POST',
    success: function (data) {
      // Refresh the flashcards list
      fetchFlashcards();
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