//no move counter currently over-counting
//I believe this is due to each token going through each "if" statement instead of just one
//this should be fixed if I change them to else if statements

import { greyPathArr, whitePathArr } from './modules/playerPaths.js';

class Player {
    constructor(color) {
        this.color = color;
        this.score = 0;
        this.tokens = [];
        if (color === 'grey') {
            this.path = greyPathArr;
            this.opposite = 'white';
        } else {
            this.path = this.path = whitePathArr;
            this.opposite = 'grey';
        }

        for (let i = 1; i < 8; i++) {
            let token = document.querySelector(`#${this.color}_${i}`);
            this.tokens.push(token);
        }
    }
}

const playerGrey = new Player('grey');
const playerWhite = new Player('white');

const gameState = {
    currentPlayer: 1,
};

const dice = {
    diceVal1: 0,
    diceVal2: 0,
    rollVal: 0,
    canRoll: false,
    dieElement1: document.getElementById('die_1'),
    dieElement2: document.getElementById('die_2'),
    calcRollVal() {
        return this.diceVal1 + this.diceVal2;
    },
    updateUI() {
        this.dieElement1.innerHTML = this.diceVal1;
        this.dieElement2.innerHTML = this.diceVal2;
    },
};

var current_player = playerGrey;
var id = 'path_0';

var dice_box = document.getElementById('dice');
var roll_val;
var dice_rolled = false;
var currentPosIndex;
var newPosIndex = 0;
var newTile;
var rosetteIndices = [4, 8, 13];

//Event Listener callbacks

function highlightPossibleMove() {
    document.querySelector('.active_space')?.classList.remove('active_space');

    if (dice_rolled === true && current_player.tokens.includes(this)) {
        current_player.active_token = this;
        currentPosIndex = current_player.path.indexOf(this.parentElement);
        newPosIndex = currentPosIndex + roll_val;
        newTile = current_player.path[newPosIndex];
    } else return;
    // check for no moves, should be put in a new function
    const immoveableTokens = countMoveableTokens();

    if (immoveableTokens === 7) {
        console.log('switch turn due to no moves');
        changeTurn();
        return;
    }
    if (newTile.classList.contains(current_player.color + '_occupied')) {
        console.log('no move, space occupied');
        return;
    }
    if (newPosIndex < 15 && newPosIndex > 0) {
        newTile.classList.add('active_space');
    }
}

function countMoveableTokens() {
    let no_move_counter = 0;

    for (let i = 0; i < current_player.tokens.length; i++) {
        var newPosIndex_element =
            current_player.path[
                current_player.path.indexOf(
                    current_player.tokens[i].parentElement
                ) + roll_val
            ];

        if (current_player.tokens[i].parentElement === null) {
            no_move_counter += 1;
            console.log('scored-point-no-move:', no_move_counter);
        } else if (current_player.path.indexOf(newPosIndex_element) === -1) {
            no_move_counter += 1;
            console.log('no-path-no-move', no_move_counter);
        }
        //This is where the money is, this stuff is what we need
        else if (current_player.path.indexOf(newPosIndex_element) !== -1) {
            if (
                newPosIndex_element.classList.contains(
                    current_player.color + '_occupied'
                )
            ) {
                no_move_counter += 1;
                console.log('space-occupied-no-move:', no_move_counter);
            }
        }
        return no_move_counter;
    }
}

function move_active_token() {
    let el = current_player.path[newPosIndex];

    if (el !== event.target) return; // makes sure the player clicks on intended square

    // check if new position is occupied by opponent
    if (
        current_player.path[newPosIndex].classList.contains(
            current_player.opposite + '_occupied'
        )
    ) {
        console.log('capture');
        captureTile();
    }
    // move your token to the location
    document
        .querySelector('.active_space')
        .appendChild(current_player.active_token);

    current_player.path[newPosIndex].classList.remove('active_space');
    resetOccupationStatuses(newPosIndex, currentPosIndex);

    add_score();
    // check if player landed on a rosette
    if (rosetteIndices.includes(newPosIndex)) {
        console.log('rosette');
        newPosIndex = 0;
        dice_rolled = false;
        document.getElementById('roll_indicator').innerHTML = 'Roll Again!';
        document.getElementById('roll_indicator').classList.remove('invisible');
        // check if player has won
    } else {
        changeTurn();
    }
}

