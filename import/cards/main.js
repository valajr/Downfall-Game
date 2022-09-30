const CARDS = {
    'gold': {
        'name': 'Gold',
        'img_front': '',
        'description': 'You found some gold in this room.'
    },
    'arrow': {
        'name': 'Arrow',
        'img_front': '',
        'description': 'You found some arrows in this room.'
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
    'img_back': ''
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
    },
    'max_enemies': 3,
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

function createEnemy(tribe) {
    if(!(tribe in ENEMY)) {
        let random = getRandom(Object.keys(ENEMY).length);
        tribe = Object.keys(ENEMY)[random];
    }

    let random_name = getRandom(ENEMY[tribe].name.length);
    let enemy = new Char(ENEMY[tribe].name[random_name], ENEMY[tribe].life, ENEMY[tribe].max_life,
        ENEMY[tribe].attack, ENEMY[tribe].defense, ENEMY[tribe].initiative);
    enemy.skill = ENEMY[tribe].skill;

    return enemy;
}

function createCard(id, type, lvl) {
    let card;
    switch(type) {
        case 'gold':
            card = new Card(id, CARDS.gold.name, type, CARDS.gold.img_front, 
                CARDS.img_back, CARDS.gold.description);
            card.action = () => Player.gold += 5*lvl;
            break;
        case 'arrow':
            card = new Card(id, CARDS.arrow.name, type, CARDS.arrow.img_front, 
                CARDS.img_back, CARDS.arrow.description);
            card.action = () => Player.arrow += 1*lvl;
            break;
        case 'battle':
            card = new Card(id, CARDS.battle.name, type, CARDS.battle.img_front, 
                CARDS.img_back, CARDS.battle.description);
            card.action = () => {
                let enemies = [];
                let max_enemies = getRandom(ENEMY.max_enemies) + 1;
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
            };
            break;
        case 'fountain':
            card = new Card(id, CARDS.fountain.name, type, CARDS.fountain.img_front, 
                CARDS.img_back, CARDS.fountain.description);
            card.action = () => {
                for(a=0; a < Battle.allies.length; a++)
                    Battle.allies[a].life += 5*lvl;
            };
    }
    return card;
}

function createDeck() {
    let random;
    let id = 1;
    let card_row = [];
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
    let cards_id = room.connections.next;

    for(let card=0; card<cards_id.length; card++)
        grid.appendChild(Deck.getCardById(cards_id[card]).toHTML());
}

function createSimpleCardHTML(id, name, type, img_front) {
    let card = new Card(id, name, type, img_front, CARDS.img_back);
    return card.toHTML();
}