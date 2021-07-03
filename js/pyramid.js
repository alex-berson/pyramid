let cards = [];
const pyramidSize = 28;
const deckSize = 52;
let generator = zIndex();

function* zIndex() {
    var index = 0;
    while(true)
        yield index++;
}

const flipCard = (card) => {

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

    let card = e.currentTarget

    if (!card.classList.contains("flip")){

        flipCard(card);

        console.log(card);
    }
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

    console.log(cards);

           
}

const offSet = () => {

    let topCell = document.querySelector(".cell");


    console.log(topCell.offsetLeft);
    console.log(topCell.offsetTop);

}

const setCards = () => {

    for (let i = 0; i < 52; i++){

        // let card = document.querySelectorAll(".card")[i];

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


