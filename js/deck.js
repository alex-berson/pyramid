// const pyramidSize = 28;
// const deckSize = 52;

let pyramid = deck = origDeck = stock = freeCards = pile = [];

const card = (i) => deck[i];

const deleteCard = (i) => deck[i] = 0;

const printPyramid = () => {

    for (let i = 0; i < 7; i++) {

        let row = "";

        for (let j = 0; j < i + 1; j++) {

            if (card(pyramid[i][j]) < 10) {
                row = row + card(pyramid[i][j])  + "  ";
            } else {
                row = row + card(pyramid[i][j])  + " ";

            }
        }

        console.log(row);
    }
}

const position = (i) => {

    if (i > 27) return [undefined, undefined];

    let row = Math.floor((-1 + Math.sqrt(1 + 8 * i)) / 2);
    
    let column = i - (row + 1) * row / 2;

    return [row, column];
}

// const shuffle = (array) => {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]] 
//     }
// }

const akq = () => {

    let changes = 0;

    for (let i = 0; i < deck.length; i++) {
        if (deck[i] == 1) {

            [deck[0], deck[i]] = [deck[i], deck[0]];
        }

        if (deck[i] == 13) {

            [deck[1], deck[i]] = [deck[i], deck[1]];
        }

        if (deck[i] == 12) {

            [deck[2], deck[i]] = [deck[i], deck[2]];
        }
    }
}

const setDeck = () => {

    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

    const suits = ['♥','♠','♦','♣'];
;
    deck = Array.from({length: 13}, (_, i) => i+1);

    deck = deck.concat(deck).concat(deck).concat(deck);

    shuffle(deck);


    origDeck = [...deck];


    // console.log("deck: ", deck);
}

const setPyramid = () => {

    pyramid = [...Array(7)].map(_ => Array(7).fill(0));

    // const resetBoard = () => board = Array.from(Array(numberOfRows), _ => Array(numberOfColumns).fill(0));


    for (i = 0; i < pyramidSize; i++) {

        let [row, column] = position(i);
        
        pyramid[row][column] = i;
    }

    // console.log("pyramid: ");

    // printPyramid();
}


const setStock = () => {
    
    // stock = deck.slice(pyramidSize);

    stock = Array.from({length: 23}, (_, i) => i+28);

    pile = [];


    // console.log("stock: ", stock.map(e => deck[e]));
}

const setPile = () => {        

    pile = [deckSize - 1];

}

const getFreeCards = () => {

    freeCards = [];

    for (let i = 0; i < pyramidSize; i++) {

        row = Math.floor((-1 + Math.sqrt(1 + 8 * i)) / 2);
    
        column = i - (row + 1) * row / 2 
    
        if (!card(pyramid[row][column])) continue;
        
        if (row + 1 >= pyramid.length) {freeCards.push(i); continue}

        if (!card(pyramid[row + 1][column]) && !card(pyramid[row + 1][column + 1])) freeCards.push(i);
    }
    
    if (pile.length > 0) {
            freeCards.push(pile[pile.length - 1]);
    }

    shuffle(freeCards);

    // console.log("freeCards: ", freeCards.map(e => deck[e]));
}

const checkThirteens = () => {

    for (let i = 0; i < freeCards.length; i++) {

        if (card(freeCards[i]) == 13) {

            // [row, column] = position(freeCards[i]);  

            // console.log(card(freeCards[i]));

            deleteCard(freeCards[i]);

            if (freeCards[i] > 27) pile.pop(); 

            // console.log("pyramid: ");

            // printPyramid();

            return true;
        }
    }

    for (let i = 0; i < freeCards.length - 1; i++) {

        for (let j = i; j < freeCards.length - 1; j++) {

            if (card(freeCards[i]) + card(freeCards[j + 1]) == 13) {


                // console.log(card(freeCards[i]), " + ",  card(freeCards[j + 1]));

                // [row, column] = position(freeCards[i]);  
                deleteCard(freeCards[i]);
                if (freeCards[i] > 27) pile.pop();  

                // [row, column] = position(freeCards[j +1]);   
                deleteCard(freeCards[j + 1]);
                if (freeCards[j + 1] > 27) pile.pop();  

                // console.log("pyramid: ");

                // printPyramid();

                return true;
            } 
        }
    }

    return false;
}

