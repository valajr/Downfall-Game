const CARDS = {
    'door': {
        'name': 'Entrance Door.',
        'img_front': '',
        'description': 'You cannot exit now, be sure to defeat the tower boss.'
    },
    'gold': {
        'name': 'Gold',
        'img_front': '',
        'description': 'In this room, you found '
    },
    'arrow': {
        'name': 'Arrow',
        'img_front': '',
        'description': 'In this room, you found '
    },
    'battle': {
        'name': 'Battle',
        'img_front': '',
        'description': 'You encounter some enemies, be carefull.'
    },
    'fountain': {
        'name': 'Fountain of Life',
        'img_front': '',
        'description': 'You encounter a fountain of life, get a little rest and recover your HP.'
    },
    'img_back': '',
    'timeout': 3000,
    'max_enemies': 3, 
    'explored': []
}

const ENEMY = {
    'barbarian': {
        'name': ['Thorfinn', 'Thors', 'Askeladd', 'Bjorn', 'Canute', 'Ragnar', 'Helga', 'Ylva'],
        'life': 10,
        'max_life': 10,
        'attack': 5,
        'defense': 0,
        'initiative': 50,
        'skill': ''
    },
    'zombie': {
        'name': ['Sakura', 'Saki', 'Ai', 'Junko', 'Tae', 'Yuugiri', 'Lily', 'Romero', 'Koutaro'],
        'life': 15,
        'max_life': 15,
        'attack': 10,
        'defense': 2,
        'initiative': 70,
        'skill': ''
    },
    'skeleton': {
        'name': ['Brook', 'Ainz', 'Ooal', 'Gown', 'Momonga', 'Keldor'],
        'life': 20,
        'max_life': 20,
        'attack': 10,
        'defense': 0,
        'initiative': 90,
        'skill': ''
    },
    'ghost': {
        'name': ['Einstein', 'Newton', 'Hawkings', 'Tesla', 'Dali', 'Da Vinci'],
        'life': 30,
        'max_life': 30,
        'attack': 20,
        'defense': 0,
        'initiative': 60,
        'skill': ''
    },
    'demon': {
        'name': ['Asmodeus', 'Leviathan', 'Azazel', 'Beelzebub'],
        'life': 25,
        'max_life': 25,
        'attack': 15,
        'defense': 5,
        'initiative': 50,
        'skill': ''
    }
}

function createEnemy(tribe) {
    if(!(tribe in ENEMY)) {
        let random = getRandom(Object.keys(ENEMY).length - 1);
        tribe = Object.keys(ENEMY)[random];
    }

    let random_name = getRandom(ENEMY[tribe].name.length);
    let enemy = new Char(ENEMY[tribe].name[random_name], ENEMY[tribe].life, ENEMY[tribe].max_life,
        ENEMY[tribe].attack, ENEMY[tribe].defense, ENEMY[tribe].initiative);
    enemy.skill = ENEMY[tribe].skill;

    return enemy;
}

function exploredCard(id, lvl) {
    let explored = false;
    for(let c=0; c<CARDS.explored.length; c++) {
        if(CARDS.explored[c] == id) {
            alert('Already collected the loot of this room.');
            explored = true;
            setTimeout(function () {updateLevel(id, lvl)}, CARDS.timeout);
        }
    }
    if(!explored)
        CARDS.explored.push(id);
    
    return explored;
}

