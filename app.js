import { greyPathArr, whitePathArr } from './modules/playerPaths.js';

class Player {
    constructor(color) {
        this.color = color;
        this.score = 0;
        this.tokens = [];
        if (color === 'grey') {
            this.path = greyPathArr;
            this.opponent = 'white';
        } else {
            this.path = this.path = whitePathArr;
            this.opponent = 'grey';
        }

        for (let i = 1; i < 8; i++) {
            let token = document.querySelector(`#${this.color}_${i}`);
            this.tokens.push(token);
        }
    }
}

const playerGrey = new Player('grey');
const playerWhite = new Player('white');

const dice = {
    domEl: document.getElementById('dice'),
    diceVal1: 0,
    diceVal2: 0,
    rollVal: 0,
    rolled: false,
    dieElement1: document.getElementById('die_1'),
    dieElement2: document.getElementById('die_2'),
    calcRollVal() {
        this.diceVal1 = Math.round(Math.random() * 2);
        this.diceVal2 = Math.round(Math.random() * 2);
        return this.diceVal1 + this.diceVal2;
    },
    updateUI() {
        this.dieElement1.innerHTML = this.diceVal1;
        this.dieElement2.innerHTML = this.diceVal2;
    },
};
let current_player = playerGrey;
let currentPosIndex;
let newPosIndex = 0;
let newTile;
let rosetteIndices = [4, 8, 13];

//Event Listener callbacks

function highlightPossibleMove() {
    if (dice.rolled === true && current_player.tokens.includes(this)) {
        document
            .querySelector('.active_space')
            ?.classList.remove('active_space');

        current_player.active_token = this;
        currentPosIndex = current_player.path.indexOf(this.parentElement);
        newPosIndex = currentPosIndex + dice.rollVal;
        newTile = current_player.path[newPosIndex];
    } else return;
    // check for no moves, should be put in a new function

    if (newTile.classList.contains(current_player.color + '_occupied')) {
        console.log('no move, space occupied');
        return;
    }
    if (newPosIndex < 15 && newPosIndex > 0) {
        newTile.classList.add('active_space');
    }
}

function countImmoveableTokens() {
    let no_move_counter = 0;

    for (let i = 0; i < current_player.tokens.length; i++) {
        let newPosIndex_element =
            current_player.path[
                current_player.path.indexOf(
                    current_player.tokens[i].parentElement
                ) + dice.rollVal
            ];
        // check if token has been removed
        if (current_player.tokens[i].parentElement === null) {
            no_move_counter += 1;
            // check if path of new index exists
        } else if (current_player.path.indexOf(newPosIndex_element) === -1) {
            no_move_counter += 1;
        }
        //check if path of new index is already occuped
        else if (
            newPosIndex_element.classList.contains(
                current_player.color + '_occupied'
            )
        ) {
            no_move_counter += 1;
        }
    }
    console.log(no_move_counter);
    return no_move_counter;
}

function moveToTile() {
    let el = current_player.path[newPosIndex];
    if (el !== event.target && event.target.parentElement !== el) {
        console.log('not event target');
        return; // makes sure the player clicks on intended square
    }
    // check if new position is occupied by opponent
    if (
        current_player.path[newPosIndex].classList.contains(
            current_player.opponent + '_occupied'
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
    addScore();
    document.querySelector('.dice-imgs').classList.add('invisible');
    // check if player landed on a rosette
    if (rosetteIndices.includes(newPosIndex)) {
        console.log('rosette');
        allowReroll();
    } else {
        changeTurn();
    }
}

function allowReroll() {
    newPosIndex = 0;
    dice.rolled = false;
    document.querySelector('.roll-text').innerHTML = 'Roll Again!';
    document.querySelector('.roll-text').classList.remove('invisible');
}

function captureTile() {
    // remove opponent token
    document
        .getElementById(current_player.opponent + '_path_0')
        .appendChild(current_player.path[newPosIndex].firstElementChild);

    current_player.path[newPosIndex].classList.remove(
        current_player.opponent + '_occupied'
    );
    // set tile's class you occupied by you
    current_player.path[newPosIndex].classList.add(
        current_player.color + '_occupied'
    );
}

function addScore() {
    if (newPosIndex === 14) {
        current_player.score++;
        document.getElementById(
            'player_' + current_player.color + '_score'
        ).innerHTML = current_player.score;
        current_player.path[newPosIndex].classList.remove(
            `${current_player.color}_occupied`
        );

        removeElement(current_player.active_token.id);
        if (current_player.score === 7) {
            endGame();
        }
    }
}

function removeElement(elementId) {
    let element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

function changeTurn() {
    dice.rolled = false;
    newPosIndex = 0;
    if (current_player.color === 'grey') {
        current_player = playerWhite;
    } else if (current_player.color === 'white') {
        current_player = playerGrey;
    }
    setTurnIndicator();

    document.querySelector('.roll-text').classList.remove('invisible');
}

function setTurnIndicator() {
    document
        .querySelector(`#active_player_${current_player.color}`)
        .classList.add('active_player');

    document
        .querySelector(`#active_player_${current_player.opponent}`)
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
        playerGrey.path[i].addEventListener('click', moveToTile);
        playerWhite.path[i].addEventListener('click', moveToTile);
    }
    dice.domEl.addEventListener('click', rollDice);
}

//Rolling variables and functions

function rollDice() {
    if (dice.rolled === false) {
        document.querySelector('.roll-text').innerHTML = 'Roll!';
        document.querySelector('.dice-imgs').classList.remove('invisible');
        dice.rollVal = dice.calcRollVal();
        dice.updateUI();
        dice.rolled = true;

        if (dice.rollVal === 0 || countImmoveableTokens() === 7) {
            changeTurn();
            return;
        }
        document.querySelector('.roll-text').classList.add('invisible');
    }
}

function endGame() {
    document.getElementById(
        'player_' + current_player.color + '_score'
    ).innerHTML = 'Winner!';
    dice.rolled = true;
    document.getElementById('die_1').innerHTML = ' ';
    document.getElementById('die_2').innerHTML = ' ';
    document.querySelector('.roll-text').classList.remove('invisible');
    document.querySelector('.roll-text').innerHTML = 'Game Over';
}

eventListenersInit();
setTurnIndicator();
