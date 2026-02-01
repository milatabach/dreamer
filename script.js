const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const resetButton = document.getElementById("reset");
const dreamOutput = document.getElementById("dreamOutput");
const dreamPrompt = document.getElementById("dreamPrompt");
const dreamImage = document.getElementById("dreamImage");
const dreamImageLeft = document.getElementById("dreamImageLeft");

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
  dreamPrompt.textContent = "Share a dream to invite an image.";
  dreamImage.src = "";
  dreamImage.classList.remove("is-visible");
  dreamImageLeft.src = "";
  dreamImageLeft.classList.remove("is-visible");
  dreamOutput.classList.remove("is-visible");
};

const buildDreamPrompt = () => {
  const parts = [
    answers.dream,
    `Setting: ${answers.setting}`,
    `Emotion: ${answers.emotion}`,
    `Symbol: ${answers.symbol}`,
  ].filter(Boolean);

  return `Whimsical dreamscape, soft glow, ethereal atmosphere, cinematic detail. ${
    parts.join(" ")
  }`;
};

const generateDreamImage = (prompt) => {
  const encodedPrompt = encodeURIComponent(prompt.slice(0, 900));
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
  dreamImage.src = imageUrl;
  dreamImageLeft.src = imageUrl;
  dreamImage.onload = () => {
    dreamImage.classList.add("is-visible");
  };
  dreamImageLeft.onload = () => {
    dreamImageLeft.classList.add("is-visible");
  };
};

const advanceConversation = () => {
  if (questionIndex >= questions.length) {
    const prompt = buildDreamPrompt();
    dreamPrompt.textContent = prompt;
    dreamOutput.classList.add("is-visible");
    addMessage(
      "Thank you for sharing. I’m weaving your dream now — take a slow breath while the image appears.",
      "bot"
    );
    generateDreamImage(prompt);
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