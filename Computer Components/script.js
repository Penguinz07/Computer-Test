// Questions and Answers
const matches = {
    RAM: "A Short-term memory that stores data while the computer is running, but loses it when the computer is turned off.",
    ROM: "A Read-only memory that stores essential startup instructions.",
    MOTHERBOARD: "A circuit board that connects all the components of a computer together.",
    CPU: "The brain of the computer that performs calculations and executes instructions.",
    GPU: "The graphics card helps the CPU by handling the graphics in videos and games.",
};

// Add statements here with "True" or "False" as each value.
const trueFalseQuestions = {
    "RAM keeps its stored data when the computer is turned off": "False",
    "ROM is volatile memory": "False",
    "The CPU executes instructions": "True",
    "The operating system helps manage computer hardware and software": "True",
    "Opening too many programs doesn't affect the computer's speed": "False",
    "Recycle bin can sometimes be used to restore deleted files": "True",
    "1 Mb is equal to 1024 KB": "False",
    "The mouse is used to print documents directly": "False",
};

// Each question has four choices and the key of the correct choice.
const multipleChoiceQuestions = {
    "Which component executes instructions?": { a: "CPU", b: "RAM", c: "ROM", d: "Mouse", answer: "a" },
    "Which component is mainly used to process graphics?": { a: "Power supply", b: "GPU", c: "Keyboard", d: "Hard drive", answer: "b" },
    "Which component connects the computer's parts together?": { a: "Monitor", b: "CPU", c: "Motherboard", d: "Mouse", answer: "c" },
    "What is the reason to organize files in folders?": { a: "Makes the computer Faster", b: "To find files easier", c: " Increases the screen privacy", d: "Makes computer reads files faster", answer: "b" },
    "What is the primary function of RAM?": { a: "To store data permanently", b: "To execute instructions", c: "To store data temporarily", d: "To provide power to the computer", answer: "c" },
    "What should we do if a computer freezes?": { a: "Turn it off and on again", b: "Shut it down immediately", c: "Call a customer service", d: "Wait for it to cool down", answer: "a" },
};

const board = document.querySelector(".match-board");
const backButton = document.querySelector(".back");
const status = document.querySelector("#status");
const pageTitle = document.querySelector("#page-title");
const instructions = document.querySelector("#instructions");
const trueFalseSection = document.querySelector("#true-false");
const questionProgress = document.querySelector("#question-progress");
const statement = document.querySelector("#statement");
const trueFalseOptions = document.querySelector("#true-false-options");
const multipleChoiceSection = document.querySelector("#multiple-choice");
const mcqProgress = document.querySelector("#mcq-progress");
const mcqQuestion = document.querySelector("#mcq-question");
const mcqOptions = document.querySelector("#mcq-options");
const entries = Object.entries(matches);
const shuffledAnswers = [...entries];
let selectedTerm = null;
let feedbackTimer;
let trueFalseIndex = 0;
let multipleChoiceIndex = 0;

for (let index = shuffledAnswers.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledAnswers[index], shuffledAnswers[randomIndex]] = [shuffledAnswers[randomIndex], shuffledAnswers[index]];
}

entries.forEach(([label], index) => {
    const term = document.createElement("button");
    term.className = "term";
    term.id = `term-${label.toLowerCase()}`;
    term.type = "button";
    term.setAttribute("aria-pressed", "false");
    term.innerHTML = `<span class="term-number">${String(index + 1).padStart(2, "0")}</span><strong></strong>`;
    term.querySelector("strong").textContent = label;

    const [answerLabel, definition] = shuffledAnswers[index];
    const answer = document.createElement("button");
    answer.className = "answer";
    answer.type = "button";
    answer.dataset.answer = answerLabel.toLowerCase();
    answer.setAttribute("aria-pressed", "false");
    answer.textContent = definition;

    board.append(term, answer);
});

const terms = document.querySelectorAll(".term");
const answers = document.querySelectorAll(".answer");

function clearFeedback() {
    answers.forEach((answer) => answer.classList.remove("is-correct", "is-wrong"));
    window.clearTimeout(feedbackTimer);
}

function selectTerm(term) {
    if (term.classList.contains("is-matched")) return;

    clearFeedback();
    terms.forEach((item) => item.classList.remove("is-selected"));
    term.classList.add("is-selected");
    terms.forEach((item) => item.setAttribute("aria-pressed", String(item === term)));
    selectedTerm = term.id.replace("term-", "");
    status.textContent = `Now choose the definition for ${selectedTerm.toUpperCase()}.`;
}

terms.forEach((term) => {
    term.addEventListener("click", () => selectTerm(term));
});

