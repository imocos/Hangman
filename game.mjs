import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

async function askQuestion(question) {
    return await rl.question(question);
}



import { ANSI } from './ansi.mjs';
import { HANGMAN_UI } from './graphics.mjs';

const WORDS_TO_GUESS = ["apple", "banana", "chocolate", "dinosaur", "elephant", "flamingo", "giraffe", "hamburger",
    "internet", "jacket", "kangaroo", "laptop", "mountain", "notebook", "ocean", "penguin", "quarantine", "rainbow",
    "sunshine", "tiger", "umbrella", "volcano", "watermelon", "xylophone", "yogurt", "zebra", "airplane", "bicycle",
    "cactus", "dolphin", "eclipse", "fireworks", "garden", "honey", "island", "jungle", "koala", "lightning", "monkey",
    "nightmare", "octopus", "pumpkin", "quicksand", "robot", "snowflake", "tornado", "unicorn", "vampire", "whale", "xenon",
    "yellow", "zodiac", "avocado", "balloon", "camel", "dragonfly", "espresso", "feather", "galaxy", "hippopotamus",
    "igloo", "jellyfish", "kiwi", "lemonade", "mojito", "narwhal", "oasis", "peacock", "quartz", "rhinoceros", "sapphire",
    "turtle", "utopia", "velvet", "windmill", "stingray", "yacht", "zeppelin", "accordion", "butterfly", "crystal", "dandelion",
    "escalator", "fossil", "grapefruit", "hedgehog", "iguana", "jukebox", "koala", "lantern", "mystery", "nebula", "orchid",
    "parrot", "quiver", "rocket", "scorpion", "treasure"]
const PLAYER_CHOICE = {
    PICK_A_CHAR: "Guess the character or the word: ",
    WINNER_TEXT: "Congratulations, winner, winner, chicken dinner! ",
    LOSER_TEXT: "Game over, you died.",
    PLAY_AGAIN: "Do you wish to play again? (yes/no)",
    CORRECT_WORD_WAS: "The correct word was: ",
    GUESSES_TOTAL: "Total guesses made: ",
    PLAYS_TOTAL: "Total games played: ",
    ALREADY_GUESSED: "You already guessed that letter. "
}
let correctWord = "";
let numberOfCharInWord = 0;
let guessedWord = "".padStart(correctWord.length, "_"); 
let wordDisplay = "";
let isGameOver = false;
let wasGuessCorrect = false;
let wrongGuesses = [];

let numberOfGuesses = 0;
let totalGamesPlayed = 0; 

await hangmanGameStart();

function drawWordDisplay() {

    wordDisplay = "";

    for (let i = 0; i < numberOfCharInWord; i++) {
        if (guessedWord[i] != "_") {
            wordDisplay += ANSI.COLOR.GREEN;
        }
        wordDisplay = wordDisplay + guessedWord[i] + " ";
        wordDisplay += ANSI.RESET;
    }

    return wordDisplay;
}


async function hangmanGameStart(){
    let playerWishToPlay = "";
    do{
        correctWord = WORDS_TO_GUESS[Math.floor(Math.random() * WORDS_TO_GUESS.length)].toLowerCase();
        numberOfCharInWord = correctWord.length;
        guessedWord = "".padStart(correctWord.length, "_");
        wordDisplay = "";
        isGameOver = false
        wasGuessCorrect = false;
        wrongGuesses = [];
        await theGameItself();
        totalGamesPlayed++  
        playerWishToPlay = (await askQuestion(PLAYER_CHOICE.PLAY_AGAIN)).toLowerCase();
    } while(playerWishToPlay == "yes")
    }
function drawList(list, color) {
    let output = color;
    for (let i = 0; i < list.length; i++) {
        output += list[i] + " ";
    }

    return output + ANSI.RESET;
}



async function theGameItself(){

while (isGameOver == false) {

    console.log(ANSI.CLEAR_SCREEN);
    console.log(drawWordDisplay());
    console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
    console.log(HANGMAN_UI[wrongGuesses.length]);

    const answer = (await askQuestion(PLAYER_CHOICE.PICK_A_CHAR)).toLowerCase();
    numberOfGuesses++ 

    if (answer == correctWord) {
        isGameOver = true;
        wasGuessCorrect = true;
    } else if (ifPlayerGuessedLetter(answer)) {
        if (wrongGuesses.includes(answer)){
         console.log(PLAYER_CHOICE.ALREADY_GUESSED); //If we are to work on this assignment again in the future, I want to make this part work as well

        } else {

            let org = guessedWord;
            guessedWord = "";
    
            let isCorrect = false;
            for (let i = 0; i < correctWord.length; i++) {
                if (correctWord[i] == answer) {
                    guessedWord += answer;
                    isCorrect = true;
                } else {
            
                    guessedWord += org[i];
                }
            }
    
            if (isCorrect == false) {
                wrongGuesses.push(answer);
            
            } else if (guessedWord == correctWord) {
                isGameOver = true;
                wasGuessCorrect = true;
            }

        }
        
    }

    if (wrongGuesses.length == HANGMAN_UI.length) {
        isGameOver = true;
        console.log(PLAYER_CHOICE.CORRECT_WORD_WAS + correctWord)
        console.log(HANGMAN_UI[11])
    }

}

if (wasGuessCorrect) {
    console.log(ANSI.COLOR.YELLOW + PLAYER_CHOICE.WINNER_TEXT);
    console.log(PLAYER_CHOICE.CORRECT_WORD_WAS + correctWord);
} else {

    console.log(PLAYER_CHOICE.LOSER_TEXT);

}
}



console.log(ANSI.CLEAR_SCREEN);
console.log(drawWordDisplay());
console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
console.log(HANGMAN_UI[wrongGuesses.length]);
console.log(PLAYER_CHOICE.PLAYS_TOTAL + totalGamesPlayed);
console.log(PLAYER_CHOICE.GUESSES_TOTAL + numberOfGuesses);


process.exit();




function ifPlayerGuessedLetter(answer) {
    return answer.length == 1
}




