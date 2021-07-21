let cards = [];
const pyramidSize = 28;
const deckSize = 52;
let repeat = false;

const zIndex = (index = 1) => {

    if (!index) {
        zIndex.value = 0;
        return;
    }

    if (!zIndex.value) zIndex.value = 1;

    zIndex.value < 5 ? zIndex.value *= 3 : zIndex.value *= 2;

    // zIndex.value *= 2;


    // if (!index) {
    //     zIndex.value = -129140163;
    //     return;
    // }

    // if (!zIndex.value) zIndex.value = -129140163;

    // zIndex.value < -1 ? zIndex.value /= 3 : zIndex.value = Math.abs(zIndex.value) * 3;





    // console.log(zIndex.value);

    return zIndex.value;
}

const stockReindex = () => {

    let index = -1000;

    el = document.querySelector('.stock');


    for (let i = 0; i < 8; i++) {

        el.style.zIndex = index;

        console.log(el);

        el = el.parentNode;


        index--;

    }



    index = -100;



    let cards = document.querySelectorAll('.card-wrap:not(.flip)');

    cards.forEach(card => {

        card.style.zIndex = index;

        index++;
    });

}

const changeFlipDirection = () => {

    const flipDirection = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--flip-direction'));

    document.documentElement.style.setProperty('--flip-direction', flipDirection * -1);
}

const cardOpen = (card) => {

    let cards = [...document.querySelectorAll(".card-wrap")]

    let cardIndex = cards.indexOf(card);

    if (cardIndex > 20) return true;

    let row = Math.floor((-1 + Math.sqrt(1 + 8 * cardIndex)) / 2);

    if (cards[cardIndex + row + 1].classList.contains("hidden") && 
        cards[cardIndex + row + 2].classList.contains("hidden")) {

            return true;
    }
}

const clickThrough = (e) => {

    let divStack;

    // console.log(e);

    // console.log(e.type);

    if (!clickThrough.x) clickThrough.x = 0;

    if (!clickThrough.y) clickThrough.y = 0;

    if (e.type == "touchstart") {
       
        clickThrough.x = e.touches[0].clientX;
        clickThrough.y = e.touches[0].clientY;

        divStack = document.elementsFromPoint(clickThrough.x, clickThrough.y);

    } else if (e.type == "mousedown") {

        clickThrough.x = e.clientX;
        clickThrough.y = e.clientY;

        divStack = document.elementsFromPoint(clickThrough.x, clickThrough.y);

    } else {

        divStack = document.elementsFromPoint(clickThrough.x, clickThrough.y);

        clickThrough.x = 0;
        clickThrough.y = 0;
    }

    // console.log(divStack);

    // console.log(divStack[0]);

    for (div of divStack) {

        if (div.classList.contains("card-wrap") && !div.classList.contains("hidden")) {

            if (e.type == "touchstart" || e.type == "mousedown") {

                let touchEvent = touchScreen() ? new Event('touchstart') : new Event('mousedown');

                div.dispatchEvent(touchEvent);

            } else {

                let touchEvent = touchScreen() ? new Event('touchend') : new Event('mouseup');

                div.dispatchEvent(touchEvent);
            }
            break;
        }
    }
}

const enableClickThrough = (card) => {

    if (touchScreen()){
        card.addEventListener("touchstart", clickThrough);
        card.addEventListener("touchend", clickThrough);
    } else {
        card.addEventListener("mousedown", clickThrough);
        card.addEventListener("mouseup", clickThrough);
    }
}

const disableClickThrough = (card) => {

    if (touchScreen()){
        card.removeEventListener("touchstart", clickThrough);
        card.removeEventListener("touchend", clickThrough);
    } else {
        card.removeEventListener("mousedown", clickThrough);
        card.removeEventListener("mouseup", clickThrough);
    }
}

const removeCard = (card) => {

    card.style.transition = 'all 0.5s linear';


    // card.querySelectorAll(".front, .back").forEach(card => {

    //     card.style.transition = 'opacity 0.5s linear';

    // })

    disableCard(card);

    enableClickThrough(card);

    // card.style.pointerEvents = "none";

    card.style.opacity = 0;

    card.style.transform += "scale(3.0)";

    // card.classList.add("untouchable");

    card.classList.add("hidden");

    // if (win()) {repeat = false; setTimeout(init, 1000);}

    // if (lost()) gameOver();
}

// const newGame = () => {
//     console.log("NEW");
// }

