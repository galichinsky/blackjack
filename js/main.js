/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const MSG_LOOKUP = {
  null: 'Blackjack!',
  'T': 'Push 🤝',
  'P': 'Player Wins!',
  'D': 'Dealer Wins 🤕',
  'PBJ': 'Player Has Blackjack 🤑',
  'DBJ': 'House Has Blackjack 🏦'
};

// Build an 'original' deck of 'card' objects used to create shuffled decks
const mainDeck = buildMainDeck();

/*----- app's state (variables) -----*/
let deck;
let dHand;
let pHand;
let bankroll;
let bet;
let pTotal, dTotal;
let btn;
let outcome;  // null -> hand in progress; 'P' -> player wins; 'D' -> dealer wins
              // 'DBJ' -> dealer blackjack; 'PBJ' -> player blackjack
              // 'T' -> push for a tie

/*----- cached element references -----*/
const msgEl = document.getElementById('msg');
const dHandEl = document.getElementById('dealer-hand');
const dTotalEl = document.getElementById('dealer-total');
const pHandEl = document.getElementById('player-hand');
const pTotalEl = document.getElementById('player-total');
const betEl = document.getElementById('bet');
const bankrollEl = document.getElementById('bankroll');
const handActiveControlsEl = document.getElementById('hand-active-controls');
const handOverControlsEl = document.getElementById('hand-over-controls');
const dealBtn = document.getElementById('deal-btn');
const betBtns = document.querySelectorAll('#bet-controls > button')
//const standBtn = document.getElementById('stand-btn');

/*----- event listeners -----*/

dealBtn.addEventListener('click', handleDeal);
document.getElementById('hit-btn').addEventListener('click', handleHit);
document.getElementById('stand-btn').addEventListener('click', handleStand);
document.getElementById('bet-controls').addEventListener('click', handleBet);

//standBtn.addEventListener('click', handleStand);
/*----- functions -----*/
init();

// initialize the game state
function init() {
    outcome = null;
    pHand = [];
    dHand = [];
    pTotal = dTotal = 0;
    bankroll = 200;
    bet = 0;
    render();
}

// Handle the initial deal
function handleDeal() {
  outcome = null;
  deck = getNewShuffledDeck();
  dHand = [];
  pHand = [];
  dHand.push(deck.pop(), deck.pop()); // Deal two cards to dealer
  pHand.push(deck.pop(), deck.pop()); // Deal two cards to player
  dTotal = getHandTotal(dHand);
  pTotal = getHandTotal(pHand);
  // check for BJ
  if (pTotal === 21 && dTotal === 21) {
    outcome = 'T';
  } else if (dTotal === 21) {
      outcome = 'DBJ';
  } else if (pTotal === 21) {
      outcome = 'PBJ';
  }
  if (outcome) settleBet();
  render();
}
// Handle Stand
function handleStand() {
  dealerPlay();
    if (pTotal > 21) {
      outcome = (dTotal > 21) ? 'T' : 'D';
    } else if (dTotal > 21) {
      outcome = 'P';
    } else if (pTotal === 21) {
      outcome = (dTotal === 21) ? 'T' : 'PBJ';
    } else if (dTotal === 21) {
      outcome = 'DBJ';
    } else if (pTotal === dTotal) {
      outcome = 'T';
    } else if (pTotal > dTotal) {
      outcome = 'P';
    } else {
      outcome = 'D';
    }
    settleBet();
    render();
}

function dealerPlay(cb) {
  while (dTotal < 17) {
    dHand.push(deck.pop());
    dTotal = getHandTotal(dHand);
  }
}

// Handle a hit
function handleHit() {
  pHand.push(deck.pop());
  pTotal = getHandTotal(pHand);
  if (pTotal > 21) {
    outcome = 'D';
    settleBet();
  }
render();
}

// Handle the bet
function handleBet(evt) {
  const btn = evt.target;
  if (btn.tagName !== 'BUTTON') return;
  const betAmt = parseInt(btn.innerText.replace('$', ''));
  bet += betAmt;
  bankroll -= betAmt;
  render();
 }

function settleBet() {
  if (outcome === 'PBJ') {
    bankroll += bet + (bet * 1.5);
  } else if (outcome === 'P') {
    bankroll += bet * 2;
  }
  bet = 0;
}

// Get the hand totals
function getHandTotal(hand) {
  let total = 0;
  let aces = 0;
  hand.forEach(function(card) {
    total += card.value;
    if (card.value === 11) aces++;
  });
  while (total > 21 && aces) {
    total -= 10;
    aces--;
  }
  return total;
}


function render() {
  renderHands();
  bankrollEl.innerHTML = bankroll;
  betEl.innerHTML = bet;
  renderControls();
  renderBetBtns();
  msgEl.innerHTML = MSG_LOOKUP[outcome];
}

function renderBetBtns() {
  betBtns.forEach(function(btn) {
    const btnAmt = parseInt(btn.innerText.replace('$', ''));
    btn.disabled = btnAmt > bankroll;
});
}

function renderControls() {
  handOverControlsEl.style.visibility = handInPlay() ? 'hidden' : 'visible';
  handActiveControlsEl.style.visibility = handInPlay() ? 'visible' : 'hidden'; 
  dealBtn.style.visibility = bet >= 1 && !handInPlay() ? 'visible' : 'hidden'; 
}


function renderHands() {
  pTotalEl.innerHTML = pTotal;
  dTotalEl.innerHTML = outcome ? dTotal : '??';
  pHandEl.innerHTML = pHand.map(card => `<div class="card ${card.face}"></div>`).join('');
  dHandEl.innerHTML = dHand.map((card,idx) => `<div class="card ${idx === 1 && !outcome ? 'back' : card.face}"></div>`).join('');
}

function handInPlay() {
  return pHand.length && !outcome;
}

function getNewShuffledDeck() {
  const tempDeck = [...mainDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length)
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}

function buildMainDeck() {
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      console.log(`${suit}${rank}`)
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