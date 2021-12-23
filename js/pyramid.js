const pyramidSize = 28;
const deckSize = 52;
const suits = {
    "♥": "hearts",
    "♦": "diamonds",
    "♠": "spades",
    "♣": "clubs",
} 

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => {
                console.log('Service worker registered!', reg);
            })
            .catch(err => {
                console.log('Service worker registration failed: ', err);
            });
    });
} 

const touchScreen = () => matchMedia('(hover: none)').matches;

const safari = () => {

    let userAgent = window.navigator.userAgent.toLowerCase(),
    sfri = /safari/.test(userAgent),
    ios = /iphone|ipod|ipad/.test(userAgent);

    if (sfri) return true;
     
    return false;
}

const zIndex = () => {

    const maxValue = 18874368;

    if (!zIndex.value || zIndex.value >= maxValue) zIndex.value = 1;

    zIndex.value < 5 ? zIndex.value *= 3 : zIndex.value *= 2;

    return zIndex.value;
}

const cardOpen = (card) => {

    let cards = [...document.querySelectorAll(".card-wrap")]
    let cardNumber = cards.indexOf(card);
    let row = Math.floor((-1 + Math.sqrt(1 + 8 * cardNumber)) / 2);

    if (cardNumber > 20) return true;

    if (cards[cardNumber + row + 1].classList.contains("hidden") && 
        cards[cardNumber + row + 2].classList.contains("hidden")) {
            return true;
    }
}