function createCard(id, type, lvl) {
    let card;
    switch(type) {
        case 'door':
            card = new Card(id, CARDS.door.name, type, CARDS.door.img_front,
                CARDS.img_back, CARDS.door.description);
            card.action = () => {
                Player.direction = 'down';
                setTimeout(function () {updateLevel(card.id, lvl)}, CARDS.timeout);
            }
            break;
        case 'gold':
            card = new Card(id, CARDS.gold.name, type, CARDS.gold.img_front, 
                CARDS.img_back, CARDS.gold.description + `${2*lvl} gold.`);
            card.action = () => {
                let explored = exploredCard(card.id, lvl);
                if(!explored) {
                    Player.gold += 2*lvl;
                    setTimeout(function () {updateLevel(card.id, lvl)}, CARDS.timeout);
                }
            }
            break;
        case 'arrow':
            card = new Card(id, CARDS.arrow.name, type, CARDS.arrow.img_front, 
                CARDS.img_back, CARDS.arrow.description + `${Math.round(lvl/2) + 1} arrows.`);
            card.action = () => {
                let explored = exploredCard(card.id, lvl);
                if(!explored) {
                    Player.arrows += Math.round(lvl/2) + 1;
                    setTimeout(function () {updateLevel(card.id, lvl)}, CARDS.timeout);
                }
            }
            break;
        case 'battle':
            card = new Card(id, CARDS.battle.name, type, CARDS.battle.img_front, 
                CARDS.img_back, CARDS.battle.description);
            card.action = () => {
                let explored = exploredCard(card.id, lvl);
                if(!explored) {
                    let enemies = [];
                    let max_enemies = getRandom(CARDS.max_enemies) + 1;
                    switch(lvl) {
                        case 1:
                            for(let e=0; e<max_enemies; e++) {
                                enemies.push(createEnemy('barbarian'));
                            }
                            break;
                        case 2:
                            for(let e=0; e<max_enemies; e++) {
                                enemies.push(createEnemy('zombie'));
                            }
                            break;
                        case 3:
                            for(let e=0; e<max_enemies; e++) {
                                enemies.push(createEnemy('skeleton'));
                            }
                            break;
                        case 4:
                            for(let e=0; e<max_enemies; e++) {
                                enemies.push(createEnemy('ghost'));
                            }
                            break;
                        case Path.rooms[Path.rooms.length - 1].lvl:
                            enemies.push(createEnemy('demon'));
                            break;
                        default:
                            for(let e=0; e<max_enemies; e++) {
                                enemies.push(createEnemy());
                            }
                    }
                    for(e=0; e<enemies.length; e++) 
                        Battle.addEnemy(enemies[e]);
                    last_battle = card.id;
                    setTimeout(startBattle, CARDS.timeout);
                }
            };
            break;
        case 'fountain':
            card = new Card(id, CARDS.fountain.name, type, CARDS.fountain.img_front, 
                CARDS.img_back, CARDS.fountain.description);
            card.action = () => {
                let explored = exploredCard(card.id, lvl);
                if(!explored) {
                    for(a=0; a < Battle.allies.length; a++) {
                        Battle.allies[a].life += 5*lvl;
                        if(Battle.allies[a].life > Battle.allies[a].max_life)
                            Battle.allies[a].life = Battle.allies[a].max_life
                    }
                    setTimeout(function () {updateLevel(card.id, lvl)}, CARDS.timeout);
                }
            };
    }
    return card;
}

function createDeck() {
    let random;
    let id = 0;
    let card_row = [];
    Deck.addCard(createCard(id, 'door', 0));
    id++;
    for(let lvl=1; lvl<Path.rooms[Path.rooms.length - 1].lvl + 1; lvl++) {
        floor = Path.getRoomsByLvl(lvl);
        if(floor.length == 1) {
            Deck.addCard(createCard(id, 'battle', lvl));
            id++;
        }
        else if(floor.length == 2) {
            card_row.push(createCard(0, 'battle', lvl));

            random = getRandom(100);
            if(random < 33)
                card_row.push(createCard(0, 'fountain', lvl));
            else if(random < 66)
                card_row.push(createCard(0, 'arrow', lvl));
            else
                card_row.push(createCard(0, 'gold', lvl));

            random = getRandom(100);
            if(random < 50) {
                card_row[0].id = id;
                id++;
                Deck.addCard(card_row.shift());
                card_row[0].id = id;
                id++;
                Deck.addCard(card_row.shift());
            }
            else {
                card_row[1].id = id;
                id++;
                Deck.addCard(card_row.pop());
                card_row[0].id = id;
                id++;
                Deck.addCard(card_row.pop());
            }
        }
        else {
            card_row.push(createCard(0, 'battle', lvl));

            random = getRandom(100);
            if(random < 33)
                card_row.push(createCard(0, 'fountain', lvl));
            else if(random < 66)
                card_row.push(createCard(0, 'arrow', lvl));
            else
                card_row.push(createCard(0, 'gold', lvl));

            for(let i=0; i<floor.length-2; i++) {
                random = getRandom(100);
                if(random < 50)
                    card_row.push(createCard(0, 'arrow', lvl));
                else
                    card_row.push(createCard(0, 'gold', lvl));
            }
            
            random = getRandom(100);
            if(random < 50) {
                for(let card=0; card<floor.length; card++) {
                    card_row[0].id = id;
                    id++;
                    Deck.addCard(card_row.shift());
                }
            }
            else {
                for(let card=0; card<floor.length; card++) {
                    card_row[card_row.length - 1].id = id;
                    id++;
                    Deck.addCard(card_row.pop());
                }
            }
        }
    }
    for(let room=0; room<Path.rooms.length-1; room++) 
        Path.rooms[room].door = Deck.getCardById(room);
}

function showCards(id, grid) {
    grid.innerHTML = '';
    let room = Path.getRoomById(id);
    let cards_id = [];
    if(Player.direction === 'down')
        cards_id = room.connections.next.sort();
    else
        cards_id = room.connections.prev.sort();

    if(!cards_id.length) {
        alert('This room has no exit, go back.')
        changeDirection();
        setTimeout(function () {showCards(id, grid)}, CARDS.timeout);
    }
    else {
        for(let card=0; card<cards_id.length; card++)
            grid.appendChild(Deck.getCardById(cards_id[card]).toHTML());
    }
}

function createSimpleCardHTML(id, name, type, img_front, description) {
    let card = new Card(id, name, type, img_front, CARDS.img_back, description);
    return card.toHTML();
}