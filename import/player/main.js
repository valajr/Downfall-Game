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

function createPlayer(map) {
    initializeMap(map);
    createDeck();
    let player = new Char(BASIC_PLAYER.name, BASIC_PLAYER.life, BASIC_PLAYER.max_life, 
        BASIC_PLAYER.attack, BASIC_PLAYER.defense, BASIC_PLAYER.initiative);
    player.skill = BASIC_PLAYER.skill;
    Battle.addAlly(player);
}