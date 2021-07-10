let cards = [];
const pyramidSize = 28;
const deckSize = 52;
let generator = zIndex();

function* zIndex() {
    var index = 1;
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

    // card.style.transition = 'all 0s linear';

    card.classList.add("hidden");


    card.style.transition = 'all 0.5s linear';


    // card.querySelectorAll(".front, .back").forEach(card => {

    //     card.style.transition = 'opacity 0.5s linear';

    // })

    card.style.opacity = 0;

    card.style.transform += "scale(3.0)";

    card.style.pointerEvents = "none";
}

const rankNum = (rank) => {

    switch(rank) {
        case "A":
            rank = 1;
            break;
        case "J":
            rank = 11;
            break;
        case "Q":
            rank = 12;
            break;
        case "K":
            rank = 13;
            break;
        default:
            rank = parseInt(rank);
    }

    return rank;
}

const thirteens = (rank1, rank2) =>{

    if (rankNum(rank1) + rankNum(rank2) == 13) return true;

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

    // console.log(rank1);

    for (let i = 28; i < 52; i++) {

        if (cards[i].classList.contains("flip") && !cards[i].classList.contains("hidden")) {
            topPile = cards[i];
            break;
        }
    }

    for (let i = 0; i < 28; i++) {

        if (!checkOpen(cards[i]) || cards[i].classList.contains("hidden")) continue;

        let rank2 = cards[i].querySelector(".rank").innerText;

        if (pyramid[i] != card && thirteens(rank1, rank2)) {

            removeCard(card);
            removeCard(cards[i]);

            return;
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

    disableCard(card);

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

    for (let i = pyramidSize; i < deckSize - 1; i++) {

        delay += interval;

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

const fillPile = (topCell, cards, delay, interval) => {

    let pileCell = document.querySelector(".pile");

    let card = cards[deckSize - 1];

    card.style.left = topCell.offsetLeft + "px";

    card.style.top = topCell.offsetTop +  550 + "px";

    let offsetLeft = pileCell.offsetLeft - card.offsetLeft;

    let offsetTop = pileCell.offsetTop - card.offsetTop;

    duration = 0.5;

    // delay += interval;

    card.style.opacity = 1;

    card.querySelectorAll(".front, .back").forEach(card => {

        card.style.transition = `all ${duration - 0.2}s ${delay + 0.2}s linear`;

    })

    card.style.transition = `all ${duration}s ${delay}s linear`;

    card.classList.toggle("flip");

    card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;

}

const setBoard = () => {

    setCards();

    let topCell = document.querySelector(".cell");

    let cards =  document.querySelectorAll(".card-wrap");

    let delay = 0;

    let interval = 0.05;

    fillPyramid(topCell, cards, delay, interval);

    delay = pyramidSize * interval; 

    fillStock(topCell, cards, delay, interval);

    delay = (deckSize) * interval;

    fillPile(topCell, cards, delay, interval);
}

const zoom = (card) => {

    // card.querySelector(".card").classList.add("zoom");

    card.style.transition = 'transform 0.25s linear';

    card.style.transform += "scale(1.1)";
}

const removeZoom = (e) => {

    let card = e.currentTarget;

    // card.querySelector(".card").classList.remove("zoom");

    card.style.transform = card.style.transform.replace("scale(1.1)", "");
}

const turn = (e) => {

    let card = e.currentTarget;

    if (!card.classList.contains("flip")){
        drawCard(card);
        return;
    }

    if (checkOpen(card)) {
        zoom(card);
        checkPairs(card);
    }
}

const touchScreen = () => {
    return matchMedia('(hover: none)').matches;
}

const enableCard = (card) => {

    if (card.currentTarget) {
        card = card.currentTarget;
    }

    if (touchScreen()){
        card.addEventListener("touchstart", turn);
        card.addEventListener("touchend", removeZoom);

    } else {
        card.addEventListener("mousedown", turn);
        card.addEventListener("mouseup", removeZoom);
    }

    card.addEventListener('transitionend', enableCard); 
}

const enableTouch = () => {
    for (let card of document.querySelectorAll('.card-wrap')){
        enableCard(card);
    }
}

const disableCard = (card) => {
    if (touchScreen()){
        card.removeEventListener("touchstart", turn);
        card.removeEventListener("touchend", removeZoom);

    } else {
        card.removeEventListener("mousedown", turn);
        card.removeEventListener("mouseup", removeZoom);
    }
} 

const disableTouch = () => {
    for (let card of document.querySelectorAll('.card-wrap')){
        disableCard(card);
    }
}

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]] 
    }
}

const getDeck = () => {

    cards = [];

    let ranks = [4,  9, 2,  3,  5, 10,  8,  1,  6,  2,  9,
        7,  9, 1, 12,  5, 13, 11,  1, 12, 13,  7,
        5,  7, 6, 11,  3,  3, 10,  4, 12,  8, 11,
        9,  3, 4,  7, 10,  6,  2,  2, 13, 13,  4,
       12, 10, 1,  8,  6,  5,  8, 11];


    // let ranks = winDeck();

    let suits = ['♥','♠','♦','♣'];

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

            let card = rank + suit;

            if (!cards.includes(card)) {
                cards.push(card);
                break;
            }
        }
    })

    // return deck;
}

// const getDeck = () => {

//     cards = [];
    
//     const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
//     const suits = ['♥','♠','♦','♣'];


//     suits.forEach(suit => {

//         ranks.forEach(rank => {

//             let card = rank + suit;

//             cards.push(card);
//         })
//     })

//     shuffle(cards);

//     cards = winDeck();

//     console.log(cards);
// }

// const offSet = () => {

//     let topCell = document.querySelector(".cell");

// }

const setCards = () => {

    getDeck();

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


