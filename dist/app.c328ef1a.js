// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"modules/playerPaths.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.whitePathArr = exports.greyPathArr = void 0;
var whitePathArr = [document.getElementById('white_path_0'), document.getElementById('white_path_1'), document.getElementById('white_path_2'), document.getElementById('white_path_3'), document.getElementById('white_path_4'), document.getElementById('path_5'), document.getElementById('path_6'), document.getElementById('path_7'), document.getElementById('path_8'), document.getElementById('path_9'), document.getElementById('path_10'), document.getElementById('path_11'), document.getElementById('white_path_12'), document.getElementById('white_path_13'), document.getElementById('white_path_14')];
exports.whitePathArr = whitePathArr;
var greyPathArr = [document.getElementById('grey_path_0'), document.getElementById('grey_path_1'), document.getElementById('grey_path_2'), document.getElementById('grey_path_3'), document.getElementById('grey_path_4'), document.getElementById('path_5'), document.getElementById('path_6'), document.getElementById('path_7'), document.getElementById('path_8'), document.getElementById('path_9'), document.getElementById('path_10'), document.getElementById('path_11'), document.getElementById('grey_path_12'), document.getElementById('grey_path_13'), document.getElementById('grey_path_14')];
exports.greyPathArr = greyPathArr;
},{}],"app.js":[function(require,module,exports) {
"use strict";

var _playerPaths = require("./modules/playerPaths.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function Player(color) {
  _classCallCheck(this, Player);

  this.color = color;
  this.score = 0;
  this.tokens = [];

  if (color === 'grey') {
    this.path = _playerPaths.greyPathArr;
    this.opponent = 'white';
  } else {
    this.path = this.path = _playerPaths.whitePathArr;
    this.opponent = 'grey';
  }

  for (var i = 1; i < 8; i++) {
    var token = document.querySelector("#".concat(this.color, "_").concat(i));
    this.tokens.push(token);
  }
};

var playerGrey = new Player('grey');
var playerWhite = new Player('white');
var dice = {
  domEl: document.getElementById('dice'),
  diceVal1: 0,
  diceVal2: 0,
  rollVal: 0,
  rolled: false,
  dieElement1: document.getElementById('die_1'),
  dieElement2: document.getElementById('die_2'),
  calcRollVal: function calcRollVal() {
    this.diceVal1 = Math.round(Math.random() * 2);
    this.diceVal2 = Math.round(Math.random() * 2);
    return this.diceVal1 + this.diceVal2;
  },
  updateUI: function updateUI() {
    this.dieElement1.innerHTML = this.diceVal1;
    this.dieElement2.innerHTML = this.diceVal2;
  }
};
var current_player = playerGrey;
var currentPosIndex;
var newPosIndex = 0;
var newTile;
var rosetteIndices = [4, 8, 13]; //Event Listener callbacks

function highlightPossibleMove() {
  if (dice.rolled === true && current_player.tokens.includes(this)) {
    var _document$querySelect;

    (_document$querySelect = document.querySelector('.active_space')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.classList.remove('active_space');
    current_player.active_token = this;
    currentPosIndex = current_player.path.indexOf(this.parentElement);
    newPosIndex = currentPosIndex + dice.rollVal;
    newTile = current_player.path[newPosIndex];
  } else return; // check for no moves, should be put in a new function


  if (newTile.classList.contains(current_player.color + '_occupied')) {
    console.log('no move, space occupied');
    return;
  }

  if (newPosIndex < 15 && newPosIndex > 0) {
    newTile.classList.add('active_space');
  }
}

function countImmoveableTokens() {
  var no_move_counter = 0;

  for (var i = 0; i < current_player.tokens.length; i++) {
    var newPosIndex_element = current_player.path[current_player.path.indexOf(current_player.tokens[i].parentElement) + dice.rollVal]; // check if token has been removed

    if (current_player.tokens[i].parentElement === null) {
      no_move_counter += 1; // check if path of new index exists
    } else if (current_player.path.indexOf(newPosIndex_element) === -1) {
      no_move_counter += 1;
    } //check if path of new index is already occuped
    else if (newPosIndex_element.classList.contains(current_player.color + '_occupied')) {
        no_move_counter += 1;
      }
  }

  console.log(no_move_counter);
  return no_move_counter;
}

function moveToTile() {
  var el = current_player.path[newPosIndex];

  if (el !== event.target && event.target.parentElement !== el) {
    console.log('not event target');
    return; // makes sure the player clicks on intended square
  } // check if new position is occupied by opponent


  if (current_player.path[newPosIndex].classList.contains(current_player.opponent + '_occupied')) {
    console.log('capture');
    captureTile();
  } // move your token to the location


  document.querySelector('.active_space').appendChild(current_player.active_token);
  current_player.path[newPosIndex].classList.remove('active_space');
  resetOccupationStatuses(newPosIndex, currentPosIndex);
  addScore();
  document.querySelector('.dice-imgs').classList.add('invisible'); // check if player landed on a rosette

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
  document.querySelector('.roll-indicator').innerHTML = 'Roll Again!';
  document.querySelector('.roll-indicator').classList.remove('invisible');
}

function captureTile() {
  // remove opponent token
  document.getElementById(current_player.opponent + '_path_0').appendChild(current_player.path[newPosIndex].firstElementChild);
  current_player.path[newPosIndex].classList.remove(current_player.opponent + '_occupied'); // set tile's class you occupied by you

  current_player.path[newPosIndex].classList.add(current_player.color + '_occupied');
}

function addScore() {
  if (newPosIndex === 14) {
    current_player.score++;
    document.getElementById('player_' + current_player.color + '_score').innerHTML = current_player.score;
    current_player.path[newPosIndex].classList.remove("".concat(current_player.color, "_occupied"));
    removeElement(current_player.active_token.id);

    if (current_player.score === 7) {
      endGame();
    }
  }
}

function removeElement(elementId) {
  var element = document.getElementById(elementId);
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
  document.querySelector('.roll-indicator').classList.remove('invisible');
}

function setTurnIndicator() {
  document.querySelector("#active_player_".concat(current_player.color)).classList.add('active_player');
  document.querySelector("#active_player_".concat(current_player.opponent)).classList.remove('active_player');
}

function resetOccupationStatuses(newPosIndex, currentPosIndex) {
  var occupationClass = current_player.color + '_occupied';
  current_player.path[newPosIndex].classList.add(occupationClass);
  current_player.path[currentPosIndex].classList.remove(occupationClass);
} //Event Listener Initialization functions


function eventListenersInit() {
  for (var i = 0; i < playerGrey.tokens.length; i++) {
    playerGrey.tokens[i].addEventListener('click', highlightPossibleMove);
    playerWhite.tokens[i].addEventListener('click', highlightPossibleMove);
  }

  for (var _i = 1; _i < playerGrey.path.length; _i++) {
    playerGrey.path[_i].addEventListener('click', moveToTile);

    playerWhite.path[_i].addEventListener('click', moveToTile);
  }

  dice.domEl.addEventListener('click', rollDice);
} //Rolling variables and functions


function rollDice() {
  if (dice.rolled === false) {
    document.querySelector('.roll-indicator').innerHTML = 'Roll!';
    document.querySelector('.dice-imgs').classList.remove('invisible');
    dice.rollVal = dice.calcRollVal();
    dice.updateUI();
    dice.rolled = true;

    if (dice.rollVal === 0 || countImmoveableTokens() === 7) {
      changeTurn();
      return;
    }

    document.querySelector('.roll-indicator').classList.add('invisible');
  }
}

function endGame() {
  document.getElementById('player_' + current_player.color + '_score').innerHTML = 'Winner!';
  dice.rolled = true;
  document.getElementById('die_1').innerHTML = ' ';
  document.getElementById('die_2').innerHTML = ' ';
  document.querySelector('.roll-indicator').classList.remove('invisible');
  document.querySelector('.roll-indicator').innerHTML = 'Game Over';
}

eventListenersInit();
setTurnIndicator();
},{"./modules/playerPaths.js":"modules/playerPaths.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52074" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.js.map