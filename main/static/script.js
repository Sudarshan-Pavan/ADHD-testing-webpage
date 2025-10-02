document.addEventListener("DOMContentLoaded", function () {
    let currentQuestionIndex = 0;
    let answers = new Array(20).fill(null); // Store answers for each question

    const questions = [
        "Do you often feel restless?",
        "Do you have trouble focusing on tasks?",
        "Do you frequently interrupt conversations?",
        "Do you find it hard to complete long projects?",
        "Do you often misplace things?",
        "Do you feel impatient while waiting in lines?",
        "Do you have difficulty following detailed instructions?",
        "Do you get easily distracted by noises?",
        "Do you have trouble organizing daily tasks?",
        "Do you frequently forget appointments?",
        "Do you talk excessively in social situations?",
        "Do you feel like you are always on the go?",
        "Do you struggle with time management?",
        "Do you have difficulty listening to others?",
        "Do you procrastinate important tasks?",
        "Do you struggle to sit still for long periods?",
        "Do you make careless mistakes in work?",
        "Do you find it hard to prioritize tasks?",
        "Do you get easily bored and seek new activities?",
        "Do you have difficulty following through with commitments?"
    ];

    const questionCard = document.getElementById("question-card");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const submitBtn = document.getElementById("submit-btn");
    const resultsContainer = document.getElementById("results-container");

    function updateProgressBar(index) {
        const progressBar = document.getElementById("progress-bar");
        const progress = ((index + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        document.getElementById("progress-text").textContent = `${Math.round(progress)}%`;

        const hue = 50 + ((340 - 50) * (progress / 100));
        progressBar.style.backgroundColor = `hsl(${hue}, 85%, 55%)`;
    }

    function loadQuestion(index) {
        // Start the flip-out animation
        questionCard.classList.remove("flip-in"); // Ensure flip-in is removed before flipping out
        questionCard.classList.add("flip-out");

        setTimeout(() => {
            // Update the question content AFTER flip-out completes
            questionCard.innerHTML = `
                <div class="question">
                    <p>${index + 1}. ${questions[index]}</p>
                    <label><input type="radio" name="q${index}" value="1" ${answers[index] === 1 ? "checked" : ""}> Rarely</label>
                    <label><input type="radio" name="q${index}" value="2" ${answers[index] === 2 ? "checked" : ""}> Sometimes</label>
                    <label><input type="radio" name="q${index}" value="3" ${answers[index] === 3 ? "checked" : ""}> Often</label>
                    <label><input type="radio" name="q${index}" value="4" ${answers[index] === 4 ? "checked" : ""}> Very Often</label>
                </div>
            `;

            // Remove flip-out and add flip-in animation
            questionCard.classList.remove("flip-out");
            questionCard.classList.add("flip-in");

            // Update button visibility
            prevBtn.disabled = index === 0;
            nextBtn.style.display = index < questions.length - 1 ? "inline-block" : "none";
            submitBtn.style.display = index === questions.length - 1 ? "inline-block" : "none";

            updateProgressBar(index);

        }, 500); // Delay should match the flip-out animation duration
    }

    prevBtn.addEventListener("click", function () {
        // Do not enforce selection when going back
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
        }
    });

    function saveAnswer(showAlert = false) {
        let selectedOption = document.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
        
        if (selectedOption) {
            answers[currentQuestionIndex] = parseInt(selectedOption.value);
            return true;
        } else {
            if (showAlert) {
                alert("Please select an answer before proceeding.");
            }
            return false;
        }
    }
    

    nextBtn.addEventListener("click", function () {
        if (saveAnswer()) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        }
    });

    prevBtn.addEventListener("click", function () {
        // Do not enforce selection when going back
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
        }
    });

    submitBtn.addEventListener("click", function () {
        saveAnswer();
        fetch("http://127.0.0.1:5000/submit-test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers: answers })
        })
        .then(response => response.json())
        .then(data => {
            questionCard.style.display = "none";
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
            submitBtn.style.display = "none";
            
            resultsContainer.style.display = "block";
            resultsContainer.innerHTML = `
                <h2>Test Results</h2>
                <p><strong>Total Score:</strong> ${data.total_score}</p>
                <p><strong>Hyperactivity Score:</strong> ${data.hyperactivity_score}</p>
                <p><strong>Inattention Score:</strong> ${data.inattention_score}</p>
                <p><strong>Impulsivity Score:</strong> ${data.impulsivity_score}</p>
                <p><strong>Additional Questiona Score:</strong> ${data.additional_questions_score}</p>
                <p><strong>Risk Level:</strong> ${data.risk_level}</p>
                <p>Recommendation: ${data.recommendation}</p>
            `;
        })
        .catch(error => console.error("Error:", error));
    });

    window.addEventListener("load", function() {
        // Check if the page was refreshed
        if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
            window.location.href = "/"; // Redirect to home page if refreshed
        }
    });
    
    // Ensure the start button takes the user to the test page
    document.addEventListener("DOMContentLoaded", function() {
        const startButton = document.getElementById("start-button");
        if (startButton) {
            startButton.addEventListener("click", function() {
                window.location.href = "/test"; // Navigate to test page
            });
        }
    });    

    loadQuestion(currentQuestionIndex);
});
