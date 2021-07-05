let cards = [];
const pyramidSize = 28;
const deckSize = 52;
let generator = zIndex();

function* zIndex() {
    var index = 0;
    while(true)
        yield index++;
}

const checkOpen = (card) => {

    let cards = [...document.querySelectorAll(".card-wrap")]

    let cardIndex = cards.indexOf(card);

    if (cardIndex > 20) return true;

    let row = Math.floor((-1 + Math.sqrt(1 + 8 * cardIndex)) / 2);

    if (cards[cardIndex + row + 1].classList.contains("hidden") && 
        cards[cardIndex + row + 2].classList.contains("hidden")) {

            return true;
    }
}

const removeCard = (card) => {

    card.style.transition = 'opacity 0.5s linear';

    card.querySelectorAll(".front, .back").forEach(card => {

        card.style.transition = 'opacity 0.5s linear';

    })

    card.style.opacity = 0;

    card.classList.add("hidden");
}

const thirteens = (rank1, rank2) =>{

    switch(rank1) {
        case "J":
            rank1 = 11;
            break;
        case "Q":
            rank1 = 12;
            break;
        case "K":
            rank1 = 13;
            break;
        case "A":
            rank1 = 1;
            break;
        default:
            rank1 = parseInt(rank1);
    }

    switch(rank2) {
        case "J":
            rank2 = 11;
            break;
        case "Q":
            rank2 = 12;
            break;
        case "K":
            rank2 = 13;
            break;
        case "A":
            rank2 = 1;
            break;
        default:
            rank2 = parseInt(rank2);
    }

    if (rank1 + rank2 == 13) return true;

    return false;

}
const checkPairs = (card) => {

    let rank1 = card.querySelector(".rank").innerText;

    if (rank1 == "K") {
        removeCard(card);
        return;
    }

    let cards = [...document.querySelectorAll(".card-wrap")];

    let pyramid = cards.slice(0, 28);

    let topPile;

    console.log(rank1);

    for (let i = 28; i < 52; i++) {

        if (cards[i].classList.contains("flip") && !cards[i].classList.contains("hidden")) {
            topPile = cards[i];
            break;
        }
    }

    for (let i = 0; i < 28; i++) {

        if (!checkOpen(cards[i])) continue;

        let rank2 = cards[i].querySelector(".rank").innerText;

        if (pyramid[i] != card && thirteens(rank1, rank2)) {

            removeCard(card);
            removeCard(cards[i]);

            break;
        }
    }

    if (!topPile || card == topPile) return;

    let rank2 = topPile.querySelector(".rank").innerText;

    if (thirteens(rank1, rank2)) {

        removeCard(card);
        removeCard(topPile);
    }
}

const drawCard = (card) => {

    let pileCell = document.querySelector(".pile");

    let offsetLeft = pileCell.offsetLeft - card.offsetLeft;

    let offsetTop = pileCell.offsetTop - card.offsetTop;

    card.style.zIndex = generator.next().value;

    card.querySelector(".card").classList.add("zoom");

    card.classList.toggle("flip");

    card.style.transition = `all 0.4s 0.05s linear`;

    card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
}

const fillPyramid = (topCell, cards, delay, interval) => {

    for (let i = 0; i < pyramidSize; i++) {

        delay += interval;

        let card = cards[i];

        card.style.left = topCell.offsetLeft + "px";

        card.style.top = topCell.offsetTop +  550 + "px";


        let cell = document.querySelectorAll(".cell")[i];

        let offsetLeft = cell.offsetLeft - card.offsetLeft;

        let offsetTop = cell.offsetTop - card.offsetTop;

        // let distance = Math.sqrt(Math.pow(offsetLeft, 2) + Math.pow(offsetTop, 2));

        // let duration = distance / 550 / 2;

        duration = 0.5;

        card.style.opacity = 1;

        card.querySelectorAll(".front, .back").forEach(card => {

            card.style.transition = `all ${duration - 0.2}s ${delay + 0.2}s linear`;

        })

        card.style.transition = `all ${duration}s ${delay}s linear`;

        card.classList.toggle("flip");

        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    }
}