answers.forEach((answer) => {
    answer.addEventListener("click", () => {
        if (!selectedTerm) {
            status.textContent = "Select RAM or ROM on the left first.";
            return;
        }

        clearFeedback();
        const isCorrect = answer.dataset.answer === selectedTerm;
        answer.classList.add(isCorrect ? "is-correct" : "is-wrong");

        if (isCorrect) {
            const matchedTerm = document.querySelector(`#term-${selectedTerm}`);
            matchedTerm.classList.remove("is-selected");
            matchedTerm.classList.add("is-matched");
            matchedTerm.setAttribute("aria-pressed", "true");
            matchedTerm.disabled = true;
            answer.classList.add("is-matched");
            answer.disabled = true;
            answer.setAttribute("aria-pressed", "true");
            status.textContent = `${selectedTerm.toUpperCase()} matched.`;
            selectedTerm = null;
        } else {
            status.textContent = "Not quite. Try the other definition, or choose a different memory type.";
        }

        feedbackTimer = window.setTimeout(() => {
            answer.classList.remove("is-correct", "is-wrong");
            if (isCorrect && [...terms].every((term) => term.classList.contains("is-matched"))) {
                startTrueFalseLevel();
            }
        }, 2000);
    });
});

function startTrueFalseLevel() {
    board.hidden = true;
    trueFalseSection.hidden = false;
    pageTitle.textContent = "Level 2: True or False";
    instructions.textContent = "Read each statement and choose True or False.";
    trueFalseIndex = 0;
    showTrueFalseQuestion();
}

function showTrueFalseQuestion() {
    const questions = Object.entries(trueFalseQuestions);

    if (trueFalseIndex >= questions.length) {
        startMultipleChoiceLevel();
        return;
    }

    questionProgress.textContent = `Question ${trueFalseIndex + 1} of ${questions.length}`;
    statement.textContent = questions[trueFalseIndex][0];
    trueFalseOptions.hidden = false;
    trueFalseOptions.querySelectorAll("button").forEach((button) => {
        button.disabled = false;
        button.classList.remove("is-correct", "is-wrong");
    });
    status.textContent = "Choose True or False.";
}

trueFalseOptions.addEventListener("click", (event) => {
    const choiceButton = event.target.closest("button[data-choice]");
    if (!choiceButton || choiceButton.disabled) return;

    const [question, expectedAnswer] = Object.entries(trueFalseQuestions)[trueFalseIndex];
    const isCorrect = choiceButton.dataset.choice === expectedAnswer;
    const choiceButtons = trueFalseOptions.querySelectorAll("button");
    choiceButtons.forEach((button) => {
        button.disabled = true;
    });
    choiceButton.classList.add(isCorrect ? "is-correct" : "is-wrong");
    status.textContent = isCorrect ? "Correct." : `Not quite. Try this statement again: ${question}`;

    feedbackTimer = window.setTimeout(() => {
        choiceButton.classList.remove("is-correct", "is-wrong");
        if (isCorrect) {
            trueFalseIndex += 1;
            showTrueFalseQuestion();
        } else {
            choiceButtons.forEach((button) => {
                button.disabled = false;
            });
            status.textContent = "Choose True or False.";
        }
    }, 2000);
});

function startMultipleChoiceLevel() {
    board.hidden = true;
    trueFalseSection.hidden = true;
    multipleChoiceSection.hidden = false;
    pageTitle.textContent = "Level 3: Multiple Choice";
    instructions.textContent = "Choose the best answer from A, B, C, or D.";
    multipleChoiceIndex = 0;
    showMultipleChoiceQuestion();
}

function showMultipleChoiceQuestion() {
    const questions = Object.entries(multipleChoiceQuestions);

    if (multipleChoiceIndex >= questions.length) {
        mcqProgress.textContent = "Complete";
        mcqQuestion.textContent = "You finished all three levels.";
        mcqOptions.hidden = true;
        status.textContent = "All multiple-choice questions answered correctly.";
        return;
    }

    const [question, choices] = questions[multipleChoiceIndex];
    mcqProgress.textContent = `Question ${multipleChoiceIndex + 1} of ${questions.length}`;
    mcqQuestion.textContent = question;
    mcqOptions.hidden = false;
    mcqOptions.replaceChildren();

    Object.entries(choices).forEach(([letter, choiceText]) => {
        if (letter === "answer") return;
        const option = document.createElement("button");
        option.className = "multiple-choice-option";
        option.type = "button";
        option.dataset.choice = letter;
        option.innerHTML = `<span class="multiple-choice-letter"></span><span class="multiple-choice-text"></span>`;
        option.querySelector(".multiple-choice-letter").textContent = letter.toUpperCase();
        option.querySelector(".multiple-choice-text").textContent = choiceText;
        mcqOptions.append(option);
    });
    status.textContent = "Choose A, B, C, or D.";
}

mcqOptions.addEventListener("click", (event) => {
    const option = event.target.closest("button[data-choice]");
    if (!option || option.disabled) return;

    const [, choices] = Object.entries(multipleChoiceQuestions)[multipleChoiceIndex];
    const isCorrect = option.dataset.choice === choices.answer.toLowerCase();
    mcqOptions.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
    });
    option.classList.add(isCorrect ? "is-correct" : "is-wrong");
    status.textContent = isCorrect ? "Correct." : "Not quite. Try another option.";

    feedbackTimer = window.setTimeout(() => {
        option.classList.remove("is-correct", "is-wrong");
        if (isCorrect) {
            multipleChoiceIndex += 1;
            showMultipleChoiceQuestion();
        } else {
            mcqOptions.querySelectorAll("button").forEach((button) => {
                button.disabled = false;
            });
            status.textContent = "Choose A, B, C, or D.";
        }
    }, 2000);
});

backButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});