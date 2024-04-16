//** 1 - Deposit money 
//** 2 - Determine number of lines to bet on 
//** 3 - Collect a bet amount 
//** 4 - Spin slot machine 
//** 5 - Check if the user has won
//** 6 - Give user their winnings
//** 7 - Play again

const prompt = require("prompt-sync")();

// sets up the rows and columns for the slot machine, 3 rows and 3 columns with varying rarity of symbols on each, and varying values of each symbols. Rarer symbol = Higher value.

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 3,
    "B": 4,
    "C": 6,
    "D": 8,
}

const SYMBOLS_VALUES = {
    "A": 10,
    "B": 4,
    "C": 3,
    "D": 2,

}




// Function to deposit money. Must be a number, otherwise invalid
const depositMoney = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ")
        const numberDepositAmount = parseFloat(depositAmount);

        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
        console.log("Invalid deposit amount, please try again!");
        } else {
        return numberDepositAmount;
        }
    }  
};

// function to ask user how many lines they would like to play between 1 and 3 lines. if a user picks more or less it will log in invalid message
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter number of lines to play! (1-3): ")
        const numberOfLines = parseFloat(lines);

        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
        console.log("Invalid lines, please try again!");
        } else {
        return numberOfLines;
        }
    }  
};
// Function to enter the users bet PER line. Must have enough balance to fill the requested bet with each line. Ex. $1 per line, playing 3 lines = $3
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter bet per line: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
        console.log("Invalid bet! please try again!");
        } else {
        return numberBet;
        }
    } 

}

// function to set up the symbols and randomly generates on each reel
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
    for (let i = 0; i < count; i++) {
        symbols.push(symbol);
        }
    }

    const reels = []
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};
// reels needed to be transposed in order to match up to a real slot machine

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i])
        }
    }

    return rows;
};

const printRows = (rows) => {
    for (const row of rows){
        let rowString = "";
        for (const [i, symbol] of row.entries()){
            rowString += symbol
            if (i != row.length -1) {
                rowString += " | "
            }
        }
        console.log(rowString)
    }
}
// Function for a users winnings based on the bet sizes and amount of lines played, * the symbols value
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame= true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }
    return winnings;
};

// calling the functions in their order
const game = () => {
    let balance = depositMoney();

    while (true) {
        console.log("You have a balance of $" + balance + "!");
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines)
        balance += winnings;
        console.log("Congrats! You won... $" + winnings.toString() + "!");

        if (balance <= 0) {
            console.log("You got no cash!");
            break;
        }
        const playAgain = prompt("Do you want to play again (y/n)?");

        if (playAgain != "y") break;
    }
};

game();



