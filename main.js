const pokemonName = document.querySelector("#pokemon");
const flavourTextP = document.querySelector("#flavour-text");
const attacksName = document.querySelector("#attacks");
const setNameP = document.querySelector("#set-name");
const stageP = document.querySelector("#stage");
const image = document.querySelector("#card-image");

const answer = document.querySelector("#answer");
const submitBtn = document.querySelector("#submit");

const attackHint = document.querySelector("#hint-attack");
const setHint = document.querySelector("#hint-set");
const stageHint = document.querySelector("#hint-stage");

let cardName = "";
let cardImage = "";

let maxPoints = 4;


//fetches all sets and picks a random card from a random set
async function getAllSets() {
    let setsList = localStorage.getItem('setsList');

    if (!setsList) {
        try {
            const response = await fetch(`https://api.pokemontcg.io/v2/sets`, {
                headers: {
                    'X-Api-Key': 'your-api-key'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setsList = data.data;
            
            //cache sets list in local storage to save on future calls to api
            localStorage.setItem('setsList', JSON.stringify(setsList));
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            return;
        }
    } else {
        //parse the cached sets list
        setsList = JSON.parse(setsList);
    }

    //picks a random set and get a card
    const randomIndex = Math.floor(Math.random() * setsList.length);
    const randomSet = setsList[randomIndex];

    getRandomCardFromSet(randomSet.id);
}

//get the set info and return the total number of cards in the set
async function getSetInfo(setID) {
    try {
        const response = await fetch(`https://api.pokemontcg.io/v2/sets/${setID}`, {
            headers: {
                'X-Api-Key': 'ff1156a3-f254-4651-8db2-f871be4588cd'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const totalCardsInSet = data.data.printedTotal;

        console.log("Total cards in set: ", totalCardsInSet);
        return totalCardsInSet;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

//generates a random card number
function getRandomCardNumber(totalCardsInSet) {
    return Math.floor(Math.random() * totalCardsInSet) + 1;
}

//fetch a card by set ID and card number
async function getCardFromSet(setID, cardNumber) {
    try {
        const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setID} number:${cardNumber}`, {
            headers: {
                'X-Api-Key': 'ff1156a3-f254-4651-8db2-f871be4588cd'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const card = data.data[0]; // Get the specific card
        return card;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

//main function to get a random Pokémon card from the set
async function getRandomCardFromSet(setID) {
    try {
        //get the total number of cards in the set
        const totalCardsInSet = await getSetInfo(setID);
        
        let card;
        do {
            //generate a random card number
            const randomCardNumber = getRandomCardNumber(totalCardsInSet);
            
            //fetch the data for the random card
            card = await getCardFromSet(setID, randomCardNumber);
            
            //repeat if the card's supertype isn't "Pokémon" or the card doesn't contain flavor text
        } while (card.supertype !== "Pokémon" || !card.flavorText);

        displayCard(card);
        
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

//displays the random card's details
function displayCard(card) {
    cardName = card.name;
    const flavorText = card.flavorText;
    const attacks = card.attacks;
    const setName = card.set.name;
    const stage = card.subtypes;
    cardImage = card.images.small;

    const randomNum = Math.floor(Math.random() * attacks.length);
    const randomAttack = attacks[randomNum].name;
    console.log(randomAttack);
    flavourTextP.innerHTML = flavorText;
    attacksName.innerHTML = randomAttack;
    setNameP.innerHTML = setName;
    stageP.innerHTML = stage;
};

//shows the attack name hint and deducts a point from max points
function useAttackHint() {
    maxPoints --;
    console.log(maxPoints);
    attacksName.classList.add("show");
};

//shows the set name hint and deducts a point from max points
function useSetHint() {
    maxPoints --;
    console.log(maxPoints);
    setNameP.classList.add("show");
};

//shows the pokmeon stage hint and deducts a point from max points
function useStageHint() {
    maxPoints --;
    console.log(maxPoints);
    stageP.classList.add("show");
};

attackHint.addEventListener("click", useAttackHint);
setHint.addEventListener("click", useSetHint);
stageHint.addEventListener("click", useStageHint);

//checks the answer inputed by the user with the card name. If the answer is right then it will also tell the user how many points they got
function checkAnswer() {
    const response = answer.value;
    if(response.toLowerCase() === cardName.toLowerCase()) {
        console.log(`you win! You scored ${maxPoints} points`);
        pokemonName.innerHTML = cardName;
        image.setAttribute("src", cardImage);
    } else {
        console.log(`Sorry the correct answer was ${cardName}`);
    }
}

submitBtn.addEventListener("click", checkAnswer);

// getAllSets();


