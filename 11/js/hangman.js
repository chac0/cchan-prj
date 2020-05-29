

//VARIABLES
// Creating an array of available letters
var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 
                'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 
                'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

var words = [{ word: "snake", hint: "It's a reptile" }, 
             { word: "monkey", hint: "It's a mammal" }, 
             { word: "beetle", hint: "It's an insect" }];

var selectedWord = "";
var selectedHint = "";
var board = []; // empty array
var remainingGuesses = 6;

//LISTENERS

// Begin the game when the page is fully loaded
window.onload = startGame();

// Do something when clicking on each letter
$("#letters").on("click", ".letter", function(){
    checkLetter($(this).attr("id"));
    disableButton($(this));
});

// Reload page when clicking on the replay button
$(".replayBtn").on("click", function() {
    location.reload();
});


//FUNCTIONS

// Kicks off the game
function startGame() {
    // Appending the letter buttons
    pickWord();
    createLetters();
    
    // Fill up the current guess word with underscores and set the board
    initBoard();
    updateBoard();
}

// Selects a word randomly from the array of available words
function pickWord() {
    let randInt = Math.floor(Math.random() * words.length);
    selectedWord = words[randInt].word.toUpperCase();
    selectedHint = words[randInt].hint;
}

// Creates the letters inside the letters div
function createLetters() {
    for (var letter of alphabet) {
        let letterInput = '"' + letter + '"';
        $("#letters").append("<button class='btn btn-success letter' id='" + letter + "'>" + letter + "</button>");
    }
}

// Fill the board with underscores
function initBoard() {
    // for (var letter in selectedWord) {
    //     board += '_';
    // }
    
    for (var letter in selectedWord) {
        board.push("_");
    }
    
}


// Update the display board
function updateBoard() {
    $("#word").empty();
    
    // for (var letter of board) {
    //     $("#word").append(letter);
    //     $("#word").append(' ');
    // }
    
    for (var i=0; i < board.length; i++) {
        $("#word").append(board[i] + " ");
    }
    
    $("#word").append("<br />");
    $("#word").append("<span class='hint'><input type='checkbox' id='label1'><label for='label1'>Hint: </label><div class='hidden_show'><p>" + selectedHint + "</p></div></span>");
    
}


// Update the current word then calls for a board update
function updateWord(positions, letter) {
    for (var pos of positions) {
        //board = replaceAt(board, pos, letter)
        board[pos] = letter;
    }
    
    updateBoard(board);
    
    // Check to see if this is a winning guess
    if (!board.includes('_')) {
        endGame(true);
    }
}


// Checks to see if the selected letter exists in the selectedWord
function checkLetter(letter) {
    var positions = new Array();
    
    // Put all the positions the letter exists in an array
    for (var i = 0; i < selectedWord.length; i++) {
        if (letter == selectedWord[i]) {
            positions.push(i);
        }
    }
    
    // Update the game state
    if (positions.length > 0) {
        updateWord(positions, letter);
    } else {
        remainingGuesses -= 1;
        updateMan();
        
        if (remainingGuesses <= 0) {
            endGame(false);
        }
    }
}


// Calculates and updates the image for our stick man
function updateMan() {
    $("#hangImg").attr("src", "img/stick_" + (6 - remainingGuesses) + ".png");
}


// Ends the game by hiding game divs and displaying the win or loss divs
function endGame(win) {
    $("#letters").hide();
    
    if (win) {
        $('#won').show();
    } else {
        $('#lost').show();
    }
}


// Disables the button and changes the style to tell the user it's disabled
function disableButton(btn) {
    btn.prop("disabled",true);
    btn.attr("class", "btn btn-danger")
}


// Helper function for replacing specific indexes in a string
// function replaceAt(str, index, value) {
//     return str.substr(0, index) + value + str.substr(index + value.length);
// }