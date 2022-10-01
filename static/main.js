const map = document.querySelector('.map');
const cards = document.querySelector('.grid-cards');
const battle = document.querySelector('.grid-battle');
let revealed_ids = [];
let last_battle = 0;

class Player {
    static gold = 0;
    static arrows = 5;
}

const BASIC_PLAYER = {
    'name': 'Player',
    'life': 30,
    'max_life': 30,
    'attack': 10,
    'defense': 0,
    'initiative': 80,
    'skill': ''
}

function createPlayer() {
    initializeMap(map);
    createDeck();
    let player = new Char(BASIC_PLAYER.name, BASIC_PLAYER.life, BASIC_PLAYER.max_life, 
        BASIC_PLAYER.attack, BASIC_PLAYER.defense, BASIC_PLAYER.initiative);
    player.skill = BASIC_PLAYER.skill;
    Battle.addAlly(player);
    revealed_ids.push(0);
    revealElements(revealed_ids);
}

function updateLevel(id, lvl) {
    battle.innerHTML = '';
    showCards(id, cards);
    updateMap(lvl, map);
    
    revealed_ids.push(id);
    revealElements(revealed_ids);
}

function startBattle() {
    cards.innerHTML = '';
    initializeBattle(battle);
}

createPlayer();
updateLevel(0,0);