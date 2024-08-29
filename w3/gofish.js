const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let player1Hand = [];
let player2Hand = [];
let playerTurn = 1;

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push(`${rank} of ${suit}`);
        }
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCards() {
    player1Hand = [];
    player2Hand = [];
    for (let i = 0; i < 7; i++) {
        player1Hand.push(deck.pop());
        player2Hand.push(deck.pop());
    }
    renderHands();
}

function renderHands() {
    document.getElementById('player1-hand').innerHTML = player1Hand.map((card, index) => {
        return `<div class="card" onclick="askForCard(${index})">${card}</div>`;
    }).join('');
    document.getElementById('player2-hand').innerHTML = player2Hand.map(() => {
        return `<div class="card">Card</div>`;
    }).join('');
}

function askForCard(index) {
    const card = player1Hand[index];
    const rank = card.split(' ')[0];
    const matches = player2Hand.filter(c => c.startsWith(rank));
    
    if (matches.length > 0) {
        player1Hand.push(...matches);
        player2Hand = player2Hand.filter(c => !matches.includes(c));
        updateGameInfo(`Player 2 gave ${matches.length} ${rank}(s) to Player 1`);
    } else {
        updateGameInfo(`Player 2 says 'Go Fish!'`);
        document.getElementById('go-fish-btn').disabled = false;
    }
    
    checkForPairs(player1Hand);
    renderHands();
}

function goFish() {
    if (deck.length > 0) {
        player1Hand.push(deck.pop());
        renderHands();
        document.getElementById('go-fish-btn').disabled = true;
        updateGameInfo('You drew a card from the deck.');
    }
}

function nextTurn() {
    playerTurn = playerTurn === 1 ? 2 : 1;
    document.getElementById('next-turn-btn').disabled = playerTurn === 1;
    updateGameInfo(`Player ${playerTurn}'s turn`);
    if (playerTurn === 2) {
        computerTurn();
    }
}

function computerTurn() {
    const randomCard = player2Hand[Math.floor(Math.random() * player2Hand.length)];
    const rank = randomCard.split(' ')[0];
    const matches = player1Hand.filter(c => c.startsWith(rank));
    
    if (matches.length > 0) {
        player2Hand.push(...matches);
        player1Hand = player1Hand.filter(c => !matches.includes(c));
        updateGameInfo(`Player 2 asked for ${rank} and got ${matches.length} card(s).`);
    } else {
        updateGameInfo(`Player 2 says 'Go Fish!'`);
        if (deck.length > 0) {
            player2Hand.push(deck.pop());
        }
    }
    
    checkForPairs(player2Hand);
    renderHands();
    nextTurn();
}

function checkForPairs(hand) {
    const ranksInHand = {};
    hand.forEach(card => {
        const rank = card.split(' ')[0];
        ranksInHand[rank] = ranksInHand[rank] ? ranksInHand[rank] + 1 : 1;
    });
    
    for (let rank in ranksInHand) {
        if (ranksInHand[rank] === 4) {
            hand = hand.filter(card => !card.startsWith(rank));
            updateGameInfo(`A set of 4 ${rank}s was completed!`);
        }
    }
}

function updateGameInfo(message) {
    document.getElementById('game-info').innerText = message;
}

function startGame() {
    createDeck();
    dealCards();
    updateGameInfo('Player 1 starts the game');
    renderHands();
    document.getElementById('next-turn-btn').disabled = true;
}

startGame();
