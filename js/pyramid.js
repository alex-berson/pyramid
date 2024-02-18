const pyramidSize = 28;
const deckSize = 52;

const safari = () => {

    let ua = navigator.userAgent;

    return  /Safari/.test(ua) && !/Chrome/.test(ua);
}

const zIndex = () => {

    let maxValue = 9 * 2 ** 21;

    if (!zIndex.value || zIndex.value >= maxValue) zIndex.value = 1;

    zIndex.value < 5 ? zIndex.value *= 3 : zIndex.value *= 2;

    return zIndex.value;
}

const uncovered = (card) => {

    let cards = [...document.querySelectorAll('.card-wrap')]
    let cardNumber = cards.indexOf(card);
    let row = Math.floor((-1 + Math.sqrt(1 + 8 * cardNumber)) / 2);

    if (cardNumber >= pyramidSize - 7) return true;

    if (cards[cardNumber + row + 1].classList.contains('hidden') && 
        cards[cardNumber + row + 2].classList.contains('hidden')) {
            return true;
    }
}

const clickThrough = (e) => {

    let divStack;

    if (!clickThrough.x) clickThrough.x = 0;
    if (!clickThrough.y) clickThrough.y = 0;

    if (e.type == 'touchstart') {

        clickThrough.x = e.touches[e.touches.length - 1].clientX;
        clickThrough.y = e.touches[e.touches.length -1].clientY;

        divStack = document.elementsFromPoint(clickThrough.x, clickThrough.y);

    } else if (e.type == 'mousedown') {

        clickThrough.x = e.clientX;
        clickThrough.y = e.clientY;

        divStack = document.elementsFromPoint(clickThrough.x, clickThrough.y);

    } else {

        divStack = document.elementsFromPoint(clickThrough.x, clickThrough.y);

        clickThrough.x = 0;
        clickThrough.y = 0;
    }

    for (div of divStack) {

        if (div.classList.contains('card-wrap') && !div.classList.contains('hidden')) {

            let event = new Event(e.type);

            div.dispatchEvent(event);

            break;
        }
    }
}

const enableClickThrough = (card) => {

    card.addEventListener('touchstart', clickThrough);
    card.addEventListener('touchend', clickThrough);
    card.addEventListener('mousedown', clickThrough);
    card.addEventListener('mouseup', clickThrough);
}

const disableClickThrough = (card) => {

    card.removeEventListener('touchstart', clickThrough);
    card.removeEventListener('touchend', clickThrough);
    card.removeEventListener('mousedown', clickThrough);
    card.removeEventListener('mouseup', clickThrough);
}

const removeCard = (card) => {

    card.style.transition = 'all 0.5s linear';

    disableCard(card);
    enableClickThrough(card);

    card.style.opacity = 0;
    card.style.transform += 'scale(3.0)';
    card.classList.add('hidden');

    card.addEventListener('transitionend', (e) => {

        let card = e.currentTarget;

        card.classList.remove('flip');
        card.removeAttribute('style');

        card.querySelectorAll('*').forEach(el => {
            el.removeAttribute('style');
        });

    }, {once: true}); 
}

const refillPyramid = (topCell, cards, offset, delay, interval, duration) => {

    let zIndex = 0;
    let cells = document.querySelectorAll('.cell');

    for (let i = 0; i < pyramidSize; i++) {

        if (!cards[i].classList.contains('hidden')) continue;

        let card = cards[i];

        card.classList.remove('hidden');
        card.style.left = topCell.offsetLeft + 'px';
        card.style.top = topCell.offsetTop +  offset + 'px';

        let cell = cells[i];
        let offsetLeft = cell.offsetLeft - card.offsetLeft;
        let offsetTop = cell.offsetTop - card.offsetTop;

        delay += interval;
        zIndex += 1e8;

        card.querySelector('.card-inner').style.transition = `all ${duration - 0.1}s ${delay + 0.1}s linear`;

        card.addEventListener('transitionend', (e) => {

            let card = e.currentTarget;

            card.style.zIndex = 'auto';

        }, {once: true}); 

        card.style.zIndex = zIndex;
        card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
        card.style.opacity = 1;
        card.classList.toggle('flip');
        card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
    }

    return delay;
}