const clearBoard = () => {

    if (touchScreen()){
        document.removeEventListener("touchstart", clearBoard);
    } else {
        document.removeEventListener("mousedown", clearBoard);
    }

    let cards = document.querySelectorAll('.card-wrap');


    for (let i = 28; i < 52; i++) {

        if (cards[i].classList.contains("flip") && !cards[i].classList.contains("hidden")) {
            
            for (let j = i + 1; j < 52; j++) {
                cards[j].classList.add("hidden");
                cards[j].style.transition = `all 0s linear`;
                cards[j].style.opacity = 0;
            }
            break;
        }
    }


    cards = document.querySelectorAll('.card-wrap:not(.hidden)');


    // let topCell = document.querySelector(".cell");

    // let offset = window.innerHeight - topCell.parentNode.parentNode.offsetTop + 100;

    let interval = 0.05;

    let duration = 0.5;


    cards.forEach((card, i) => {
        // card.style.transition = 'all 0.5s linear, opacity 0.5s ease-out';


        card.style.transition = `all ${duration}s ${interval * i}s linear`;

        // let front = card.querySelector('.front');

        card.style.opacity = 0;

        // card.style.transform += "scale(10.0)";

    })

    setTimeout(resetGame, (cards.length * interval + duration) * 1000);

}

const resetGame = () => {

    resetCards();
    setTimeout(init, 1000);
}

const gameOver = () => {

    repeat = true;

    // console.log("LOST");

    let cards = document.querySelectorAll('.card-wrap:not(.hidden)');

    // console.log(cards);

    cards.forEach(card => {

        let front = card.querySelector('.front');

        let color = window.getComputedStyle(front).getPropertyValue('color');

        // console.log(color);

        // front.style = "";

        // front.style.color = color;

        front.style.transition = "all 1s linear";

        front.children[0].style.transition = "all 1s linear";

        front.children[1].style.transition = "all 1s linear";

    });

    cards.forEach(card => {

        let front = card.querySelector('.front');

        front.style.background = "gainsboro";

        // console.log(front.children);

        front.children[0].style.opacity = 0.7;
        front.children[1].style.opacity = 0.7;

    });

    setTimeout(() => {

        if (touchScreen()){
            document.addEventListener("touchstart", clearBoard);
        } else {
            document.addEventListener("mousedown", clearBoard);
        }

    }, 1000);

}

const win = () => {

    let removedCards = document.querySelectorAll('.hidden');

    if (removedCards.length == deckSize) return true;

    return false;
}

const lost = () => {

    let openCards = [];

    let flippedCards = document.querySelectorAll('.flip');

    if (flippedCards.length < deckSize) return false;

    cards = document.querySelectorAll('.card-wrap');

    for (let i = 28; i < 52; i++) {

        if (cards[i].classList.contains("flip") && !cards[i].classList.contains("hidden")) {
            openCards.push(cards[i]);
            break;
        }
    }

    for (let i = 0; i < 28; i++) {

        if (!cardOpen(cards[i]) || cards[i].classList.contains("hidden")) continue;

        openCards.push(cards[i]);
    }

    // console.log(openCards);

    for (let i = 0; i < openCards.length; i++) {

        let rank = openCards[i].querySelector(".rank").innerText;

        if (rank == "K") return false;    
    }

    for (let i = 0; i < openCards.length - 1; i++) {

        for (let j = i + 1; j < openCards.length; j++) {

            let rank1 = openCards[i].querySelector(".rank").innerText;

            let rank2 = openCards[j].querySelector(".rank").innerText;

            // console.log(rank1);

            // console.log(rank2);

            if (thirteen(rank1, rank2)) return false
        }
    }

    return true;
}

