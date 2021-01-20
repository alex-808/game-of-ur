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

console.log(playerGrey);

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

var new_position = 0;
var current_player = playerGrey;
var id = 'path_0';
var score = parseInt(
    document.getElementById('player_' + current_player.color + '_score')
        .innerHTML
);
var dice_box = document.getElementById('dice');
var roll_val;
var dice_rolled = false;
var oldPos;

//Event Listener callbacks

function set_active_token() {
    if (dice_rolled === true && current_player.tokens.includes(this)) {
        current_player.active_token = this;
        oldPos = this.parentElement;

        // check for no moves, should be put in a new function
        let no_move_counter = 0;

        for (let i = 0; i < current_player.tokens.length; i++) {
            var new_position_element =
                current_player.path[
                    current_player.path.indexOf(
                        current_player.tokens[i].parentElement
                    ) + roll_val
                ];

            if (current_player.tokens[i].parentElement === null) {
                no_move_counter += 1;
                console.log('scored-point-no-move:', no_move_counter);
            } else if (
                current_player.path.indexOf(new_position_element) === -1
            ) {
                no_move_counter += 1;
                console.log('no-path-no-move', no_move_counter);
            }
            //This is where the money is, this stuff is what we need
            else if (current_player.path.indexOf(new_position_element) !== -1) {
                if (
                    new_position_element.classList.contains(
                        current_player.color + '_occupied'
                    )
                ) {
                    no_move_counter += 1;
                    console.log('space-occupied-no-move:', no_move_counter);
                }
            }
            //console.log(no_move_counter);
        }
        console.log(no_move_counter);

        if (no_move_counter === 7) {
            console.log('switch turn due to no moves');
            new_position = 0;

            changeTurn();

            dice_rolled = false;
            return;
        }

        if (
            current_player.path.indexOf(
                current_player.active_token.parentElement
            ) +
                roll_val <
                15 &&
            current_player.path.indexOf(
                current_player.active_token.parentElement
            ) +
                roll_val >
                0
        ) {
            current_player.path[new_position].classList.remove('active_space');

            new_position =
                current_player.path.indexOf(
                    current_player.active_token.parentElement
                ) + roll_val;

            if (
                current_player.path[new_position].classList.contains(
                    current_player.color + '_occupied'
                )
            ) {
                console.log('no move');
            }
            current_player.path[new_position].classList.add('active_space');
        } else {
            console.log('no move');
        }
    } else {
        console.log('no move');
    }
}

function move_active_token() {
    let el = current_player.path[new_position];

    if (el !== event.target) return; // makes sure the player clicks on intended square

    if (new_position < 5 || new_position > 11) {
        id = current_player.color + '_path_' + new_position;
    } else {
        //console.log("5-11");
        id = 'path_' + new_position;
    }
    // check if new position is occupied by you
    if (
        current_player.path[new_position].classList.contains(
            current_player.color + '_occupied'
        )
    ) {
        console.log('no move');
    } else {
        // check if new position is occupied by opponent
        if (
            current_player.path[new_position].classList.contains(
                current_player.opposite + '_occupied'
            )
        ) {
            console.log('capture');
            // remove opponent token
            document
                .getElementById(current_player.opposite + '_path_0')
                .appendChild(
                    current_player.path[new_position].firstElementChild
                );

            current_player.path[new_position].classList.remove(
                current_player.opposite + '_occupied'
            );
            // set tile's class you occupied by you
            current_player.path[new_position].classList.add(
                current_player.color + '_occupied'
            );
        }
        // move your token to the location
        document.getElementById(id).appendChild(current_player.active_token);

        current_player.path[new_position].classList.remove('active_space');
        resetOccupationStatuses(current_player.path[new_position], oldPos);

        add_score();
        // check if player landed on a rosette
        if (new_position === 4 || new_position === 8 || new_position === 13) {
            console.log('rosette');
            new_position = 0;
            dice_rolled = false;
            document.getElementById('roll_indicator').innerHTML = 'Roll Again!';
            document
                .getElementById('roll_indicator')
                .classList.remove('invisible');
            // check if player has won
        } else if (current_player.score === 7) {
            end_game();
            // reset new position value
            // this needs to be fixed, we are adding event listeners every turn change
        } else {
            new_position = 0;

            changeTurn();
            dice_rolled = false;
        }
    }
}

function add_score() {
    if (new_position === 14) {
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
            document.getElementById(
                'player_' + current_player.color + '_score'
            ).innerHTML = 'Winner!';
        }
    }
}

function changeTurn() {
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
        .querySelector('#active_player_' + current_player.opposite)
        .classList.remove('active_player');
}

function resetOccupationStatuses(newPos, oldPos) {
    const occupationClass = current_player.color + '_occupied';
    newPos.classList.add(occupationClass);
    oldPos.classList.remove(occupationClass);
}

//Event Listener Initialization functions

function tokenInit() {
    for (let i = 0; i < playerGrey.tokens.length; i++) {
        playerGrey.tokens[i].addEventListener('click', set_active_token);
        playerWhite.tokens[i].addEventListener('click', set_active_token);
    }
}

function pathInit() {
    for (let i = 1; i < playerGrey.path.length; i++) {
        playerGrey.path[i].addEventListener('click', move_active_token);
        playerWhite.path[i].addEventListener('click', move_active_token);
    }
}

function diceBoxInit() {
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
    dice_rolled = true;
    document.getElementById('die_1').innerHTML = ' ';
    document.getElementById('die_2').innerHTML = ' ';
    document.getElementById('roll_indicator').classList.remove('invisible');
    document.getElementById('roll_indicator').innerHTML = 'Game Over';
}

tokenInit();
pathInit();
diceBoxInit();

setTurnIndicator();