const refillStock = (topCell, cards, offset, delay, interval, duration) => {

    let stockCell = document.querySelector('.stock');

    for (let i = pyramidSize; i < deckSize - 1; i++) {

        if (cards[i].classList.contains('hidden')) {

            let card = cards[i];

            card.classList.remove('hidden');
            card.style.left = topCell.offsetLeft + 'px';
            card.style.top = topCell.offsetTop +  offset + 'px';

            let offsetLeft = stockCell.offsetLeft - card.offsetLeft;
            let offsetTop = stockCell.offsetTop - card.offsetTop;

            delay += interval;

            card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
            card.style.opacity = 1;
            card.style.transform = `translate(${offsetLeft + 2}px, ${offsetTop}px)`;            
            
            continue;
        };

        let card = cards[i];

        card.addEventListener('transitionend', (e) => {

            let card = e.currentTarget;

            card.querySelector('.card-inner').style = '';

        }, {once: true}); 

        let offsetLeft = stockCell.offsetLeft - card.offsetLeft;
        let offsetTop = stockCell.offsetTop - card.offsetTop;

        card.style.zIndex = 0;

        delay += interval;

        card.querySelector('.card-inner').style.transition = `all ${duration}s ${delay}s linear`;

        card.style.transition = `all ${duration}s ${delay}s ease-in-out`;
        card.classList.toggle('flip');
        card.style.transform = `translate(${offsetLeft + 2}px, ${offsetTop}px)`;
    }

    return delay;
}

const refillPile =  (topCell, cards, offset, delay, interval, duration) => {

    if (cards[cards.length - 1].classList.contains('hidden')) {

        let pileCell = document.querySelector('.pile');
        let card = cards[cards.length - 1];

        card.classList.remove('hidden');
        card.style.left = topCell.offsetLeft + 'px';
        card.style.top = topCell.offsetTop +  offset + 'px';

        let offsetLeft = pileCell.offsetLeft - card.offsetLeft;
        let offsetTop = pileCell.offsetTop - card.offsetTop;

        delay += interval;

        card.querySelector('.card-inner').style.transition = `all ${duration - 0.2}s ${delay + 0.2}s linear`;

        card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
        card.style.opacity = 1;
        card.classList.toggle('flip');
        card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;           
    }

    return delay;
}

const resetTable = () => {

    let interval = 0.05;
    let duration = 0.5;
    let delay = 0;
    let topCell = document.querySelector('.cell');
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

    document.removeEventListener('touchstart', awakeGame);
    document.removeEventListener('mousedown', awakeGame);

    let cards = document.querySelectorAll('.card-wrap:not(.hidden)');

    cards.forEach(card => {

        let front = card.querySelector('.front');

        front.style.transition = 'all 0s linear';
        front.firstElementChild.style.transition = 'all 0s linear';
        front.lastElementChild.style.transition = 'all 0s linear';
    });

    cards.forEach(card => {

        let front = card.querySelector('.front');

        front.style.background = 'white';
        front.firstElementChild.style.opacity = 1;
        front.lastElementChild.style.opacity = 1;
    });

    setTimeout(resetTable, 100);
}

const newGame = () => {

    let designed = document.querySelector('#designed');

    setTimeout(() => designed.classList.add('show'), 1000);

    designed.addEventListener('animationend', () => {

        designed.classList.remove('show');

        setTable();
        setTimeout(enableCards, 3700); 

    }, {once: true});
}

