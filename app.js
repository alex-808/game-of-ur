//no move counter currently over-counting
//I believe this is due to each token going through each "if" statement instead of just one
//this should be fixed if I change them to else if statements

class Player {
    constructor(color) {
        this.color = color;
        this.score = 0;
        this.tokens = [];
        this.path = [];
    }
}

const dice = {
    diceVal1: 0,
    diceVal2: 0,
    rollVal: 0,
    canRoll: false,
    dieText1: document.getElementById('die_1').innerHTML,
    dieText2: document.getElementById('die_2').innerHTML,
    calcRollVal() {
        return this.diceVal1 + this.diceVal2;
    },
    updateUI() {
        this.dieText1 = this.diceVal1;
        this.dieText2 = this.diceVal2;
    },
};

var player_grey = {
    tokens: [
        document.getElementById('grey_1'),
        document.getElementById('grey_2'),
        document.getElementById('grey_3'),
        document.getElementById('grey_4'),
        document.getElementById('grey_5'),
        document.getElementById('grey_6'),
        document.getElementById('grey_7'),
    ],
    active_token: 0,
    path: [
        document.getElementById('grey_path_0'),
        document.getElementById('grey_path_1'),
        document.getElementById('grey_path_2'),
        document.getElementById('grey_path_3'),
        document.getElementById('grey_path_4'),
        document.getElementById('path_5'),
        document.getElementById('path_6'),
        document.getElementById('path_7'),
        document.getElementById('path_8'),
        document.getElementById('path_9'),
        document.getElementById('path_10'),
        document.getElementById('path_11'),
        document.getElementById('grey_path_12'),
        document.getElementById('grey_path_13'),
        document.getElementById('grey_path_14'),
    ],
    color: 'grey',
    opposite: 'white',
    score: 0,
};

var player_white = {
    tokens: [
        document.getElementById('white_1'),
        document.getElementById('white_2'),
        document.getElementById('white_3'),
        document.getElementById('white_4'),
        document.getElementById('white_5'),
        document.getElementById('white_6'),
        document.getElementById('white_7'),
    ],
    active_token: 0,
    path: [
        document.getElementById('white_path_0'),
        document.getElementById('white_path_1'),
        document.getElementById('white_path_2'),
        document.getElementById('white_path_3'),
        document.getElementById('white_path_4'),
        document.getElementById('path_5'),
        document.getElementById('path_6'),
        document.getElementById('path_7'),
        document.getElementById('path_8'),
        document.getElementById('path_9'),
        document.getElementById('path_10'),
        document.getElementById('path_11'),
        document.getElementById('white_path_12'),
        document.getElementById('white_path_13'),
        document.getElementById('white_path_14'),
    ],
    color: 'white',
    opposite: 'grey',
    score: 0,
};
var new_position = 0;
var current_player = player_grey;
var el;
var id = 'path_0';
var score = parseInt(
    document.getElementById('player_' + current_player.color + '_score')
        .innerHTML
);
var dice_box = document.getElementById('dice');
var dice_val_1;
var dice_val_2;
var roll_val;
var dice_rolled = false;

current_player.active_token = current_player.tokens[0];

//Event Listeners

function token_initialization() {
    for (let i = 0; i < current_player.tokens.length; i++) {
        current_player.tokens[i].addEventListener('click', set_active_token);
    }
}
token_initialization();

function path_initialization() {
    for (let i = 1; i < current_player.path.length; i++) {
        current_player.path[i].addEventListener('click', move_active_token);
    }
}

path_initialization();

//Event Listener functions