const clickThrough = (e) => {

    let divStack;

    if (!clickThrough.x) clickThrough.x = 0;
    if (!clickThrough.y) clickThrough.y = 0;

    if (e.type == "touchstart") {

        clickThrough.x = e.touches[e.touches.length - 1].clientX;
        clickThrough.y = e.touches[e.touches.length -1].clientY;

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

    disableCard(card);
    enableClickThrough(card);

    card.style.opacity = 0;
    card.style.transform += "scale(3.0)";
    card.classList.add("hidden");
    card.addEventListener('transitionend', resetCard); 
}

const removeZIndex = (e) => {

    let card = e.currentTarget;

    card.removeEventListener('transitionend', removeZIndex); 
    card.style.zIndex = "auto";
}


const removeStyle = (e) => {

    let card = e.currentTarget;

    card.removeEventListener('transitionend', removeStyle); 
    card.firstElementChild.firstElementChild.style = "";
    card.firstElementChild.lastElementChild.style = "";
}

const refillPyramid = (topCell, cards, offset, delay, interval, duration) => {

    let zIndex = 0;
    let cells = document.querySelectorAll('.cell');

    for (let i = 0; i < pyramidSize; i++) {

        if (!cards[i].classList.contains("hidden")) continue;

        let card = cards[i];

        card.classList.remove("hidden");
        card.style.left = topCell.offsetLeft + "px";
        card.style.top = topCell.offsetTop +  offset + "px";

        let cell = cells[i];
        let offsetLeft = cell.offsetLeft - card.offsetLeft;
        let offsetTop = cell.offsetTop - card.offsetTop;

        delay += interval;
        zIndex += 100000000;

        card.querySelectorAll(".front, .back").forEach(card => {
            card.style.transition = `all ${duration - 0.1}s ${delay + 0.1}s linear`;
        })

        card.addEventListener('transitionend', removeZIndex); 
        card.style.zIndex = zIndex;
        card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
        card.style.opacity = 1;
        card.classList.toggle("flip");
        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    }

    return delay;
}

const refillStock = (topCell, cards, offset, delay, interval, duration) => {

    let stockCell = document.querySelector(".stock");

    for (let i = pyramidSize; i < deckSize - 1; i++) {

        if (cards[i].classList.contains("hidden")) {

            let card = cards[i];

            card.classList.remove("hidden");
            card.style.left = topCell.offsetLeft + "px";
            card.style.top = topCell.offsetTop +  offset + "px";

            let offsetLeft = stockCell.offsetLeft - card.offsetLeft;
            let offsetTop = stockCell.offsetTop - card.offsetTop;

            delay += interval;

            card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
            card.style.opacity = 1;
            card.style.transform = `translate(${offsetLeft + 2}px, ${offsetTop}px)`;            
            
            continue;
        };

        let card = cards[i];

        card.addEventListener('transitionend', removeStyle); 

        let offsetLeft = stockCell.offsetLeft - card.offsetLeft;
        let offsetTop = stockCell.offsetTop - card.offsetTop;

        card.style.zIndex = 0;

        delay += interval;

        card.querySelectorAll(".front, .back").forEach(card => {
            card.style.transition = `all ${duration}s ${delay}s ease-in-out`;
        });

        card.style.transition = `all ${duration}s ${delay}s ease-in-out`;
        card.classList.toggle("flip");
        card.style.transform = `translate(${offsetLeft + 2}px, ${offsetTop}px)`;
    }

    return delay;
}

const refillPile =  (topCell, cards, offset, delay, interval, duration) => {

    if (cards[cards.length - 1].classList.contains("hidden")) {

        let pileCell = document.querySelector(".pile");
        let card = cards[cards.length - 1];

        card.classList.remove("hidden");
        card.style.left = topCell.offsetLeft + "px";
        card.style.top = topCell.offsetTop +  offset + "px";

        let offsetLeft = pileCell.offsetLeft - card.offsetLeft;
        let offsetTop = pileCell.offsetTop - card.offsetTop;

        delay += interval;

        card.querySelectorAll(".front, .back").forEach(card => {
            card.style.transition = `all ${duration - 0.2}s ${delay + 0.2}s linear`;
        });

        card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
        card.style.opacity = 1;
        card.classList.toggle("flip");
        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;           
    }

    return delay;
}

const resetTable = () => {

    let interval = 0.05;
    let duration = 0.5;
    let delay = 0;
    let topCell = document.querySelector(".cell");
    let cards = document.querySelectorAll('.card-wrap');
    let offsetPlus = safari() ? 10 : 50;
    let offset = window.innerHeight - topCell.parentNode.parentNode.offsetTop + offsetPlus;

    delay = refillStock(topCell, cards, offset, delay, interval, duration);
    delay = refillPyramid(topCell, cards, offset, delay, interval, duration);
    delay  = refillPile(topCell, cards, offset, delay, interval, duration);

    setTimeout(enableCards, (delay + duration) * 1000);
}

const awakeGame = () => {

    disableCards();

    if (touchScreen()){
        document.removeEventListener("touchstart", awakeGame);
    } else {
        document.removeEventListener("mousedown", awakeGame);
    }

    let cards = document.querySelectorAll('.card-wrap:not(.hidden)');

    cards.forEach(card => {
        let front = card.querySelector('.front');
        front.style.transition = "all 0s linear";
        front.firstElementChild.style.transition = "all 0s linear";
        front.lastElementChild.style.transition = "all 0s linear";
    });

    cards.forEach(card => {
        let front = card.querySelector('.front');
        front.style.background = "white";
        front.firstElementChild.style.opacity = 1;
        front.lastElementChild.style.opacity = 1;
    });

    setTimeout(resetTable, 100);
}

const designedShow = () => document.querySelector("#designed").classList.add("show");

const resetGame = () => {

    resetCards();
    setTimeout(designedShow, 1000);
    setTimeout(() => {
        document.querySelector("#designed").classList.remove("show");
        init()
    }, 6500);
}

const gameOver = () => {

    let cards = document.querySelectorAll('.card-wrap:not(.hidden)');

    cards.forEach(card => {

        let front = card.querySelector('.front');

        card.style.transform = card.style.transform.replace("scale(1.1)", "");
        front.style.transition = "all 0.5s linear";
        front.firstElementChild.style.transition = "all 0.5s linear";
        front.lastElementChild.style.transition = "all 0.5s linear";
    });

    cards.forEach(card => {

        let front = card.querySelector('.front');

        front.style.background = "rgb(200,200,200)";
        front.firstElementChild.style.opacity = 0.6;
        front.lastElementChild.style.opacity = 0.6;
    });

    disableCards();

    setTimeout(() => {

        if (touchScreen()){
            document.addEventListener("touchstart", awakeGame);
        } else {
            document.addEventListener("mousedown", awakeGame);
        }

    }, 500);
}

const win = () => {

    let removedCards = document.querySelectorAll('.hidden');

    if (removedCards.length == deckSize) return true;

    return false;
}

const lost = () => {

    let openCards = [];
    let flippedCards = document.querySelectorAll('.flip, .hidden');

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

    for (let i = 0; i < openCards.length; i++) {

        let rank = openCards[i].querySelector(".rank").innerText;

        if (rank == "K") return false;    
    }

    for (let i = 0; i < openCards.length - 1; i++) {
        for (let j = i + 1; j < openCards.length; j++) {

            let rank1 = openCards[i].querySelector(".rank").innerText;
            let rank2 = openCards[j].querySelector(".rank").innerText;

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
        if (win()) {setTimeout(resetGame, 600); return}
        if (lost()) {setTimeout(gameOver, 600); return}
        return;
    }

    let cards = [...document.querySelectorAll(".card-wrap")];
    let pyramid = cards.slice(0, 28);
    let topPile;

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

            if (win()) {setTimeout(resetGame, 600); return}
            if (lost()) {setTimeout(gameOver, 600); return}

            return;
        }
    }

    if (!topPile || card == topPile) return;

    let rank2 = topPile.querySelector(".rank").innerText;

    if (thirteen(rank1, rank2)) {

        removeCard(card);
        removeCard(topPile);

        if (win()) {setTimeout(resetGame, 600); return}
        if (lost()) {setTimeout(gameOver, 600); return}
    }
}

