
async function generateQuiz(categoryId) {
    const apiUrl = `https://opentdb.com/api.php?amount=10&category=${categoryId}&type=multiple`;    

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

function displayQuestions(questions) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ""; 

    questions.forEach((question, index) => {
        const answers = [...question.incorrect_answers, question.correct_answer];
        shuffleArray(answers);  

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

    quizContainer.innerHTML += `<button id="submit-quiz">Submit Quiz</button>`;

    document.getElementById('submit-quiz').addEventListener('click', function () {
        checkAnswers(questions);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

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

document.getElementById('generate-quiz').addEventListener('click', function () {
    const categoryId = document.getElementById('topic-select').value;
    generateQuiz(categoryId);
});
