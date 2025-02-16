// Timer CountDown Functionality
let timeInterval;

function timerCountDown(questionElement) {
  const timerElement = questionElement.querySelector("#timer span");
  let time = 30; // 30s
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  timerElement.textContent = time;
  timeInterval = setInterval(() => {
    time--;
    timerElement.textContent = time;
    if (time <= 0) {
      clearInterval(timeInterval);
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => input.disabled = true);
      scrollToNextQuestion(questionElement);
    }
  }, 1000);
}

// Scroll Functionality
function scrollToNextQuestion(currentQuestion) {
  if (timeInterval) {
    clearInterval(timeInterval);
  }

  let nextQuestion = currentQuestion.nextElementSibling;

  // Loop through siblings until a '.question' is found
  while (nextQuestion) {
    if (nextQuestion.classList.contains("question")) {
      nextQuestion.scrollIntoView({ behavior: "smooth", block: "center" });
      timerCountDown(nextQuestion); // Start timer for the next question
      return;
    }
    nextQuestion = nextQuestion.nextElementSibling;
  }
  showResults();
}

function showResults() {
  let score = 0;
  const questions = document.querySelectorAll(".question");
  questions.forEach((question, index) => {
    const options = question.querySelectorAll(".option");
    const inputs = question.querySelectorAll("input");
    const correctAnswer = QuestionsData[index].correct_answer;

    // Disable input
    inputs.forEach((input) => {
      input.disabled = true;
    });

    // Retrieve the cosen answer and check if it is the correct one
    let userAnswer = null;

    inputs.forEach((input) =>{
      if(input.checked){
        userAnswer = input.value;
      }
    });

    if (userAnswer === correctAnswer){
      score += 1;
    }

    // Highlight the correct answer
    options.forEach((option) => {
      const input = document.getElementById(option.getAttribute("for"));
      const optionValue = input.value;

      if (optionValue === correctAnswer) {
        option.classList.add("correct");
      } else if (input.checked && optionValue !== correctAnswer) {
        option.classList.add("incorrect");
      }
    });
  });

  // Update the final score and total questions
  const finalScoreElement = document.querySelector(".final-score");
  const totalQuestionsElement = document.querySelector(".total-questions");
  finalScoreElement.textContent = score;
  totalQuestionsElement.textContent = questions.length;

  // Scroll to the top and show the results
  const result = document.querySelector(".results");
  result.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Function to generate questions dynamically
function generateQuestions() {
  const quizContainer = document.querySelector('.quiz-container');
  if (QuestionsData.length > 0) {
    QuestionsData.forEach((question, index) => {
      const questionElement = document.createElement('div');
      questionElement.classList.add('question');
      questionElement.innerHTML = `
        <div class="score-bar">
          <div id="number"><span>Question ${index + 1}</span></div>
          <div id="timer">Time: <span></span></div>
        </div>
        <div class="properties">
          <p>Type: <span>${question.type}</span></p>
          <p>Category: <span>${question.category}</span></p>
          <p>Difficulty: <span>${question.difficulty}</span></p>
        </div>
        <h2>${question.question}</h2>
        <div class="options">
          ${question.incorrect_answers.map((answer, i) => `
            <input type="radio" name="question${index}" id="option-${index}-${i}" value="${answer}" />
            <label class="option" for="option-${index}-${i}">${answer}</label>
          `).join('')}
          <input type="radio" name="question${index}" id="option-${index}-${question.incorrect_answers.length}" value="${question.correct_answer}" />
          <label class="option" for="option-${index}-${question.incorrect_answers.length}">${question.correct_answer}</label>
        </div>
        <button class="next">Next <i class="fa fa-arrow-right"></i></button>
      `;
      quizContainer.appendChild(questionElement);
    });

    // Add event listeners to next buttons
    const nextButtons = document.querySelectorAll(".next");
    nextButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const currentQuestion = this.closest(".question");
        scrollToNextQuestion(currentQuestion);
      });
    });

    // Start the timer automatically for the first question
    const firstQuestion = document.querySelector(".question");
    if (firstQuestion) {
      timerCountDown(firstQuestion);
    }
  } else {
    quizContainer.innerHTML = '<p class="generate-message">No questions available. Please generate questions first.</p>';
  }
}

// Fetch questions from localStorage
const QuestionsData = JSON.parse(localStorage.getItem('questionsData')) || [];

document.addEventListener("DOMContentLoaded", function () {
  generateQuestions(); // Generate questions when the DOM is loaded

  const nextButtons = document.querySelectorAll(".next");

  nextButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const currentQuestion = this.closest(".question");
      scrollToNextQuestion(currentQuestion);
    });
  });

  // Start the timer automatically for the first question
  const firstQuestion = document.querySelector(".question");
  if (firstQuestion) {
    timerCountDown(firstQuestion);
  }
});