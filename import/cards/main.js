const CARDS = {
    'gold': {
        'name': 'Gold',
        'type': 'gold',
        'img_front': '',
        'img_back': '',
        'description': 'You found some gold in this room.',
        'action': ''
    },
    'arrow': {
        'name': 'Arrow',
        'type': 'arrow',
        'img_front': '',
        'img_back': '',
        'description': 'You found some arrows in this room.',
        'action': ''
    },
    'battle': {
        'name': '',
        'type': 'battle',
        'img_front': '',
        'img_back': '',
        'description': 'You encounter some enemies, be carefull.',
        'action': ''
    }
}

function getCards() {  
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