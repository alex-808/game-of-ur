var player_grey = {
    turn: true,
    tokens: [document.getElementById('grey_1'), document.getElementById('grey_2'), document.getElementById('grey_3'), document.getElementById('grey_4'), document.getElementById('grey_5'), document.getElementById('grey_6'),
    document.getElementById('grey_7')],
    active_token: 0,
    path: [document.getElementById('grey_path_0'), document.getElementById('grey_path_1'), document.getElementById('grey_path_2'), document.getElementById('grey_path_3'), document.getElementById('grey_path_4'), document.getElementById('path_5'), document.getElementById('path_6'), document.getElementById('path_7'), document.getElementById('path_8'), document.getElementById('path_9'), document.getElementById('path_10'), document.getElementById('path_11'), document.getElementById('grey_path_12'), document.getElementById('grey_path_13'), document.getElementById('grey_path_14'), ],
    color: 'grey'
};

var player_white = {
    turn: true,
    tokens: [document.getElementById('white_1'), document.getElementById('white_2'), document.getElementById('white_3'), document.getElementById('white_4'), document.getElementById('white_5'), document.getElementById('white_6'),
    document.getElementById('white_7')],
    active_token: 0,
    path: [document.getElementById('white_path_0'), document.getElementById('white_path_1'), document.getElementById('white_path_2'), document.getElementById('white_path_3'), document.getElementById('white_path_4'), document.getElementById('path_5'),
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
    color: 'white'
};

var current_player = player_white;
current_player.active_token = current_player.tokens[0];

//Event Listeners

for (var i = 0; i < current_player.tokens.length; i++) {

    current_player.tokens[i].addEventListener('click', set_active_token);
}


for (var i = 1; i < current_player.path.length; i++) {

    current_player.path[i].addEventListener('click', move_active_token);

}


var new_position = 0;

//Event Listener functions

function set_active_token() {
    current_player.active_token = this;

    if (current_player.path.indexOf(current_player.active_token.parentElement) + roll_val < 15 && current_player.path.indexOf(current_player.active_token.parentElement) + roll_val > 0) {
        current_player.path[new_position].classList.remove(
            'active_space');



        new_position = current_player.path.indexOf(current_player.active_token.parentElement) + roll_val;

        if (current_player.path[new_position].classList.contains(current_player.color + '_occupied')) {
            console.log('no move');
        }
        current_player.path[new_position].classList.add('active_space');
    } else {
        console.log('no move');
    }
}
var el;
var id = "path_0";



function move_active_token() {

    el = current_player.path[new_position];
    console.log(el, new_position);
    if (el !== event.target) return;
    if (new_position < 5 || new_position > 11) {
        console.log('pass 1-4, 12+')
        id = current_player.color + "_path_" + new_position;
    } else {
        console.log("5-11");
        id = "path_" + new_position;
    }
    if (current_player.path[new_position].classList.contains(current_player.color + '_occupied')) {

        console.log('no move');

    } else {
        console.log(id);
        document.getElementById(id).appendChild(current_player.active_token);

        current_player.path[new_position].classList.remove('active_space');

        add_score();
        new_position = 0;

        set_occupation_status();

    }
}
var score = parseInt(document.getElementById('player_' + current_player.color + '_score').innerHTML);

function add_score() {
    if (new_position === 14) {

        score = score + 1;
        document.getElementById('player_' +
            current_player.color + '_score').innerHTML = score;

        function removeElement(elementId) {
            // Removes an element from the document
            var element = document.getElementById(elementId);
            element.parentNode.removeChild(element);
        }

        removeElement(current_player.active_token.id);
        console.log('scored!', score)
        if (score === 7) {
            document.getElementById('current_player_score').innerHTML = "Winner!";
        }


    }
}

function set_turn_indicator() {

}

function set_occupation_status() {
    for (i = 1; i < (current_player.path.length - 1); i++) {

        for (j = 0; j < (current_player.tokens.length); j++) {
            //console.log(i, j);
            if (current_player.path[i].contains(current_player.tokens[j])) {
                current_player.path[i].classList.add(current_player.color + '_occupied');

                //console.log(i, j, "match found");
                if (j !== 6 && i !== 14) {
                    i = i + 1;
                    j = -1;
                } else {
                    console.log('protected');
                }
                continue;
            } else {
                current_player.path[i].classList.remove(current_player.color + '_occupied');
                // console.log(i, j, 'no match found');
                continue;
            }
        }
    }

}

set_occupation_status();



//Rolling variables and functions
var dice_box = document.getElementById('dice');

dice_box.addEventListener('click', dice_roll);

var dice_val_1;
var dice_val_2;
var roll_val;

function dice_roll() {
    if (current_player.turn === true) {
        dice_val_1 = Math.round(Math.random() * 2);
        dice_val_2 = Math.round(Math.random() * 2);

        roll_val = dice_val_1 + dice_val_2;
        document.getElementById('die_1').innerHTML = dice_val_1;
        document.getElementById('die_2').innerHTML = dice_val_2;

        return roll_val;
    } else {
        console.log('no!');
    }
}
