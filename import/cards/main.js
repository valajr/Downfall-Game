const CARDS = {
    'gold': {
        'name': 'Gold',
        'img_front': '',
        'img_back': '',
        'description': 'You found some gold in this room.'
    },
    'arrow': {
        'name': 'Arrow',
        'img_front': '',
        'img_back': '',
        'description': 'You found some arrows in this room.'
    },
    'battle': {
        'name': 'Battle',
        'img_front': '',
        'img_back': '',
        'description': 'You encounter some enemies, be carefull.'
    },
    'fountain': {
        'name': 'Fountain of Life',
        'img_front': '',
        'img_back': '',
        'description': 'You encounter a fountain of life, get a little rest and recover your HP.'
    }
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

function createCard(id, type, lvl) {
    let card;
    switch(type) {
        case gold:
            card = new Card(id, CARDS.gold.name, type, CARDS.gold.img_front, 
                CARDS.gold.img_back, CARDS.gold.description);
            card.action = () => Player.gold += 5*lvl;
            break;
        case arrow:
            card = new Card(id, CARDS.arrow.name, type, CARDS.arrow.img_front, 
                CARDS.arrow.img_back, CARDS.arrow.description);
            card.action = () => Player.arrow += 1*lvl;
            break;
        case battle:
            card = new Card(id, CARDS.battle.name, type, CARDS.battle.img_front, 
                CARDS.battle.img_back, CARDS.battle.description);
            card.action = () => {
                switch(lvl) {
                    case 1: //Barbarian 8
                        break;
                    case 2: //Zombies 9
                        break;
                    case 3: //Skeleton 6
                        break;
                    case 4: //Ghost 6
                        break;
                    case Path.rooms[Path.rooms.length - 1].lvl: //Demon 4
                        break;
                    default: //3 variado
                        break;
                }
                for(e=0; e<enemies.length; e++) 
                    Battle.addEnemy(enemies[e]);
            };
            break;
        case fountain:
            card = new Card(id, CARDS.fountain.name, type, CARDS.fountain.img_front, 
                CARDS.fountain.img_back, CARDS.fountain.description);
            card.action = () => {
                for(a=0; a < Battle.allies.length; a++)
                    Battle.allies[a].life += 5*lvl;
            };
    }
    return card;
}

function getCards() {  
    // Por andar: 1 > Battle; 2 > Battle && (gold || arrow || fountain); 
    // 3 > Battle && (gold || arrow || fountain) && (gold || arrow);
    
    const grid = document.querySelector('.grid-cards');
    let card_01 = new Card(1, "Name 01", "type-01", "./test/img/luffy.jpg", "./test/img/luffy.jpeg", "Description 01");
    card_01.action = () => {
        console.log('Card 01 flipped');
    };
    let card_02 = new Card(2, "Name 02", "type-02", "./test/img/luffy.jpg", "./test/img/luffy.jpeg", "Description 02");
    card_02.action = () => {
        console.log('Card 02 flipped');
    };
    let card_03 = new Card(3, "Name 03", "type-03", "./test/img/luffy.jpg", "./test/img/luffy.jpeg", "Description 03");
    card_03.action = () => {
        console.log('Card 03 flipped');
    };

    grid.appendChild(card_01.toHTML());
    grid.appendChild(card_02.toHTML());
    grid.appendChild(card_03.toHTML());
}