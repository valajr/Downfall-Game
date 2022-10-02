const map = document.querySelector('.map');
const cards = document.querySelector('.grid-cards');
const battle = document.querySelector('.grid-battle');
const info_bar = document.querySelector('.information-bar');
let revealed_ids = [];
let last_battle = 0;

class Player {
    static gold = 0;
    static arrows = 6;
    static direction = 'down';
}

const BASIC_PLAYER = {
    'name': 'Player',
    'life': 50,
    'max_life': 50,
    'attack': 10,
    'defense': 0,
    'initiative': 80,
    'skill': ''
}

function updateLevel(id, lvl) {
    battle.innerHTML = '';
    showCards(id, cards);
    updateMap(lvl, map);
    updateInfoBar();
    
    revealed_ids.push(id);
    revealElements(revealed_ids);
}

function changeDirection() {
    if(Player.direction === 'up')
        Player.direction = 'down';
    else
        Player.direction = 'up';
}

function goAnotherDirection() {
    changeDirection();
    id = revealed_ids[revealed_ids.length - 1];
    let lvl = Path.getRoomById(id).lvl;
    updateLevel(id, lvl);
}

function updateInfoBar() {
    let info_bar = document.querySelectorAll('.info');
    info_bar[0].innerHTML = `Gold: ${Player.gold}`;
    info_bar[1].innerHTML = `Arrows: ${Player.arrows}`;
    info_bar[2].innerHTML = `Direction: ${Player.direction}`;
}

function createPlayer() {
    initializeMap(map);
    
    createDeck();

    let player = new Char(BASIC_PLAYER.name, BASIC_PLAYER.life, BASIC_PLAYER.max_life, 
        BASIC_PLAYER.attack, BASIC_PLAYER.defense, BASIC_PLAYER.initiative);
    player.skill = BASIC_PLAYER.skill;
    Battle.addAlly(player);

    let gold = createHTML('span', 'gold', 'info', `Gold: ${Player.gold}`);
    let arrows = createHTML('span', 'arrows', 'info', `Arrows: ${Player.arrows}`);
    let direction = createHTML('button', 'direction', 'info', `Direction: ${Player.direction}`, goAnotherDirection);
    info_bar.appendChild(gold);
    info_bar.appendChild(arrows);
    info_bar.appendChild(direction);
    
    updateLevel(0,0);
}

function startBattle() {
    cards.innerHTML = '';
    initializeBattle(battle);
}

createPlayer();

/* Need fix: 
 - Auto battle doesn't work all times
 - Double alert if lose and have more than one enemy
 - When you go up, the next connection of room doesn't reveal on map
 - Position of the cards doesn't match with rooms on map
 - styling of info bar
 - Art of the game*/