function captureTile() {
    // remove opponent token
    document
        .getElementById(current_player.opposite + '_path_0')
        .appendChild(current_player.path[newPosIndex].firstElementChild);

    current_player.path[newPosIndex].classList.remove(
        current_player.opposite + '_occupied'
    );
    // set tile's class you occupied by you
    current_player.path[newPosIndex].classList.add(
        current_player.color + '_occupied'
    );
}

function add_score() {
    if (newPosIndex === 14) {
        current_player.score++;
        document.getElementById(
            'player_' + current_player.color + '_score'
        ).innerHTML = current_player.score;

        function removeElement(elementId) {
            // Removes an element from the document
            var element = document.getElementById(elementId);
            element.parentNode.removeChild(element);
        }

        removeElement(current_player.active_token.id);
        console.log('scored!', current_player.score);
        if (current_player.score === 7) {
            end_game();
        }
    }
}

function changeTurn() {
    dice_rolled = false;
    newPosIndex = 0;
    if (current_player.color === 'grey') {
        current_player = playerWhite;
    } else if (current_player.color === 'white') {
        current_player = playerGrey;
    }
    setTurnIndicator();

    document.getElementById('roll_indicator').classList.remove('invisible');
}

function setTurnIndicator() {
    console.log();
    document
        .querySelector(`#active_player_${current_player.color}`)
        .classList.add('active_player');

    document
        .querySelector(`#active_player_${current_player.opposite}`)
        .classList.remove('active_player');
}

function resetOccupationStatuses(newPosIndex, currentPosIndex) {
    const occupationClass = current_player.color + '_occupied';
    current_player.path[newPosIndex].classList.add(occupationClass);
    current_player.path[currentPosIndex].classList.remove(occupationClass);
}

//Event Listener Initialization functions

function eventListenersInit() {
    for (let i = 0; i < playerGrey.tokens.length; i++) {
        playerGrey.tokens[i].addEventListener('click', highlightPossibleMove);
        playerWhite.tokens[i].addEventListener('click', highlightPossibleMove);
    }
    for (let i = 1; i < playerGrey.path.length; i++) {
        playerGrey.path[i].addEventListener('click', move_active_token);
        playerWhite.path[i].addEventListener('click', move_active_token);
    }
    dice_box.addEventListener('click', rollDice);
}

//Rolling variables and functions

function rollDice() {
    if (dice_rolled === false) {
        document.getElementById('roll_indicator').innerHTML = 'Roll!';
        dice.diceVal1 = Math.round(Math.random() * 2);
        dice.diceVal2 = Math.round(Math.random() * 2);

        roll_val = dice.calcRollVal();
        dice.updateUI();
        // console.log(dice.dieElement1);

        dice_rolled = true;
        if (roll_val === 0) {
            dice_rolled = false;
            changeTurn();
            // console.log(current_player);
            return;
        }
        document.getElementById('roll_indicator').classList.add('invisible');

        return roll_val;
    } else {
        console.log('no!');
    }
}

function end_game() {
    document.getElementById(
        'player_' + current_player.color + '_score'
    ).innerHTML = 'Winner!';
    dice_rolled = true;
    document.getElementById('die_1').innerHTML = ' ';
    document.getElementById('die_2').innerHTML = ' ';
    document.getElementById('roll_indicator').classList.remove('invisible');
    document.getElementById('roll_indicator').innerHTML = 'Game Over';
}

eventListenersInit();
setTurnIndicator();