const fillStock = (topCell, cards, delay, interval) => {

    let stockCell = document.querySelector(".stock");

    for (let i = pyramidSize; i < deckSize; i++) {

        delay += 0.05;

        let card = cards[i];

        card.style.left = topCell.offsetLeft + "px";

        card.style.top = topCell.offsetTop +  550 + "px";

        let offsetLeft = stockCell.offsetLeft - card.offsetLeft;

        let offsetTop = stockCell.offsetTop - card.offsetTop;

        // let distance = Math.sqrt(Math.pow(offsetLeft, 2) + Math.pow(offsetTop, 2));

        // let duration = distance / 550 / 1.1;

        duration = 0.5;

        card.style.opacity = 1;

        card.style.transition = `all ${duration}s ${delay}s linear`;

        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    }

}

const setBoard = () => {

    let topCell = document.querySelector(".cell");

    let cards =  document.querySelectorAll(".card-wrap");

    let delay = 0;

    let interval = 0.05;

    fillPyramid(topCell, cards, delay, interval);

    delay += pyramidSize * interval; 

    fillStock(topCell, cards, delay, interval);

}

const turn = (e) => {

    let card = e.currentTarget;

    if (!card.classList.contains("flip")){
        drawCard(card);
        return;
    }

    if (checkOpen(card)) checkPairs(card);
}

const touchScreen = () => {
    return matchMedia('(hover: none)').matches;
}

const enableTouch = () => {
    for (let card of document.querySelectorAll('.card-wrap')){
        if (touchScreen()){
            card.addEventListener("touchstart", turn);
        } else {
            card.addEventListener("mousedown", turn);
        }
    }
}

const disableTouch = () => {
    for (let card of document.querySelectorAll('.card-wrap')){
        if (touchScreen()){
            card.removeEventListener("touchstart", turn);
        } else {
            card.removeEventListener("mousedown", turn);
        }
    }
}

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]] 
    }
}

const winDeck = () => {

    let deck = [];

    let ranks = [6,  1,  2, 12, 13,  2, 4,  5, 13, 9,  7,
        8, 10,  2,  9,  6, 10, 8, 10, 11, 2,  9,
        6,  5, 10, 12, 13, 12, 1, 12,  7, 7, 11,
       11,  3,  4,  5, 11,  8, 4,  6,  5, 3,  3,
        1,  7,  8, 13,  9,  3, 4,  1];

    const suits = ['♥','♠','♦','♣'];

    ranks.forEach(rank => {

        switch(rank) {
            case 11:
                rank = "J";
                break;
            case 12:
                rank = "Q";
                break;
            case 13:
                rank = "K";
                break;
            case 1:
                rank = "A";
                break;
            default:
                rank = String(rank);
        }

        shuffle(suits);

        for (suit of suits) {

            card = rank + suit;

            if (!deck.includes(card)) {
                deck.push(card);
                break;
            }
        }
    })

    return deck;
}

const setDeck = () => {

    cards = [];
    
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    const suits = ['♥','♠','♦','♣'];


    suits.forEach(suit => {

        ranks.forEach(rank => {

            card = rank + suit;

            cards.push(card);
        })
    })

    shuffle(cards);

    cards = winDeck();

    console.log(cards);


           
}

const offSet = () => {

    let topCell = document.querySelector(".cell");

}

const setCards = () => {

    for (let i = 0; i < 52; i++){

        let card = document.querySelectorAll(".front")[i];

        let rank = cards[i].length == 2 ? cards[i][0] : cards[i][0] + cards[i][1];
        let suit = cards[i].length == 2 ? cards[i][1] : cards[i][2];

        if (suit == "♥" || suit == "♦") { 
            card.style.color = "red";
        }

        card.querySelector(".rank").innerText = rank;
        card.querySelector(".suit").innerText = suit;
        card.querySelector(".main").innerText = suit;  

    }
}

const init = () => {

    setDeck();

    offSet();

    setCards();

    setBoard();

    enableTouch();
}

window.onload = () => {
    document.fonts.ready.then(() => {
        setTimeout(() => {
            init();     
        }, 50);
    });
}


