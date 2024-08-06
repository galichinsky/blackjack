/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const MSG_LOOKUP = {
  null: 'Beat The Dealer!',
  'T': "Push",
  'P': 'Player Wins!',
  'D': 'Dealer Won',
  'PBJ': 'Player Has Blackjack 🤑',
  'DBJ': 'Dealer Has BlackJack 🏦'
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

// Handle Stand
function handleStand() {
  dealerPlay();
  if (pTotal === dTotal) {
    outcome = 'T';
  } else if (dTotal > pTotal) {
    outcome = 'D';
  } else {
    outcome = 'P';
  }
  settleBet();
  render();
}

function dealerPlay() {
  while (dTotal < 17) {
    pHand.push(deck.pop());
    dTotal = getHandTotal;
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
  //updateTotals();
  render();
}

// Handle the bet
function handleBet(evt) {
  const dealBtn = evt.target;
  if (btn.tagName !== 'BUTTON') return;
  const betAmt = parseInt(btn.innerText.replace('$', ''));
  bet += betAmt;
  bankroll -= betAmt;

  render();
 }
 
function handleDeal() {
  outcome = null;
  dHand = [];
  deck = getNewShuffledDeck();
  pHand = [];
  pHand = [deck.pop(), deck.pop()];
  dHand = [deck.pop(), deck.pop()];
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
function init() {
    outcome = null;
    pHand = [];
    dHand = [];
    pTotal = dTotal = 0;
    bankroll = 1000;
    bet = 0;
    render();
}
  // Handle a stand
function handleStand() {
  if (outcome !== null) return;
  while (getHandValue(dhand) < 17) {
    dhand.push(deck.pop());
  }
  outcome = getFinalOutcome()
  render();
};



// Determine the outcome off of the initial deal
 function getDealOutcome() {
//   const pTotal = getHandValue(pHand);
//   const dTotal = getHandValue(pHand);
//   if (pTotal === 21 && dTotal === 21) return 't';
//   if (dTotal === 21) return 'dbj';
//   if (pTotal === 21) return 'pbj';
   return null;
}

// Get final outcome of the game
// function getFinalOutcome() {
//   const pTotal = getHandValue(phand);
//   const dTotal = getHandValue(dhand);
//   if (pTotal > 21) return 'd';
//   if (dTotal > 21) return 'p';
//   if (pTotal > dTotal) return 'p';
//   if (pTotal < dTotal) return 'd';
//   return 't';
// }

// Update the total scores
// function updateTotals() {
//   dTotalEl.innerText = `Total: ${getHandValue(dHand)}`
//   pTotalEl.innerText = `Total: ${getHandValue(pHand)}`
// }


function render() {
  //renderHandInContainer(dHand, dealerHandContainer);
  //renderHandInContainer(pHand, playerHandContainer);
  renderHands();
  bankrollEl.innerHTML = bankroll;
  betEl.innerHTML = bet;
  renderControls();
  renderBetBtns();
  msgEl.innerHTML = MSG_LOOKUP[outcome];
  //updateTotals();
}

function renderBetBtns() {
  betBtns.forEach(function(btn) {
  const btnAmt = parseInt(btn.innerText.replace('$', ''));
  btn.disabled = btnAmt > bankroll;
});
}

function renderControls() {
  handOverControlsEl.style.visibility = handInPlay() ? 'hidden' : 'visible';
  handActiveControlsEl.style.visibility = handInPlay()? 'visible' : 'hidden'; 
  dealBtn.style.visibility = bet >= 10 && !handInPlay()? 'visible' : 'hidden'; 
}


function renderHands(hand, container) {
  pTotalEl.innerHTML = pTotal;
  dTotalEl.innerHTML = outcome ? dTotal : '??';
  pHandEl.innerHTML = pHand.map(card => `<div class="cards ${card.face}"></div>`).join('');
  dHandEl.innerHTML = dHand.map((card,idx) => `<div class+"card ${idx === 1 && !outcome ? 'back' : card.face}></div>`).join('');
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