const rankValue = (rank) => {

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

const thirteen = (rank1, rank2) =>{

    if (rankValue(rank1) + rankValue(rank2) == 13) return true;

    return false;
}

const checkPairs = (card) => {

    let rank1 = card.querySelector(".rank").innerText;

    if (rank1 == "K") {
        removeCard(card);
        if (win()) {repeat = false; setTimeout(resetGame, 1000); return}
        if (lost()) {setTimeout(gameOver, 600); return}
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

        if (!cardOpen(cards[i]) || cards[i].classList.contains("hidden")) continue;

        let rank2 = cards[i].querySelector(".rank").innerText;

        if (pyramid[i] != card && thirteen(rank1, rank2)) {

            removeCard(card);
            removeCard(cards[i]);

            if (win()) {repeat = false; setTimeout(resetGame, 1000); return}
            if (lost()) {gameOver(); return}

            return;
        }
    }

    if (!topPile || card == topPile) return;

    let rank2 = topPile.querySelector(".rank").innerText;

    if (thirteen(rank1, rank2)) {

        removeCard(card);
        removeCard(topPile);

        if (win()) {repeat = false; setTimeout(resetGame, 1000); return}
        if (lost()) {gameOver(); return}

    }
}

const drawCard = (card) => {

    disableCard(card);

    card.addEventListener('transitionend', enableCard); 

    let pileCell = document.querySelector(".pile");

    let offsetLeft = pileCell.offsetLeft - card.offsetLeft;

    let offsetTop = pileCell.offsetTop - card.offsetTop;

    // card.style.zIndex = generator.next().value;

    card.style.zIndex = zIndex();

    card.querySelector(".card").classList.add("zoom");

    card.classList.toggle("flip");

    card.style.transition = `all 0.5s 0.00s linear`;

    card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;

    if (lost()) setTimeout(gameOver, 500);
}

const fillPyramid = (topCell, cards, offset, delay, interval) => {

    for (let i = 0; i < pyramidSize; i++) {

        delay += interval;

        let card = cards[i];

        card.style.left = topCell.offsetLeft + "px";

        card.style.top = topCell.offsetTop +  offset + "px";

        // card.style.top = topCell.offsetTop +  550 + "px";


        // console.log(card.style.top);

        let cell = document.querySelectorAll(".cell")[i];

        let offsetLeft = cell.offsetLeft - card.offsetLeft;

        let offsetTop = cell.offsetTop - card.offsetTop;

        // let distance = Math.sqrt(Math.pow(offsetLeft, 2) + Math.pow(offsetTop, 2));

        // let duration = distance / 550 / 2;

        duration = 0.5;

        card.querySelectorAll(".front, .back").forEach(card => {

            card.style.transition = `all ${duration - 0.2}s ${delay + 0.2}s linear`;

        })

        card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;

        card.style.opacity = 1;


        card.classList.toggle("flip");

        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    }
}

const fillStock = (topCell, cards, offset, delay, interval) => {

    let stockCell = document.querySelector(".stock");

    for (let i = pyramidSize; i < deckSize - 1; i++) {

        delay += interval;

        let card = cards[i];

        card.style.left = topCell.offsetLeft + "px";

        card.style.top = topCell.offsetTop +  offset + "px";

        let offsetLeft = stockCell.offsetLeft - card.offsetLeft;

        let offsetTop = stockCell.offsetTop - card.offsetTop;

        // let distance = Math.sqrt(Math.pow(offsetLeft, 2) + Math.pow(offsetTop, 2));

        // let duration = distance / 550 / 1.1;

        duration = 0.5;

        card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;

        card.style.opacity = 1;

        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    }

}

const fillPile = (topCell, cards, offset, delay, interval) => {

    let pileCell = document.querySelector(".pile");

    let card = cards[deckSize - 1];

    card.style.left = topCell.offsetLeft + "px";

    card.style.top = topCell.offsetTop +  offset + "px";

    let offsetLeft = pileCell.offsetLeft - card.offsetLeft;

    let offsetTop = pileCell.offsetTop - card.offsetTop;

    duration = 0.5;

    // delay += interval;

    card.querySelectorAll(".front, .back").forEach(card => {

        card.style.transition = `all ${duration - 0.2}s ${delay + 0.2}s linear`;

    })

    card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;

    card.style.opacity = 1;

    card.classList.toggle("flip");

    card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;

}

const setBoardSize = () => {

    let boardSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size'));

    // console.log(boardSize);


    // console.log(window.innerWidth);


    if (window.innerHeight > window.innerWidth) {
            document.documentElement.style.setProperty('--board-width', window.innerWidth *  boardSize + 'px');
        } else {
            document.documentElement.style.setProperty('--board-width', window.innerHeight * boardSize + 'px');
    }


    boardSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-width'));

    // console.log(boardSize);
}

const setBoard = () => {

    // setBoardSize();

    setCards();

    let topCell = document.querySelector(".cell");

    let cards =  document.querySelectorAll(".card-wrap");

    // console.log(cards[0].style.top);

    // console.log(topCell.parentNode.parentNode.offsetTop);

    // console.log(topCell.style.top);

    // console.log(window.innerHeight);


    let offset = window.innerHeight - topCell.parentNode.parentNode.offsetTop + 100;

    // console.log(offset);

    // if (window.innerHeight > window.innerWidth) {
    //     offset = window.innerHeight - topCell.parentNode.parentNode.offsetTop;
    // } else {
    //     offset = window.innerH - topCell.parentNode.parentNode.offsetTop;
    // }

    // setTimeout(() => {

    let delay = 0;

    let interval = 0.05;

    fillPyramid(topCell, cards, offset, delay, interval);

    // delay = pyramidSize * interval; 

    // fillStock(topCell, cards, delay, interval);

    // delay = (deckSize) * interval;

    // fillPile(topCell, cards, delay, interval);

    delay = pyramidSize * interval; 

    fillPile(topCell, cards, offset, delay, interval);

    delay = pyramidSize * interval + interval;

    fillStock(topCell, cards, offset, delay, interval);


    // }, 0);

}

const zoom = (card) => {

    // card.querySelector(".card").classList.add("zoom");

    card.style.transition = 'transform 0.25s linear';

    card.style.transform += "scale(1.1)";
}

const removeZoom = (card) => {

    if (card.currentTarget) card = card.currentTarget;


    // let card = e.currentTarget;

    // card.querySelector(".card").classList.remove("zoom");

    card.style.transform = card.style.transform.replace("scale(1.1)", "");
}

const turn = (card) => {

    // pe();

    if (card.currentTarget) card = card.currentTarget;

    // let card = e.currentTarget;

    if (!card.classList.contains("flip")){
        drawCard(card);
        return;
    }

    if (cardOpen(card)) {

        // console.log(card.querySelector(".rank").innerText);

        zoom(card);
        checkPairs(card);

        // card.style.pointerEvents = "none";
    }
}

const touchScreen = () => {
    return matchMedia('(hover: none)').matches;
}



const enableCard = (card) => {

    if (card.currentTarget) card = card.currentTarget;

    card.removeEventListener('transitionend', enableCard); 

    disableClickThrough(card);
    
    // card.style.pointerEvents = "none";

    if (touchScreen()){
        card.addEventListener("touchstart", turn);
        card.addEventListener("touchend", removeZoom);

    } else {
        card.addEventListener("mousedown", turn);
        card.addEventListener("mouseup", removeZoom);
    }

    // card.style.pointerEvents = "auto";

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
    let ranks;

    // getDeck.ranks = [4,  9, 2,  3,  5, 10,  8,  1,  6,  2,  9,
    //     7,  9, 1, 12,  5, 13, 11,  1, 12, 13,  7,
    //     5,  7, 6, 11,  3,  3, 10,  4, 12,  8, 11,
    //     9,  3, 4,  7, 10,  6,  2,  2, 13, 13,  4,
    //    12, 10, 1,  8,  6,  5,  8, 11];

    
    if (!repeat) getDeck.ranks = decks[Math.floor(Math.random() * decks.length)];

    console.log("deck length: ", decks.length);

    console.log(getDeck.ranks);

    let suits = ['♥','♠','♦','♣'];

    getDeck.ranks.forEach(rank => {

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
}

const resetCards = () => {

    zIndex(0);

    let cards = document.querySelectorAll('.card-wrap');

    cards.forEach(card => {

        card.style = "";
        card.className = "card-wrap";
        card.firstElementChild.style = "";
        card.firstElementChild.className = "card";
        card.firstElementChild.firstElementChild.style = "";
        card.firstElementChild.firstElementChild.firstElementChild.style = "";
        card.firstElementChild.firstElementChild.lastElementChild.style = "";
        card.firstElementChild.lastElementChild.style = "";
    })
}

const setCards = () => {

    // resetCards();

    getDeck();

    for (let i = 0; i < 52; i++){

        let card = document.querySelectorAll(".front")[i];

        let rank = cards[i].length == 2 ? cards[i][0] : cards[i][0] + cards[i][1];
        let suit = cards[i].length == 2 ? cards[i][1] : cards[i][2];

        if (suit == "♥" || suit == "♦") { 
            card.style.color = "red";
        }

        card.querySelector(".rank").innerText = rank;
        // card.querySelector(".suit").innerText = suit;
        // card.querySelector(".main").innerText = suit;  

        switch(suit){
            case "♥":
                card.querySelector(".suit").firstElementChild.src = "images/suits/hearts.png";
                card.querySelector(".main").firstElementChild.src = "images/suits/hearts.png";
                break;
            case "♦":
                card.querySelector(".suit").firstElementChild.src = "images/suits/diamonds.png";
                card.querySelector(".main").firstElementChild.src = "images/suits/diamonds.png";
                break;
            case "♠":
                card.querySelector(".suit").firstElementChild.src = "images/suits/spades.png";
                card.querySelector(".main").firstElementChild.src = "images/suits/spades.png";
                break;
            case "♣":
                card.querySelector(".suit").firstElementChild.src = "images/suits/clubs.png";
                card.querySelector(".main").firstElementChild.src = "images/suits/clubs.png";
                break;
        }
    }

    // let card = [...document.querySelectorAll(".front")].pop();

    // card.querySelector(".main").innerHTML = `<span>${suit}</span>`;  
}

const disableTouchMove = () => {

    const preventDefault = (e) => e.preventDefault();

    document.body.addEventListener('touchmove', preventDefault, { passive: false });
}

const init = () => {


        disableTouchMove();

        setBoard();


    setTimeout(() => {

        // stockReindex();
        
        enableTouch();

        // changeFlipDirection();

    }, 3000);

    
}

window.onload = () => {
    document.fonts.ready.then(() => {
        setTimeout(() => {
            init();     
        }, 50);
    });
}