const drawCard = (card) => {

    disableCard(card);

    card.addEventListener('transitionend', enableCard); 

    let pileCell = document.querySelector(".pile");
    let offsetLeft = pileCell.offsetLeft - card.offsetLeft;
    let offsetTop = pileCell.offsetTop - card.offsetTop;

    card.style.zIndex = zIndex();
    card.querySelector(".card").classList.add("zoom");
    card.classList.toggle("flip");
    card.style.transition = `all 0.5s ease-in-out`;
    card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;

    if (lost()) setTimeout(gameOver, 600);
}

const fillPyramid = (topCell, cards, offset, delay, interval, duration) => {

    for (let i = 0; i < pyramidSize; i++) {

        delay += interval;

        let card = cards[i];

        card.style.left = topCell.offsetLeft + "px";
        card.style.top = topCell.offsetTop +  offset + "px";

        let cell = document.querySelectorAll(".cell")[i];
        let offsetLeft = cell.offsetLeft - card.offsetLeft;
        let offsetTop = cell.offsetTop - card.offsetTop;

        card.querySelectorAll(".front, .back").forEach(card => {
            card.style.transition = `all ${duration - 0.1}s ${delay + 0.1}s linear`;
        });

        card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
        card.style.opacity = 1;
        card.classList.toggle("flip");
        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    }

    return delay;
}

const fillStock = (topCell, cards, offset, delay, interval, duration) => {

    let stockCell = document.querySelector(".stock");

    for (let i = pyramidSize; i < deckSize - 1; i++) {

        delay += interval;

        let card = cards[i];

        card.style.left = topCell.offsetLeft + "px";
        card.style.top = topCell.offsetTop +  offset + "px";

        let offsetLeft = stockCell.offsetLeft - card.offsetLeft;
        let offsetTop = stockCell.offsetTop - card.offsetTop;

        card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
        card.style.opacity = 1;
        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    }

    return delay;
}

const fillPile = (topCell, cards, offset, delay, interval, duration) => {

    delay += interval

    let pileCell = document.querySelector(".pile");
    let card = cards[deckSize - 1];

    card.style.left = topCell.offsetLeft + "px";
    card.style.top = topCell.offsetTop +  offset + "px";

    let offsetLeft = pileCell.offsetLeft - card.offsetLeft;
    let offsetTop = pileCell.offsetTop - card.offsetTop;

    card.querySelectorAll(".front, .back").forEach(card => {
        card.style.transition = `all ${duration - 0.2}s ${delay + 0.2}s linear`;
    });

    card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
    card.style.opacity = 1;
    card.style.zIndex = 1;
    card.classList.toggle("flip");
    card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;

    return delay;
}

const setCardsSize = () => {

    if (window.innerHeight > window.innerWidth) {
            document.documentElement.style.setProperty('--cell-width', Math.floor(window.innerWidth *  0.97 / 7 * 0.88) + 'px');
        } else {
            document.documentElement.style.setProperty('--cell-width', Math.floor(window.innerHeight *  0.97 / 7 * 0.88) + 'px');
    }

    if (window.innerHeight > window.innerWidth) {
        document.documentElement.style.setProperty('--card-width', Math.floor(window.innerWidth *  0.97 / 7 * 0.86) + 'px');
    } else {
        document.documentElement.style.setProperty('--card-width', Math.floor(window.innerHeight *  0.97 / 7 * 0.86) + 'px');
    }
}

