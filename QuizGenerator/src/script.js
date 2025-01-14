// Fetch and generate quiz questions based on the selected category
async function generateQuiz(categoryId) {
    const apiUrl = `https://opentdb.com/api.php?amount=5&category=${categoryId}&type=multiple`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.response_code === 0) {
            displayQuestions(data.results);
        } else {
            alert("No questions found for this topic.");
        }
    } catch (error) {
        console.error("Error fetching questions:", error);
        alert("Failed to generate quiz. Please try again.");
    }
}

// Display quiz questions and answers in the container
function displayQuestions(questions) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = "";  // Clear previous content

    questions.forEach((question, index) => {
        const answers = [...question.incorrect_answers, question.correct_answer];
        shuffleArray(answers);  // Shuffle the answer options

        let questionHtml = `<div>
            <h3>${index + 1}. ${question.question}</h3>`;
        
        answers.forEach(answer => {
            questionHtml += `
                <label>
                    <input type="radio" name="question${index}" value="${answer}">
                    ${answer}
                </label><br>`;
        });

        questionHtml += `</div>`;
        quizContainer.innerHTML += questionHtml;
    });

    // Add submit button for quiz
    quizContainer.innerHTML += `<button id="submit-quiz">Submit Quiz</button>`;

    // Attach event listener for quiz submission
    document.getElementById('submit-quiz').addEventListener('click', function () {
        checkAnswers(questions);
    });
}

// Shuffle answer options using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Check answers and calculate the score
function checkAnswers(questions) {
    let score = 0;

    questions.forEach((question, index) => {
        const selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);

        if (selectedAnswer && selectedAnswer.value === question.correct_answer) {
            score++;
        }
    });

    alert(`You scored ${score} out of ${questions.length}`);
}

// Event listener for quiz generation
document.getElementById('generate-quiz').addEventListener('click', function () {
    const categoryId = document.getElementById('topic-select').value;
    generateQuiz(categoryId);
});