function set_active_token() {
    if (dice_rolled === true && current_player.tokens.includes(this)) {
        current_player.active_token = this;

        no_move_counter = 0;

        for (i = 0; i < current_player.tokens.length; i++) {
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

            set_occupation_status();

            change_turn();
            set_turn_indicator();
            token_initialization();
            path_initialization();
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
    el = current_player.path[new_position];

    if (el !== event.target) return;
    if (new_position < 5 || new_position > 11) {
        id = current_player.color + '_path_' + new_position;
    } else {
        //console.log("5-11");
        id = 'path_' + new_position;
    }
    if (
        current_player.path[new_position].classList.contains(
            current_player.color + '_occupied'
        )
    ) {
        console.log('no move');
    } else {
        if (
            current_player.path[new_position].classList.contains(
                current_player.opposite + '_occupied'
            )
        ) {
            console.log('capture');
            document
                .getElementById(current_player.opposite + '_path_0')
                .appendChild(
                    current_player.path[new_position].firstElementChild
                );

            current_player.path[new_position].classList.remove(
                current_player.opposite + '_occupied'
            );
            current_player.path[new_position].classList.add(
                current_player.color + '_occupied'
            );
        }

        document.getElementById(id).appendChild(current_player.active_token);

        current_player.path[new_position].classList.remove('active_space');

        add_score();
        if (new_position === 4 || new_position === 8 || new_position === 13) {
            console.log('rosette');
            new_position = 0;
            set_occupation_status();
            set_turn_indicator();
            token_initialization();
            path_initialization();
            dice_rolled = false;
            document.getElementById('roll_indicator').innerHTML = 'Roll Again!';
            document
                .getElementById('roll_indicator')
                .classList.remove('invisible');
        } else if (current_player.score === 7) {
            end_game();
        } else {
            new_position = 0;

            set_occupation_status();

            change_turn();
            set_turn_indicator();
            token_initialization();
            path_initialization();
            dice_rolled = false;
        }
    }
}

function end_game() {
    dice_rolled = true;
    document.getElementById('die_1').innerHTML = ' ';
    document.getElementById('die_2').innerHTML = ' ';
    document.getElementById('roll_indicator').classList.remove('invisible');
    document.getElementById('roll_indicator').innerHTML = 'Game Over';
}

function change_turn() {
    if (current_player.color === 'grey') {
        current_player = player_white;

        document.getElementById('roll_indicator').classList.remove('invisible');
    } else if (current_player.color === 'white') {
        current_player = player_grey;
        document.getElementById('roll_indicator').classList.remove('invisible');
    }
}

function add_score() {
    if (new_position === 14) {
        current_player.score = current_player.score + 1;
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

function set_turn_indicator() {
    if (current_player === player_grey) {
        document
            .getElementById('active_player_grey')
            .classList.add('active_player');

        document
            .getElementById('active_player_white')
            .classList.remove('active_player');
    }

    if (current_player === player_white) {
        document
            .getElementById('active_player_white')
            .classList.add('active_player');

        document
            .getElementById('active_player_grey')
            .classList.remove('active_player');
    }
}

set_turn_indicator();

function set_occupation_status() {
    for (i = 1; i < current_player.path.length - 1; i++) {
        for (j = 0; j < current_player.tokens.length; j++) {
            //console.log(i, j);
            if (current_player.path[i].contains(current_player.tokens[j])) {
                current_player.path[i].classList.add(
                    current_player.color + '_occupied'
                );

                //console.log(i, j, "match found");
                if (j !== 6 && i !== 14) {
                    i = i + 1;
                    j = -1;
                } else {
                    console.log('protected');
                }
                continue;
            } else {
                current_player.path[i].classList.remove(
                    current_player.color + '_occupied'
                );
                // console.log(i, j, 'no match found');
                continue;
            }
        }
    }
}

set_occupation_status();

//Rolling variables and functions

dice_box.addEventListener('click', rollDice);

function rollDice() {
    if (dice_rolled === false) {
        document.getElementById('roll_indicator').innerHTML = 'Roll!';
        dice.diceVal1 = Math.round(Math.random() * 2);
        dice.diceVal2 = Math.round(Math.random() * 2);

        roll_val = dice.calcRollVal();
        // dice.updateUI();
        document.getElementById('die_1').innerHTML = dice.diceVal1;
        document.getElementById('die_2').innerHTML = dice.diceVal2;

        dice_rolled = true;
        if (roll_val === 0) {
            dice_rolled = false;
            change_turn();
            set_turn_indicator();
            console.log(current_player);
            return;
        }
        document.getElementById('roll_indicator').classList.add('invisible');

        return roll_val;
    } else {
        console.log('no!');
    }
}
