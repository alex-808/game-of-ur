//trying to add and remove "grey_occupied" class as pieces move which follow them so we can disallow moving a piece to a tile that already has the "grey_occupied" class

var player_grey = {
    turn: true,
    tokens: [document.getElementById('grey_1'), document.getElementById('grey_2'), document.getElementById('grey_3'), document.getElementById('grey_4'), document.getElementById('grey_5'), document.getElementById('grey_6')],
    active_token: 0,
    path: [document.getElementById('path_0'), document.getElementById('path_1'), document.getElementById('path_2'), document.getElementById('path_3'), document.getElementById('path_4'), document.getElementById('path_5'), document.getElementById('path_6'), document.getElementById('path_7'), document.getElementById('path_8'), document.getElementById('path_9'), document.getElementById('path_10'), document.getElementById('path_11'), document.getElementById('path_12'), document.getElementById('path_13'), document.getElementById('path_14'), ]
};
player_grey.active_token = player_grey.tokens[0];

//Event Listeners

for (var i = 0; i < player_grey.tokens.length; i++) {

    player_grey.tokens[i].addEventListener('click', set_active_token);
}


for (var i = 1; i < player_grey.path.length; i++) {
    player_grey.path[i].addEventListener('click', move_active_token);

}


var new_position = 0;

//Event Listener functions

function set_active_token() {

    player_grey.path[new_position].classList.remove(
        'active_space');

    player_grey.active_token = this;

    new_position = player_grey.path.indexOf(player_grey.active_token.parentElement) + roll_val;
    if (player_grey.path[new_position].classList.contains('grey_occupied')) {
        console.log('no move');
    }
    player_grey.path[new_position].classList.add('active_space');

}
var el;
var id = "path_0";

function move_active_token() {

    el = player_grey.path[new_position];

    if (el !== event.target) return;

    id = "path_" + new_position;
    if (player_grey.path[new_position].classList.contains('grey_occupied')) {
        console.log('no move');
    } else {
        document.getElementById(id).appendChild(player_grey.active_token);



        player_grey.path[new_position].classList.remove('active_space');

        new_position = 0;

        set_occupation_status();
    }
}

function set_occupation_status() {
    for (i = 1; i < player_grey.path.length; i++) {

        for (j = 0; j < player_grey.tokens.length; j++) {
            // console.log(i, j);
            if (player_grey.path[i].contains(player_grey.tokens[j])) {
                player_grey.path[i].classList.add('grey_occupied');

                //j = 0;
                console.log(i, j, "match found");
                if (j !== 5) {
                    i = i + 1;
                    j = -1;
                    console.log(j);
                } else {
                    console.log('protected');
                }
                console.log(i);
                continue;
            } else {
                player_grey.path[i].classList.remove('grey_occupied');
                console.log(i, j, 'no match found');
                continue;
            }
        }
    }
}





//Rolling variables and functions
var dice_box = document.getElementById('dice');

dice_box.addEventListener('click', dice_roll);

var dice_val_1;
var dice_val_2;
var roll_val;

function dice_roll() {
    if (player_grey.turn === true) {
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
