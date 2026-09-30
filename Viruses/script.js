// Questions and Answers
const matches = {
    "What does it do?": "Infects files and programs by inserting its own code.",
    "Common problems": "Files disappearing or becoming corrupted.",
    "How is it installed?": "Often installed via email attachments, infected downloads, or removable media like USB drives.",
    "A USB drive": "Can carry viruses.",
    "A computer without internet access": "Can still be infected by viruses.",
};

const trueFalseQuestions = {
    "Viruses can be installed from browsers": "True",
    "A virus can infect files or programs": "True",
    "Deleting a browser always removes every virus": "False",
    "Computer virus can spread from one computer to another": "True",
    "Downloading files from untrusted websites is always safe": "False",
    "A virus can improve system performance": "False",
    "A virus is a type of a computer program": "True",
};

// Each question has four choices and the key of the correct choice.
const multipleChoiceQuestions = {
    "What is one way a virus can reach a computer?": { a: "Infected download", b: "Turning on the monitor", c: "Using a mouse", d: "Changing screen brightness", answer: "a" },
    "What can a computer virus do?": { a: "Repair every damaged file", b: "Infect files or programs", c: "Create electricity", d: "Clean the keyboard", answer: "b" },
    "Which action helps reduce the risk of malware?": { a: "Open every attachment", b: "Disable all updates", c: "Download from trusted sources", d: "Share unknown USB drives", answer: "c" },
    "Which of the following is a sign of a virus infection?": { a: "Files disappearing or becoming corrupted", b: "The computer is running faster than usual", c: "The monitor is turned off", d: "The keyboard is clean", answer: "a" },
    "Which of these could contain a virus?": { a: "A trusted email", b: "A clean desktop", c: "NotePad", d: "USB drive", answer: "d" },
    "Why is antivirus software important?": { a: "It prevents viruses from entering the computer", b: "Strengthens the virus", c: "It improves system performance", d: "It creates backups of important files", answer: "a" },
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
    selectedTerm = term.dataset.match;
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
            const matchedTerm = [...terms].find((term) => term.dataset.match === selectedTerm);
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
            status.textContent = "Not quite. Try the other definition, or choose a different  answer.";
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