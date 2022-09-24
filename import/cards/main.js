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
    let random;
    let enemy;
    switch(tribe) {
        case 'barbarian':
            random = getRandom(ENEMY.barbarian.name.length);
            enemy = new Char(ENEMY.barbarian.name[random], ENEMY.barbarian.life, ENEMY.barbarian.max_life,
                ENEMY.barbarian.attack, ENEMY.barbarian.defense, ENEMY.barbarian.initiative);
            enemy.skill = ENEMY.barbarian.skill;
            break;
        case 'zombie':
            random = getRandom(ENEMY.zombie.name.length);
            enemy = new Char(ENEMY.zombie.name[random], ENEMY.zombie.life, ENEMY.zombie.max_life,
                ENEMY.zombie.attack, ENEMY.zombie.defense, ENEMY.zombie.initiative);
            enemy.skill = ENEMY.zombie.skill;
            break;
        case 'skeleton':
            random = getRandom(ENEMY.skeleton.name.length);
            enemy = new Char(ENEMY.skeleton.name[random], ENEMY.skeleton.life, ENEMY.skeleton.max_life,
                ENEMY.skeleton.attack, ENEMY.skeleton.defense, ENEMY.skeleton.initiative);
            enemy.skill = ENEMY.skeleton.skill;
            break;
        case 'ghost':
            random = getRandom(ENEMY.ghost.name.length);
            enemy = new Char(ENEMY.ghost.name[random], ENEMY.ghost.life, ENEMY.ghost.max_life,
                ENEMY.ghost.attack, ENEMY.ghost.defense, ENEMY.ghost.initiative);
            enemy.skill = ENEMY.ghost.skill;
            break;
        case 'demon':
            random = getRandom(ENEMY.demon.name.length);
            enemy = new Char(ENEMY.demon.name[random], ENEMY.demon.life, ENEMY.demon.max_life,
                ENEMY.demon.attack, ENEMY.demon.defense, ENEMY.demon.initiative);
            enemy.skill = ENEMY.demon.skill;
    }
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
                let max_enemies = getRandom(ENEMY.max) + 1;
                switch(lvl) {
                    case 1:
                        for(let enemy=0; enemy<max_enemies; enemy++)
                            Battle.addEnemy(createEnemy('barbarian'));
                        break;
                    case 2:
                        for(let enemy=0; enemy<max_enemies; enemy++)
                            Battle.addEnemy(createEnemy('zombies'));
                        break;
                    case 3:
                        for(let enemy=0; enemy<max_enemies; enemy++)
                            Battle.addEnemy(createEnemy('skeleton'));
                        break;
                    case 4:
                        for(let enemy=0; enemy<max_enemies; enemy++)
                            Battle.addEnemy(createEnemy('ghost'));
                        break;
                    case Path.rooms[Path.rooms.length - 1].lvl:
                        Battle.addEnemy(createEnemy('demon'));
                        break;
                    default:
                        for(let enemy=0; enemy<max_enemies; enemy++) {
                            let random = getRandom(4);
                            switch(random) {
                                case 0:
                                    Battle.addEnemy(createEnemy('barbarian'));
                                    break;
                                case 1:
                                    Battle.addEnemy(createEnemy('zombies'));
                                    break;
                                case 2:
                                    Battle.addEnemy(createEnemy('skeleton'));
                                    break;
                                case 3:
                                    Battle.addEnemy(createEnemy('ghost'));
                                    break;
                            }
                        }
                }
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
    for(let room=0; room<Path.rooms.length-1; room++) {
        Path.rooms[room].door = Deck.getCardById(room);
    }
}