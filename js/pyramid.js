let cards = [];

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

const setCards = () => {

    for (let i = 0; i < 30; i++){

        let card = document.querySelectorAll(".card")[i];
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
    setCards();
}

window.onload = () => {
    document.fonts.ready.then(() => {
        setTimeout(() => {
            init();     
        }, 50);
    });
}


