console.log('loaded!');

//variables
const STARTING_TIME = 30;
var gameOver = false;
var remainingTime = 0;
var delayHandle = null;
var timerHandle = null;

var wiresToCut = [];
var wiresCut = {
    blue: false,
    green: false,
    red: false,
    white: false,
    yellow: false
}

//DOM References
var timerText;
var startButton;
var resetButton;
var blue;
var green;
var red;
var white;
var yellow;
var wireBox;

//eventListeners
document.addEventListener('DOMContentLoaded', function(e) {
    timerText = document.getElementById("timertext");
    startButton = document.getElementById("start");
    resetButton = document.getElementById("reset");
    blue = document.getElementById("blue");
    green = document.getElementById("green");
    red = document.getElementById("red");
    white = document.getElementById("white");
    yellow = document.getElementById("yellow");
    wireBox = document.getElementById("wirebox")

    startButton.addEventListener("click", function(e) {
        console.log("clicked start");
        timerHandle = setInterval(updateClock, 1000);
    });
    resetButton.addEventListener("click", function(e) {
        console.log("clicked reset");
        reset();
    });
    wireBox.addEventListener('click', function(e) {
        if (!wiresCut[e.target.id] && !gameOver) {
            //change the image
            e.target.src = "img/cut-"+ e.target.id + "-wire.png";
            //mark it as cut
            wiresCut[e.target.id] = true;
            //was it correct?
            var wireIndex = wiresToCut.indexOf(e.target.id)
            if (wireIndex > -1) {
            //correct
            console.log(e.target.id + "was correct");
            wiresToCut.splice(wireIndex, 1);
            //here we will check for a win
            if (checkForWin()) {
                endGame(true);
            }
        } else {
            //incorrect
            console.log(e.target.id + "was incorrect");
            delayHandle = setTimeout(function() {
                // end the game with a loss
                console.log("Bang!");
                endGame(false);
            }, 750);
        }
    }
        
})
})

//functions

function checkForWin() {
    return wiresToCut.length ? false : true;
}

function endGame(win) {
    //clear the timers
    clearTimeout(delayHandle);
    clearInterval(timerHandle);
    //change the game to over
    gameover = true;
    //enable the reset button
    resetButton.diabled = false;
    if (win) {
        //win condition
        console.log("You saved the City");
        timerText.classList.remove("red");
        timerText.classList.add("green");
    } else {
        //lose condition
        console.log("BOOM!");
        document.body.classList.remove("unexploded");
        document.body.classList.add("exploded");
    }
}

function updateClock() {
    remainingTime--;
    if (remainingTime <= 0) {
        console.log("time loss");
        endGame(false);
    }
    timerText.textContent = "0:00" + remainingTime;
}

function initGame() {
    wiresToCut.length = 0;
    remainingTime = STARTING_TIME;
    for(let wire in wiresCut) {
        var rand = Math.random();
        if(rand > 0.5) {
            wiresToCut.push(wire);
        }
    }
    resetButton.diabled = true;
    startButton.diabled = false; 
}

function reset() {
    gameOver = false;
    var wireImages = wireBox.children;
    for (let i = 0; i < wireImages.length; i++) {
        wireImages[i].src = "img/uncut-" + wireImages[i].id +"-wire.png";
    }
    document.body.classList.add("unexploded");
    document.body.classList.remove("exploded");
    timerText.classList.remove("green");
    timerText.classList.add("red");
    clearTimeout(delayHandle);
    clearInterval(timerHandle);
    for (let wire in wiresCut) {
        wiresCut[wire] = false;
    }
    initGame();
}