const freezeGame = () => {

    let cards = document.querySelectorAll('.card-wrap:not(.hidden)');

    cards.forEach(card => {

        let front = card.querySelector('.front');

        card.style.transform = card.style.transform.replace('scale(1.1)', '');
        front.style.transition = 'all 0.5s linear';
        front.firstElementChild.style.transition = 'all 0.5s linear';
        front.lastElementChild.style.transition = 'all 0.5s linear';
    });

    cards.forEach(card => {

        let front = card.querySelector('.front');

        front.style.background = 'rgb(200,200,200)';
        front.firstElementChild.style.opacity = 0.6;
        front.lastElementChild.style.opacity = 0.6;
    });

    disableCards();

    setTimeout(() => {

        document.addEventListener('touchstart', awakeGame);
        document.addEventListener('mousedown', awakeGame);

    }, 500);
}

const won = () => {

    let removedCards = document.querySelectorAll('.hidden');

    if (removedCards.length == deckSize) return true;

    return false;
}

const lost = () => {

    let openCards = [];
    let flippedCards = document.querySelectorAll('.flip, .hidden');

    if (flippedCards.length < deckSize) return false;

    cards = document.querySelectorAll('.card-wrap');

    for (let i = pyramidSize; i < deckSize; i++) {
        if (cards[i].classList.contains('flip') && !cards[i].classList.contains('hidden')) {
            openCards.push(cards[i]);
            break;
        }
    }

    for (let i = 0; i < pyramidSize; i++) {
        if (!uncovered(cards[i]) || cards[i].classList.contains('hidden')) continue;
        openCards.push(cards[i]);
    }

    for (let i = 0; i < openCards.length; i++) {

        let rank = openCards[i].querySelector('.rank').innerText;

        if (rank == 'K') return false;    
    }

    for (let i = 0; i < openCards.length - 1; i++) {
        for (let j = i + 1; j < openCards.length; j++) {

            let rank1 = openCards[i].querySelector('.rank').innerText;
            let rank2 = openCards[j].querySelector('.rank').innerText;

            if (thirteen(rank1, rank2)) return false
        }
    }

    return true;
}

const cardValue = (rank) => {

    switch(rank) {
        case 'A':
            rank = 1;
            break;
        case 'J':
            rank = 11;
            break;
        case 'Q':
            rank = 12;
            break;
        case 'K':
            rank = 13;
            break;
        default:
            rank = Number(rank);
    }

    return rank;
}

const thirteen = (rank1, rank2) => {

    if (cardValue(rank1) + cardValue(rank2) == 13) return true;

    return false;
}

const checkPairs = (card) => {

    let rank1 = card.querySelector('.rank').innerText;

    if (rank1 == 'K') {

        removeCard(card);

        if (won()) {
            setTimeout(newGame, 600);
            return;
        }

        if (lost()) {setTimeout(freezeGame, 600);
            return;
        }

        return;
    }

    let cards = [...document.querySelectorAll('.card-wrap')];
    let pyramid = cards.slice(0, pyramidSize);
    let topPile;

    for (let i = pyramidSize; i < deckSize; i++) {

        if (cards[i].classList.contains('flip') && !cards[i].classList.contains('hidden')) {
            topPile = cards[i];
            break;
        }
    }

    for (let i = 0; i < pyramidSize; i++) {

        if (!uncovered(cards[i]) || cards[i].classList.contains('hidden')) continue;

        let rank2 = cards[i].querySelector('.rank').innerText;

        if (pyramid[i] != card && thirteen(rank1, rank2)) {

            removeCard(card);
            removeCard(cards[i]);

            if (won()) {
                setTimeout(newGame, 600);
                return;
            }

            if (lost()) {
                setTimeout(freezeGame, 600);
                return;
            }

            return;
        }
    }

    if (!topPile || card == topPile) return;
    if (topPile.firstElementChild.classList.contains('zoom')) return;

    let rank2 = topPile.querySelector('.rank').innerText;

    if (thirteen(rank1, rank2)) {

        removeCard(card);
        removeCard(topPile);

        if (won()) {
            setTimeout(newGame, 600);
            return;
        }

        if (lost()) {
            setTimeout(freezeGame, 600);
            return;
        }
    }
}

