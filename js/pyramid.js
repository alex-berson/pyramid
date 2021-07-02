let cards = [];

const flipCard = () => {

    document.querySelector(".card-wrap").classList.toggle("flip");
    document.querySelector(".card-wrap").style.transition = `all 0.4s ease-in-out`;

    // document.querySelector(".card-wrap").style.transform = "translate(73px, 0px)";

}

const fillPyramid = (topCell, cards, delay, interval) => {

    for (let i = 0; i < 28; i++) {

        delay += interval;

        let card = cards[i];

        card.style.left = topCell.offsetLeft + "px";

        card.style.top = topCell.offsetTop +  550 + "px";


        let cell = document.querySelectorAll(".cell")[i];

        let offsetLeft = cell.offsetLeft - card.offsetLeft;

        let offsetTop = cell.offsetTop - card.offsetTop;

        let distance = Math.sqrt(Math.pow(offsetLeft, 2) + Math.pow(offsetTop, 2));

        let duration = distance / 550 / 2;

        card.style.opacity = 1;

        card.style.transition = `all ${duration}s ${delay}s linear`;

        card.classList.toggle("flip");

        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    }
}

const fillStock = (topCell, cards, delay, interval) => {

    let stockCell = document.querySelector(".stock");

    for (let i = 28; i < 52; i++) {

        delay += 0.05;

        let card = cards[i];

        card.style.left = topCell.offsetLeft + "px";

        card.style.top = topCell.offsetTop +  550 + "px";

        let offsetLeft = stockCell.offsetLeft - card.offsetLeft;

        let offsetTop = stockCell.offsetTop - card.offsetTop;

        let distance = Math.sqrt(Math.pow(offsetLeft, 2) + Math.pow(offsetTop, 2));

        let duration = distance / 550 / 1.1;

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

    delay += 28 * interval; 

    fillStock(topCell, cards, delay, interval);

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

    for (let i = 0; i < 28; i++){

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

}

window.onload = () => {
    document.fonts.ready.then(() => {
        setTimeout(() => {
            init();     
        }, 50);
    });
}


