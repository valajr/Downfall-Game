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

const createSvg = (type, cl=null, attrs=null) => {
    let xmlns = "http://www.w3.org/2000/svg";
    let element = document.createElementNS(xmlns, type);

    if(cl)
        element.className.baseVal = cl.join(' ');

    if(attrs) {
        for (const [key, value] of Object.entries(attrs))
            element.setAttributeNS(null, key, value);
    }

    return element;
}

function inicializateMap(map) {
    let lvl_0 = createSvg('circle', ['room', 0], {'id':0, 'cx':'50%', 'cy':'5%', r:'2%'});
    map.appendChild(lvl_0);
    let lvl_1 = Path.getRoomsByLvl(1);
    let x1 = 50;
    let y1 = 5;
    let y = 20;
    for(let c=0; c<lvl_1.length; c++) {
        let x = (100/(lvl_1.length + 1))*(c + 1);
        let path = createSvg('line', ['path', lvl_1[c].id], 
                    {'x1':`${x1}%`, 'y1':`${y1}%`, 'x2':`${x}%`, 'y2':`${y}%`, 'style':"stroke:rgb(0,0,255);stroke-width:2"});
        map.appendChild(path);
    }


    for(let floor=0; floor<lvl_max; floor++) {
        let lvl_rooms = Path.getRoomsByLvl(floor+1);
        let max_rooms = lvl_rooms.length;
        for(let r=0; r<max_rooms; r++) {
            let x = (100/(max_rooms + 1))*(r + 1);
            let y = (floor + 1)*20;
            let actual_room = lvl_rooms[r];
            let room = createSvg('circle', ['room'], {'id':actual_room.id, 'cx':`${x}%`, 'cy':`${y}%`, 'r':'2%'});
            if(actual_room.connections.prev.length > 0) {
                prev_floor = Path.getRoomsByLvl(floor);
                for(let c=0; c<actual_room.connections.prev.length; c++) {
                    let connection = 0;
                    for(let i=0; i<prev_floor.length; i++) {
                        if(prev_floor[i].id == actual_room.connections.prev[c]) {
                            connection = i;
                            break;
                        }
                    }
                    let x1 = (100/(prev_floor.length + 1))*(connection + 1);
                    let y1 = floor*20;
                    let path = createSvg('line', ['path', actual_room.connections.prev[c]], 
                    {'x1':`${x1}%`, 'y1':`${y1}%`, 'x2':`${x}%`, 'y2':`${y}%`, 'style':"stroke:rgb(0,0,255);stroke-width:2"});
                    map.appendChild(path);
                }
            }
            map.appendChild(room);
        }
    }
}


const map = document.querySelector('.map');
lvl_max = Path.createPath(16, 3, false);
console.log(Path.rooms);
inicializateMap(map);