const drawCard = (card) => {

    disableCard(card);

    card.addEventListener('transitionend', () => {

        card.firstElementChild.classList.remove('zoom');

        enableCard(card);

    }, {once: true}); 

    let pileCell = document.querySelector('.pile');
    let offsetLeft = pileCell.offsetLeft - card.offsetLeft;
    let offsetTop = pileCell.offsetTop - card.offsetTop;

    card.style.zIndex = zIndex();
    card.firstElementChild.classList.add('zoom');
    card.classList.toggle('flip');
    card.style.transition = `transform 0.5s ease-in-out`;
    card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;

    if (lost()) setTimeout(freezeGame, 600);
}

const fillPyramid = (topCell, cards, offset, delay, interval, duration) => {

    for (let i = 0; i < pyramidSize; i++) {

        delay += interval;

        let card = cards[i];

        card.style.left = topCell.offsetLeft + 'px';
        card.style.top = topCell.offsetTop +  offset + 'px';

        let cell = document.querySelectorAll('.cell')[i];
        let offsetLeft = cell.offsetLeft - card.offsetLeft;
        let offsetTop = cell.offsetTop - card.offsetTop;

        card.querySelector('.card-inner').style.transition = `all ${duration - 0.1}s ${delay + 0.1}s linear`;

        card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
        card.style.opacity = 1;
        card.classList.toggle('flip');
        card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
    }

    return delay;
}

const fillStock = (topCell, cards, offset, delay, interval, duration) => {

    let stockCell = document.querySelector('.stock');

    for (let i = pyramidSize; i < deckSize - 1; i++) {

        delay += interval;

        let card = cards[i];

        card.style.left = topCell.offsetLeft + 'px';
        card.style.top = topCell.offsetTop +  offset + 'px';

        let offsetLeft = stockCell.offsetLeft - card.offsetLeft;
        let offsetTop = stockCell.offsetTop - card.offsetTop;

        card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
        card.style.opacity = 1;
        card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
    }

    return delay;
}

const fillPile = (topCell, cards, offset, delay, interval, duration) => {

    delay += interval;

    let pileCell = document.querySelector('.pile');
    let card = cards[deckSize - 1];

    card.style.left = topCell.offsetLeft + 'px';
    card.style.top = topCell.offsetTop +  offset + 'px';

    let offsetLeft = pileCell.offsetLeft - card.offsetLeft;
    let offsetTop = pileCell.offsetTop - card.offsetTop;

    card.querySelector('.card-inner').style.transition = `all ${duration - 0.2}s ${delay + 0.2}s linear`;

    card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
    card.style.opacity = 1;
    card.style.zIndex = 1;
    card.classList.toggle('flip');
    card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;

    return delay;
}

const setCardsSize = () => {

    if (window.innerHeight > window.innerWidth) {
        document.documentElement.style.setProperty('--card-width', Math.floor(window.innerWidth *  0.97 / 7 * 0.86) + 'px');
    } else {
        document.documentElement.style.setProperty('--card-width', Math.floor(window.innerHeight *  0.97 / 7 * 0.86) + 'px');
    }
}

const setTable = () => {

    setCardsSize();
    setCards();

    let topCell = document.querySelector('.cell');
    let cards =  document.querySelectorAll('.card-wrap');

    setTimeout(() => {

        let delay = 0;
        let interval = 0.05;
        let duration = 0.5;
        let offsetPlus = safari() ? 10 : 50;
        let offset = window.innerHeight - topCell.parentNode.parentNode.offsetTop + offsetPlus;

        delay = fillPyramid(topCell, cards, offset, delay, interval, duration);
        delay = fillPile(topCell, cards, offset, delay, interval, duration);

        fillStock(topCell, cards, offset, delay, interval, duration);

    }, 500);
}

const zoom = (card) => {

    card.style.transition = 'transform 0.25s linear';
    card.style.transform += 'scale(1.1)';
}

const removeZoom = (e) => {

    let card = e.currentTarget;

    card.style.transform = card.style.transform.replace('scale(1.1)', '');
}