const cleanPyrapid = () => {

    for (let i = 0; i < deckSize; i++) {
        if (deck[i] != 0) return false;
    }

    // if (pile.length == 0) return true;

    return true;

}

playDeal = () => {

        do {
            do{
    
                getFreeCards();
                
                if (!checkThirteens()) break;
    
                // printPyramid();
    
            
            }while(true);
        
            // stock.shift();

            stock.pop();


        
            // pile.push(deckSize - stock.length - 1);

            pile.push(pyramidSize + stock.length);
    
    
            // printPyramid();
            // console.log("pile: ", pile.map(e => deck[e]));
            // console.log("stock: ", stock.map(e => deck[e]));
    
        }while(stock.length > 0);

        do{
    
            getFreeCards();
            
            if (!checkThirteens()) break;

            // printPyramid();

        
        }while(true);


        // console.log(deck);

}

const playWin = () => {

    let pileLength  = Infinity;

    let tries = 0;

    do{
        tries++; 
    
        setDeck();
    
        setPyramid();
    
        setStock();

        setPile();
    
        playDeal();
    
        // if (tries / 10000 == Math.floor (tries / 10000 )) console.log (tries);
    
        if (pile.length < pileLength) {
    
            pileLength = pile.length;
    
            // console.log("LENGTH: ", pile.length); //
    
        }
    
        if (pile.length == 0) {
            // console.log("DECK: ", origDeck);
            // console.log("PILE: ", pile.map(e => deck[e]));
        }
    
    
    }while(!cleanPyrapid());

    // console.log("TRIES: ", tries);
    // console.log("PILE: ", pile);
    // console.log("STOCK: ", stock);

    // console.log("DECK: ", origDeck);


    // console.log(tries);

    return tries;

}

const chances = () => {

    let totalTries = 0;

    for (let i = 0; i < 100; i++) {

        let tries = 0;
    
        do{
    
            tries++; 
        
            deck = [...origDeck];
        
            setPyramid();
        
            setStock();

            setPile();
        
            playDeal();
        
        }while(!cleanPyrapid());

        totalTries += tries;
    
        // console.log(tries);
    }

    // console.log("CHANCES: ", 100 / totalTries);

    return 100 / totalTries;

}


// if (pile.length == 0) {
//     console.log("ORIG DECK: ", origDeck);
//     console.log("DECK: ", deck);
//     console.log("PILE: ", pile.map(e => deck[e]));
//     console.log("STOCK: ", stock);
// }


const winDeck = (startTime) => {

    let tries = 0;

    while(true){
        
        tries += playWin();

        if (chances() == 1) break;

    }

    console.log("ITERATION: ", i);

    console.log("TIME: ", (new Date() - startTime) / 1000);


    console.log("DECK: ", origDeck);

    console.log("TOTAL TRIES: ", tries);

    return origDeck;

}

const winDecks = () => {

    console.log("===================================================================")

    let iterations = 100;

    let totalTries = 0

    let startTime = new Date();



    for (let i = 0; i < iterations; i++) {

        let tries = 0;


        sureWin(startTime);

        // while(true){
            
        //     tries += playWin();

        //     if (chances() == 1) break;


        // }

        // console.log("ITERATION: ", i);

        // console.log("TIME: ", (new Date() - startTime) / 1000);


        // console.log("DECK: ", origDeck);

        // console.log("TOTAL TRIES: ", tries);


        totalTries += tries;


    }

    console.log("AVERAGE TRIES: ", totalTries / iterations);
}

// playWin();
// chances();

// winDecks();

// sureWin();


