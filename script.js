const GAME_NODE = document.querySelector("#game-board");
const VICTORY_TEXT = document.querySelector("#victory-message");
const START_GAME_BUTTON = document.querySelector("#new-game-button");

const VISIBLE_CARD_CLASS_NAME = "visible";

const CARD_FLIP_TIMEOUT_MS = 500;

const CARD_ELEMENTS = ["🍓", "🍇", "🍊", "🍉", "🍒", "🍋"];

const CARD_AMOUNT = 12;

let VISIBLE_CARDS = [];

START_GAME_BUTTON.addEventListener("click", startGame);



function startGame() {
  [GAME_NODE, VICTORY_TEXT].forEach((node) => (node.innerHTML = ""));

  const CARD_VALUES = generateArray(CARD_ELEMENTS, CARD_AMOUNT);

  CARD_VALUES.forEach(renderCard);

  const renderCards = document.querySelectorAll(".card");

  renderCards.forEach(card => card.classList.add(VISIBLE_CARD_CLASS_NAME));

  setTimeout(() => {
    renderCards.forEach(card => card.classList.remove(VISIBLE_CARD_CLASS_NAME));
  }, 1000)
}

function generateArray(emojis, CARD_AMOUNT) {
  const randomArray = [];
  const elementCounts = {};

  for (const emoji of emojis) {
    elementCounts[emoji] = 0;
  }

  while (randomArray.length < CARD_AMOUNT) {
    const randomIndex = Math.floor(Math.random() * emojis.length);
    const randomElement = emojis[randomIndex];

    if (elementCounts[randomElement] < 2) {
      randomArray.push(randomElement);
      elementCounts[randomElement]++;
    }
  }

  return randomArray;
}

function renderCard(emoji) {
  const card = document.createElement("div");
  card.classList.add("card");

  const cardInner = document.createElement("div");
  cardInner.classList.add("card-inner");

  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");

  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");

  cardFront.textContent = "💀";
  cardBack.textContent = emoji;

  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);

  card.appendChild(cardInner);

  card.addEventListener("click", () => {
    handleCardClick(card);
  });

  GAME_NODE.appendChild(card);
}

function handleCardClick(card) {
  if (card.classList.contains(VISIBLE_CARD_CLASS_NAME)) {
    return;
  }

  const checkVictory = () => {
    const visibleCardNodes = document.querySelectorAll(".visible");

    const isVictory = visibleCardNodes.length === CARD_AMOUNT;
    const victoryMessage = "Congratulations, you win!";

    if (isVictory) {
      VICTORY_TEXT.textContent = victoryMessage;
    }
  };

  card
    .querySelector(".card-inner")
    .addEventListener("transitionend", checkVictory);

  card.classList.add(VISIBLE_CARD_CLASS_NAME);

  VISIBLE_CARDS.push(card);

  if (VISIBLE_CARDS.length % 2 !== 0) {
    return;
  }

  const [preLastCard, lastCard] = VISIBLE_CARDS.slice(-2);

  if (lastCard.textContent !== preLastCard.textContent) {
    VISIBLE_CARDS = VISIBLE_CARDS.slice(0, VISIBLE_CARDS.length - 2);

    setTimeout(() => {
      lastCard.classList.remove("visible");
      preLastCard.classList.remove("visible");
    }, CARD_FLIP_TIMEOUT_MS);
  }
}

startGame();