const move = (e) => {

    let card = e.currentTarget;

    if (!card.classList.contains('flip')) {
        drawCard(card);        
        return;
    }

    if (uncovered(card)) {
        zoom(card);
        checkPairs(card);
    }
}

const enableCard = (card) => {

    disableClickThrough(card);
    
    card.addEventListener('touchstart', move);
    card.addEventListener('touchend', removeZoom);
    card.addEventListener('touchcancel', removeZoom);
    card.addEventListener('mousedown', move);
    card.addEventListener('mouseup', removeZoom);
    card.addEventListener('mouseleave', removeZoom);
}

const enableCards = () => {

    for (let card of document.querySelectorAll('.card-wrap')) {
        enableCard(card);
    }
}

const disableCard = (card) => {

    card.removeEventListener('touchstart', move);
    card.removeEventListener('touchend', removeZoom);
    card.removeEventListener('touchcancel', removeZoom);
    card.removeEventListener('mousedown', move);
    card.removeEventListener('mouseup', removeZoom);
    card.removeEventListener('mouseleave', removeZoom);
} 

const disableCards = () => {

    for (let card of document.querySelectorAll('.card-wrap')) {
        disableCard(card);
    }
}

const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}

const getDeck = () => {

    let deck = [];
    let ranks = decks[Math.floor(Math.random() * decks.length)];
    let suits = ['♥','♠','♦','♣'];

    ranks.split('').forEach(rank => {

        rank = rank == 'X' ? '10' : rank;

        shuffle(suits);

        for (let suit of suits) {

            let card = rank + suit;

            if (!deck.includes(card)) {
                deck.push(card);
                break;
            }
        }
    });

    return deck;
}

const setCards = () => {

    let cards = document.querySelectorAll('.card-wrap');

    deck = getDeck();

    for (let i = 0; i < deckSize; i++) {

        let card = cards[i].querySelector('.front');
        let rank = deck[i].length == 2 ? deck[i][0] : deck[i][0] + deck[i][1];
        let suit = deck[i].length == 2 ? deck[i][1] : deck[i][2];
        let rankEl = card.querySelector('.rank');

        cards[i].classList.remove('hidden');

        rankEl.innerText = rank;

        suit == '♥' || suit == '♦' ? card.classList.add('red') : card.classList.remove('red');
        rank == '10' ? rankEl.classList.add('ten') : rankEl.classList.remove('ten');

        switch (suit) {
            case '♥':
                card.querySelector('.suit').firstElementChild.src = 'images/suits/heart.svg';
                card.querySelector('.main').firstElementChild.src = 'images/suits/heart.svg';
                break;
            case '♦':
                card.querySelector('.suit').firstElementChild.src = 'images/suits/diamond.svg';
                card.querySelector('.main').firstElementChild.src = 'images/suits/diamond.svg';
                break;
            case '♠':
                card.querySelector('.suit').firstElementChild.src = 'images/suits/spade.svg';
                card.querySelector('.main').firstElementChild.src = 'images/suits/spade.svg';
                break;
            case '♣':
                card.querySelector('.suit').firstElementChild.src = 'images/suits/club.svg';
                card.querySelector('.main').firstElementChild.src = 'images/suits/club.svg';
                break;
        }
    } 
}

const createCards = () => {

    let table = document.querySelector('.table');
    let template = document.querySelector('.card-template');

    for (let i = 0; i < deckSize; i++) {

        let card = template.content.cloneNode(true);
    
        table.appendChild(card);
    }
}

const disableTapZoom = () => {

    const preventDefault = (e) => e.preventDefault();

    document.addEventListener('touchstart', preventDefault, {passive: false});
    document.addEventListener('mousedown', preventDefault, {passive: false});
}

const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
}

const init = () => {

    registerServiceWorker();
    disableTapZoom();
    createCards();
    setTable();

    setTimeout(enableCards, 3700);    
}

window.onload = () => document.fonts.ready.then(init);