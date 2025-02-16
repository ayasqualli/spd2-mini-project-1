document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("api-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Collect the form data
      const qsts = document.getElementById("qsts").value;
      const category = document.getElementById("category").value;
      const difficulty = document.getElementById("diff").value;
      const type = document.getElementById("type").value;

      // Construct the API URL for the call
      let apiURL = `https://opentdb.com/api.php?amount=${qsts}`;
      if (category !== 'any') {
        apiURL += `&category=${category}`;
      }
      if (difficulty !== 'any') {
        apiURL += `&difficulty=${difficulty}`;
      }
      if (type !== 'any') {
        apiURL += `&type=${type}`;
      }

      // Fetch the questions
      fetchQuestions(apiURL);
    });
});

async function fetchQuestions(URL) {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    // Check if the API returned results
    if (data.response_code === 0 && data.results.length > 0) {
      // Store the questions in localStorage
      localStorage.setItem('questionsData', JSON.stringify(data.results));
      // Redirect to the quiz page
      window.location.href = 'index.html';
    } else {
      alert("No questions found. Please try again with different settings.");
    }
  } catch (error) {
    console.error('Error fetching questions: ', error);
    alert("An error occurred while generating questions. Please try again.");
  }
}