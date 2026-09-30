// Edit these dictionaries to change the three game levels.
const matches = {
    "Touching electrical components with wet hands": "Can be dangerous.",
    "Exposed wires": "Should be fixed immediately.",
    "Rubber gloves": "Can protect from electrical shocks",
    "Electricity": "Can cause fires.",
    "Unplugging a component": "Should be done with care.",
};

const trueFalseQuestions = {
    "An open circuit allows electricity to flow": "False",
    "A light bulb converts current to light": "False",
    "Pouring water on top of an exposed wire is dangerous": "True",
    "It is safe to touch electric wires with dry hands": "False",
    "Wood is usually used to conduct electricity": "False",
};

// Each question has four choices (a-d); answer is the correct choice letter.
const multipleChoiceQuestions = {
    "What is the unit of electrical current?": { a: "Volt", b: "Ampere", c: "Ohm", d: "Watt", answer: "b" },
    "Which unit measures voltage?": { a: "Volt", b: "Ampere", c: "Ohm", d: "Joule", answer: "a" },
    "What does a switch do in a simple circuit?": { a: "Stores electric charge", b: "Measures resistance", c: "Opens or closes the circuit", d: "Creates a magnet", answer: "c" },
    "What is essential for electricity to flow?": { a: "A closed circuit", b: "A battery", c: "A light bulb", d: "A multi meter", answer: "a" },
    "Which material is a good insulator of electricity?": { a: "Aluminum", b: "Rubber", c: "Iron", d: "Steel", answer: "b" },
    "Why are connecting wires covered with rubber?": { a: "To make them colorful", b: "To prevent electrical shocks", c: "To make them heavier", d: "To make them more flexible", answer: "b" },
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
    term.id = `term-${index + 1}`;
    term.dataset.match = label.toLowerCase();
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

function selectTerm(term) {
    if (term.classList.contains("is-matched")) return;
    terms.forEach((item) => {
        item.classList.remove("is-selected");
        item.setAttribute("aria-pressed", String(item === term));
    });
    term.classList.add("is-selected");
    selectedTerm = term.dataset.match;
    status.textContent = `Now choose the definition for ${selectedTerm.toUpperCase()}.`;
}

terms.forEach((term) => term.addEventListener("click", () => selectTerm(term)));

answers.forEach((answer) => {
    answer.addEventListener("click", () => {
        if (!selectedTerm) {
            status.textContent = "Select a question first.";
            return;
        }

        const isCorrect = answer.dataset.answer === selectedTerm;
        answer.classList.add(isCorrect ? "is-correct" : "is-wrong");
        if (isCorrect) {
            const matchedTerm = [...terms].find((term) => term.dataset.match === selectedTerm);
            matchedTerm.classList.remove("is-selected");
            matchedTerm.classList.add("is-matched");
            matchedTerm.disabled = true;
            answer.classList.add("is-matched");
            answer.disabled = true;
            selectedTerm = null;
            status.textContent = "Correct match.";
        } else {
            status.textContent = "Not quite. Try another definition.";
        }

        window.clearTimeout(feedbackTimer);
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
    const buttons = trueFalseOptions.querySelectorAll("button");
    buttons.forEach((button) => { button.disabled = true; });
    choiceButton.classList.add(isCorrect ? "is-correct" : "is-wrong");
    status.textContent = isCorrect ? "Correct." : `Not quite. Try this statement again: ${question}`;

    window.clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => {
        choiceButton.classList.remove("is-correct", "is-wrong");
        if (isCorrect) {
            trueFalseIndex += 1;
            showTrueFalseQuestion();
        } else {
            buttons.forEach((button) => { button.disabled = false; });
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
    Object.entries(choices).forEach(([letter, text]) => {
        if (letter === "answer") return;
        const option = document.createElement("button");
        option.className = "multiple-choice-option";
        option.type = "button";
        option.dataset.choice = letter;
        option.innerHTML = `<span class="multiple-choice-letter"></span><span class="multiple-choice-text"></span>`;
        option.querySelector(".multiple-choice-letter").textContent = letter.toUpperCase();
        option.querySelector(".multiple-choice-text").textContent = text;
        mcqOptions.append(option);
    });
    status.textContent = "Choose A, B, C, or D.";
}

mcqOptions.addEventListener("click", (event) => {
    const option = event.target.closest("button[data-choice]");
    if (!option || option.disabled) return;
    const [, choices] = Object.entries(multipleChoiceQuestions)[multipleChoiceIndex];
    const isCorrect = option.dataset.choice === choices.answer.toLowerCase();
    const buttons = mcqOptions.querySelectorAll("button");
    buttons.forEach((button) => { button.disabled = true; });
    option.classList.add(isCorrect ? "is-correct" : "is-wrong");
    status.textContent = isCorrect ? "Correct." : "Not quite. Try another option.";

    window.clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => {
        option.classList.remove("is-correct", "is-wrong");
        if (isCorrect) {
            multipleChoiceIndex += 1;
            showMultipleChoiceQuestion();
        } else {
            buttons.forEach((button) => { button.disabled = false; });
            status.textContent = "Choose A, B, C, or D.";
        }
    }, 2000);
});

backButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});