const setTable = () => {

    setCardsSize();
    setCards();

    let topCell = document.querySelector(".cell");
    let cards =  document.querySelectorAll(".card-wrap");

    setTimeout(() => {

        let offsetPlus = safari() ? 10 : 50;
        let offset = window.innerHeight - topCell.parentNode.parentNode.offsetTop + offsetPlus;

        let delay = 0;
        let interval = 0.05;
        let duration = 0.5;

        delay = fillPyramid(topCell, cards, offset, delay, interval, duration);
        delay = fillPile(topCell, cards, offset, delay, interval, duration);

        fillStock(topCell, cards, offset, delay, interval, duration);

    }, 500);
}

const zoom = (card) => {
    card.style.transition = 'transform 0.25s linear';
    card.style.transform += "scale(1.1)";
}

const removeZoom = (e) => {

    let card = e.currentTarget;

    card.style.transform = card.style.transform.replace("scale(1.1)", "");
}

const turn = (e) => {

    let card = e.currentTarget;

    if (!card.classList.contains("flip")){
        drawCard(card);        
        return;
    }

    if (cardOpen(card)) {
        zoom(card);
        checkPairs(card);
    }
}

const enableCard = (card) => {

    card = card.currentTarget ? card.currentTarget : card;

    card.removeEventListener('transitionend', enableCard); 
    card.firstElementChild.classList.remove("zoom");
    disableClickThrough(card);
    
    if (touchScreen()){
        card.addEventListener("touchstart", turn);
        card.addEventListener("touchend", removeZoom);
        card.addEventListener("touchcancel", removeZoom);
    } else {
        card.addEventListener("mousedown", turn);
        card.addEventListener("mouseup", removeZoom);
        card.addEventListener("mouseleave", removeZoom);
    }
}

const enableCards = () => {
    for (let card of document.querySelectorAll('.card-wrap')){
        enableCard(card);
    }
}

const disableCard = (card) => {
    if (touchScreen()){
        card.removeEventListener("touchstart", turn);
        card.removeEventListener("touchend", removeZoom);
        card.removeEventListener("touchcancel", removeZoom);
    } else {
        card.removeEventListener("mousedown", turn);
        card.removeEventListener("mouseup", removeZoom);
        card.removeEventListener("mouseleave", removeZoom);
    }
} 

const disableCards = () => {
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

    let deck = [];
    let ranks = decks[Math.floor(Math.random() * decks.length)];
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

            if (!deck.includes(card)) {
                deck.push(card);
                break;
            }
        }
    });

    return deck;
}

const resetCard = (e) => {

    let card = e.currentTarget;

    card.removeEventListener('transitionend', resetCard); 

    card.style = "";
    card.className = "card-wrap hidden";
    card.firstElementChild.style = "";
    card.firstElementChild.className = "card";
    card.firstElementChild.firstElementChild.style = "";
    card.firstElementChild.firstElementChild.firstElementChild.style = "";
    card.firstElementChild.firstElementChild.lastElementChild.style = "";
    card.firstElementChild.lastElementChild.style = "";
}

const resetCards = () => {

    let cards = document.querySelectorAll('.card-wrap');

    cards.forEach(card => {
        card.classList.remove("hidden");
        card.firstElementChild.firstElementChild.classList.remove("red");
    })
}

const setCards = () => {

    deck = getDeck();

    for (let i = 0; i < 52; i++){

        let card = document.querySelectorAll(".front")[i];
        let rank = deck[i].length == 2 ? deck[i][0] : deck[i][0] + deck[i][1];
        let suit = deck[i].length == 2 ? deck[i][1] : deck[i][2];

        if (suit == "♥" || suit == "♦") { 
            card.classList.add("red");
        }

        card.querySelector(".rank").innerText = rank;

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
}

const disableTapZoom = () => {

    const preventDefault = (e) => e.preventDefault();

    document.body.addEventListener('touchstart', preventDefault, { passive: false });
}

const init = () => {

    disableTapZoom();

    disableCards();

    setTable();

    setTimeout(enableCards, 3700);    
}

window.onload = () => {
    document.fonts.ready.then(() => {
        init(); 
    });
}
