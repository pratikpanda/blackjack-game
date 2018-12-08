//
// Blackjack
// by Pratik Panda
//

// Card variables
let suits = ["Hearts", "Clubs", "Diamonds", "Spades"],
  values = ["Ace", "King", "Queen", "Jack",
    "Ten", "Nine", "Eight", "Seven", "Six",
    "Five", "Four", "Three", "Two"
  ];

// DOM variables
let textArea = document.getElementById("text-area"),
  newGameButton = document.getElementById("new-game-button"),
  hitButton = document.getElementById("hit-button"),
  stayButton = document.getElementById("stay-button");

// Game variables
let gameStarted = false,
  gameOver = false,
  playerWon = false,
  gameTied = false,
  dealerCards = [],
  playerCards = [],
  dealerScore = 0,
  playerScore = 0,
  deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function() {
  gameStarted = true;
  gameOver = false;
  playerWon = false;
  gameTied = false;

  console.log("Inside New Game Event Handler");

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];

  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  showStatus();
});

hitButton.addEventListener('click', function() {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

stayButton.addEventListener('click', function() {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

function createDeck() {
  let deck = [];
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx]
      };
      deck.push(card);
    }
  }

  console.log("Inside Create Deck");

  return deck;
}

function shuffleDeck(deck) {
  for (let deckIdx = 0; deckIdx < deck.length; deckIdx++) {
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[deckIdx];
    deck[deckIdx] = tmp;
  }

  console.log("Inside Shuffle Deck");
}

function getCardString(card) {
  console.log("Inside Get Card String");
  return card.value + " of " + card.suit;
}

function getCardNumericValue(card) {
  let cardValue = 0;

  switch (card.value) {
    case "Ace":
      cardValue = 1;
      break;
    case "Two":
      cardValue = 2;
      break;
    case "Three":
      cardValue = 3;
      break;
    case "Four":
      cardValue = 4;
      break;
    case "Five":
      cardValue = 5;
      break;
    case "Six":
      cardValue = 6;
      break;
    case "Seven":
      cardValue = 7;
      break;
    case "Eight":
      cardValue = 8;
      break;
    case "Nine":
      cardValue = 9;
      break;
    default:
      cardValue = 10;
      break;
  }

  return cardValue;
}

function getScore(cards) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    score += getCardNumericValue(card);
    if (card.value == "Ace") {
      hasAce = true;
    }
  }

  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }

  return score;
}

function checkForEndOfGame() {
  updateScores();
  
  if (dealerCards.length === 5) {
    textArea.innerText += "Dealer has reached 5 cards" + "\n";
    playerWon = false;
    gameOver = true;
  }

  if (gameOver && dealerCards.length < 5) {
    // Let the dealer take cards
    while (dealerScore < playerScore &&
      playerScore <= 21 &&
      dealerScore <= 21) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if (playerScore > 21) {
    playerWon = false;
    gameOver = true;
  } else if (dealerScore > 21) {
    playerWon = true;
    gameOver = true;
  } else if (playerScore === 21 && playerScore !== dealerScore) {
    playerWon = true;
    gameOver = true;
  } else if (dealerScore === 21 && playerScore !== dealerScore) {
    playerWon = false;
    gameOver = true;
  } else if (gameOver) {
    if (playerScore > dealerScore) {
      playerWon = true;
    } else if (playerScore === dealerScore) {
      gameTied = true;
    } else {
      playerWon = false;
    }
  }
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function showStatus() {
  console.log("Inside Show Status");
  if (!gameStarted) {
    textArea.innerText = "Welcome to Blackjack!";
    return;
  }

  let dealerCardString = '';
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += getCardString(dealerCards[i]) + "\n";
  }

  let playerCardString = '';
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += getCardString(playerCards[i]) + "\n";
  }

  updateScores();

  textArea.innerText =
    "Dealer has:\n" +
    dealerCardString +
    "(score: " + dealerScore + ")\n\n" +

    "Player has:\n" +
    playerCardString +
    "(score: " + playerScore + ")\n\n";

  checkForEndOfGame();

  if (gameOver) {
    if (playerWon) {
      textArea.innerText += "YOU WIN!";
    } else if (gameTied) {
      textArea.innerText += "GAME TIED!";
    } else {
      textArea.innerText += "DEALER WINS!";
    }

    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }
}

function getNextCard() {
  console.log("Inside Get Next Card");
  return deck.shift();
}