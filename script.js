const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const resetButton = document.getElementById("reset");
const dreamOutput = document.getElementById("dreamOutput");
const dreamPrompt = document.getElementById("dreamPrompt");
const dreamFrame = document.querySelector(".dream-frame");

const questions = [
  {
    key: "dream",
    bot: "Tell me about a recent dream. What shimmered or lingered as you woke?",
  },
  {
    key: "setting",
    bot: "Where did the dream carry you? Describe the setting and its glow.",
  },
  {
    key: "emotion",
    bot: "What feeling hummed the loudest in the dream?",
  },
  {
    key: "symbol",
    bot: "Was there a symbol, person, or object that felt enchanted?",
  },
];

let questionIndex = 0;
const answers = {};

const addMessage = (text, type) => {
  const message = document.createElement("div");
  message.className = `message message--${type}`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

const resetDreamOutput = () => {
  dreamPrompt.textContent = "Share a dream to receive a reflection.";
  dreamOutput.classList.remove("is-visible");
  if (dreamFrame) {
    dreamFrame.classList.remove("is-reflecting");
    dreamFrame.dataset.reflection = "";
  }
};

const buildDreamReflection = () => {
  const reflectionLines = [
    `Your dream lingers with a ${answers.emotion || "gentle"} pulse,` +
      ` carrying the feeling of ${answers.setting || "a luminous place"}.`,
    `The presence of ${answers.symbol || "something quietly symbolic"}` +
      " suggests a hidden message surfacing through the haze.",
    `As you recall ${answers.dream || "the dream"}, it seems to invite you` +
      " to notice what wants to be nurtured next.",
  ];

  const followUps = [
    "What part of the dream felt the most alive or vivid?",
    "If the dream could offer a gentle invitation, what might it be?",
    "Is there a color, sound, or texture that keeps returning to you?",
  ];

  return {
    summary: reflectionLines.join(" "),
    questions: followUps,
  };
};

const advanceConversation = () => {
  if (questionIndex >= questions.length) {
    const reflection = buildDreamReflection();
    dreamPrompt.textContent = reflection.summary;
    dreamOutput.classList.add("is-visible");
    if (dreamFrame) {
      dreamFrame.classList.add("is-reflecting");
      dreamFrame.dataset.reflection = reflection.summary;
    }
    addMessage(
      "Thank you for sharing. I’ve gathered your dream into a reflection.",
      "bot"
    );
    addMessage(reflection.summary, "bot");
    reflection.questions.forEach((question) => {
      addMessage(question, "bot");
    });
    addMessage(
      "When you’re ready, you can press “Start over” to dream again.",
      "bot"
    );
    return;
  }

  const current = questions[questionIndex];
  setTimeout(() => {
    addMessage(current.bot, "bot");
  }, 500);
};

const startConversation = () => {
  chatWindow.innerHTML = "";
  questionIndex = 0;
  Object.keys(answers).forEach((key) => delete answers[key]);
  resetDreamOutput();
  addMessage("Dreamer is here with you. Let’s begin.", "bot");
  setTimeout(() => {
    addMessage(questions[0].bot, "bot");
  }, 400);
};

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  userInput.value = "";

  if (questionIndex < questions.length) {
    const current = questions[questionIndex];
    answers[current.key] = text;
    questionIndex += 1;
  }

  advanceConversation();
});

resetButton.addEventListener("click", () => {
  startConversation();
});

startConversation();