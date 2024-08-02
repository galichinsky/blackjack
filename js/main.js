/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// Build an 'original' deck of 'card' objects used to create shuffled decks
const originalDeck = buildOriginalDeck();

/*----- app's state (variables) -----*/
let deck;
let dHand;
let pHand;
let bankroll;
let bet;
let outcome;  // null -> hand in progress; 'p' -> player wins; 'd' -> dealer wins
              // 'dbj' -> dealer blackjack; 'pbj' -> player blackjack
              // 't' -> push for a tie

/*----- cached element references -----*/

const playerHandContainer = document.getElementById('player-hand-container');
const dealerHandContainer = document.getElementById('dealer-hand-container');
const dealBtn = document.getElementById('deal-btn');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const dTotalEl = document.getElementById('dealer-total');
const pTotalEl = document.getElementById('player-total');

/*----- event listeners -----*/

dealBtn.addEventListener('click', handleDeal);
hitBtn.addEventListener('click', handleHit);
standBtn.addEventListener('click', handleStand);
/*----- functions -----*/
init();

function init() {
  bankroll = 0;
  bet = 0;
  outcome = null;
  pHand = [];
  dHand = [];

  render();
}


function handleDeal() {
  console.log(dealBtn)
  deck = getNewShuffledDeck();
  pHand = [deck.pop(), deck.pop()];
  dHand = [deck.pop(), deck.pop()];
  outcome = getDealOutcome();
  render();
}

// Handle a hit
function handleHit(phand, container) {
  if (outcome !== null) return;
  console.log(hitBtn)
  phand.push(deck.pop());
  updateTotals();
  
  render();
}

handleStand(phand, container) {
  if (outcome !== null) return;
  while (getHand)
  console.log(handleStand)
};

function getDealOutcome() {
  return null;
}

function render() {
  renderHandInContainer(dHand, dealerHandContainer);
  renderHandInContainer(pHand, playerHandContainer);

}


function renderHandInContainer(hand, container) {
  const isDealerHand = hand === dHand;
  console.log(isDealerHand)
  container.innerHTML = '';
  let cardsHtml = '';
  hand.forEach(function(card, idx) {
    cardsHtml += `<div class="card large ${isDealerHand && idx === 0 && outcome === null ? 'back' : card.face}"></div>`;
  });
  container.innerHTML = cardsHtml;
}

function getNewShuffledDeck() {
  // Create a copy of the originalDeck (leave originalDeck untouched!)
  const tempDeck = [...originalDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    // Get a random index for a card still in the tempDeck
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}


function buildOriginalDeck() {
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      deck.push({
        // The 'face' property maps to the library's CSS classes for cards
        face: `${suit}${rank}`,
        // Setting the 'value' property for game of blackjack, not war
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}