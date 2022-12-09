// Five letter nouns
const WORDLES = [
    "Adult", "Apple", "Block", "Blood", "Chair", "Dance", "Earth", "Field", "Group", "Horse",
    "Image", "Judge", "Light", "Match", "Night", "Owner", "Party", "Radio",
    "Scene", "Table", "Value", "World", "Youth"
]

// GAME STATE VARIABLES
let userGuesses
let wrongUserLetters          // not displayed but available
let lastLettersWrongPosition
let lastLettersRightPosition  // will perhaps be used in assignment 3 
let wordleWord                // right letter guesses of wordleWord shown here
let computerWord
let maximumNumberOfTurns      // add how many turns a player can guess

// PROMPT RESULT OPTIONS
const USER_HAS_WON = "user-has-won"
const SYNTAX_ERROR = "syntax-error"
const KEEP_PLAYING = "keep-playing"
const PLAY_AGAIN = "play-again"
const QUIT = "quit"
const WORD_HANDLED = "word-handled"

function initializeGame() {
    maximumNumberOfTurns = 6
    userGuesses = []
    wrongUserLetters = []
    lastLettersWrongPosition = []
    lastLettersRightPosition = ["_", "_", "_", "_", "_"]
    wordleWord = ["_", "_", "_", "_", "_"]

    computerWord = getComputerWord().toLowerCase()
}

function getComputerWord() {
    return WORDLES[Math.floor(Math.random() * WORDLES.length)]
}

function letterFrequency(word) {
    const frequency = []
    for (let i = 0; i < word.length; i++) {
        frequency.push(0)
        for (let j = 0; j < word.length; j++) {
            if (word[i] === word[j] && word[i] !== "_") {
                frequency[i] += 1
            }
        }
    }
    return frequency
}

function userSelection(userInput) {
    const pattern = /^[A-Z]{5}$/i
    userInput = userInput.toLowerCase().trim()
    
    if (userInput.match(pattern)) {
        userGuesses.push(userInput)
        const userHasWon = computerWord.includes(userInput.toLowerCase())
        if (userHasWon) {
            return USER_HAS_WON
        } else {
            lastLettersRightPosition = ["_", "_", "_", "_", "_"]
            lastLettersWrongPosition = []
            let index = 0
            for (let letter of userInput) {
                // if the letter exist in computerWord AND
                // the letter is in the right position
                if (computerWord.indexOf(letter, index) === userInput.indexOf(letter, index)) {
                    lastLettersRightPosition[computerWord.indexOf(letter, index)] = letter
                    wordleWord[computerWord.indexOf(letter, index)] = letter

                    // if the letters exist in computerWord
                    // but the letter is in wrong position
                } else if (computerWord.indexOf(letter) !== -1) {
                    lastLettersWrongPosition.push(letter)
                } else {
                    if (wrongUserLetters.indexOf(letter) === -1) {
                        wrongUserLetters.push(letter)
                    }
                }
                index++
            }
            // if all occurrences of a letter is shown in wordleWord, than erase them from lastLettersWrongPosition
            let freqWordleWord = letterFrequency(wordleWord)
            let freqComputerWord = letterFrequency(computerWord)
            const lastGuess = userGuesses[userGuesses.length-1];
            // console.log(wordleWord)
            // console.log(freqWordleWord)
            // console.log(freqComputerWord)
            for (let char of lastGuess) {
                if (freqWordleWord[wordleWord.indexOf(char)] === freqComputerWord[computerWord.indexOf(char)]) {
                    lastLettersWrongPosition = lastLettersWrongPosition.filter(letter => letter !== char)
                }
            }
        }
        return WORD_HANDLED

    } else {
        return SYNTAX_ERROR
    }
}


function handleCancelButton(userInput) {
    const quit = /^[Q]{1}$/i
    const playAgain = /^[Y]{1}$/i
    if (userInput === null || userInput.match(quit)) {
        return QUIT
    } else if (userInput.match(playAgain)) {
        return PLAY_AGAIN
    }
    return KEEP_PLAYING
}

function displayGame() {
    let text = `* * * * * * * * * * * * * * * * * * * * * * 
    GUESS THE WORD
* * * * * * * * * * * * * * * * * * * * * * `
    if (userGuesses.length === 0) {
        text += `
    Guess a five letter word. Only letters from a to z. \n
    Correct word:  ${wordleWord.join("  ")} \n`
    } else {
        text += `
    ${userGuesses.join(" - ")} \n 
    Last guess with letters in wrong place:  ${lastLettersWrongPosition.join(" ").toUpperCase()} 
    Correct word:  ${wordleWord.join("  ").toUpperCase()} \n`
    }
    text += `
    You have ${maximumNumberOfTurns - userGuesses.length} guesses to go.\n`

    return userInput = prompt(text)
}
function showResult(userHasWon) {
    let resultInfo = `    You made ${userGuesses.length} guesses \n
    Right word: ${computerWord.toUpperCase()} \n 
    Your guesses: ${userGuesses.join(" - ")}`
    let text = ""
    if (userHasWon) {
        text = `    * * * * * * * * * * * * * * * * * * * * * * 
        Hurray! You won!
    * * * * * * * * * * * * * * * * * * * * * * \n`
        text += resultInfo
    } else {
        text = `* * * * * * * * * * * * * * * * * * * * * * 
        Game Over!
* * * * * * * * * * * * * * * * * * * * * * \n`
        text += resultInfo
    }
    return alert(text)
}

function playWordle() {
    initializeGame()

    let userInput
    let result
    console.log("Correct word: " + computerWord)

    do {
        userInput = displayGame()

        // If player clicks CANCEL
        if (userInput === null) {
            userInput = prompt(`
    Do you want to continue? just click OK \n
    Do you want to start over? Write "Y" and click OK \n
    Do you want to quit? Write "Q" and click OK, 
    or just click CANCEL.\n
                `)
            result = handleCancelButton(userInput)
        }
        // If player clicks OK
        else {
            result = userSelection(userInput)
        }
        // console.log("result: " + result)

        if (result === QUIT || result === USER_HAS_WON || result === PLAY_AGAIN) {
            break;
        } else if (result === SYNTAX_ERROR) {
            alert("You have to write a 5 letter word between A-Z")
        } else if (result === KEEP_PLAYING) {
            // The cancel has been cancelled
        }
    } while (userGuesses.length < maximumNumberOfTurns)

    switch (result) {
        case QUIT:
            break
        case PLAY_AGAIN:
            playWordle()
            break
        case USER_HAS_WON:
        case WORD_HANDLED:
            const userHasWon = (result === USER_HAS_WON)
            showResult(userHasWon)
            if (confirm("Do you wish to play again?")) {
                playWordle()
            }
            break
    }
}

playWordle()
