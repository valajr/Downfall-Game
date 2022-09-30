const MAPPING = {
    'radius': '2%',
    'floor_distance': 10,
    'initial_distance': 50
}

function createSvg(type, cl=null, attrs=null) {
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

function updateMap(lvl, map) {
    map.innerHTML = '';
    let periculosidade = lvl*MAPPING.floor_distance;
    for(let floor=0; floor<Path.rooms[Path.rooms.length - 1].lvl; floor++) {
        let lvl_rooms = Path.getRoomsByLvl(floor);
        let max_rooms = lvl_rooms.length;
        for(let r=0; r<max_rooms; r++) {
            let x = (100/(max_rooms + 1))*(r + 1);
            let y = (floor)*MAPPING.floor_distance + MAPPING.initial_distance - periculosidade;
            let actual_room = lvl_rooms[r];
            let room = createSvg('circle', ['room'], {'id':actual_room.id, 'cx':`${x}%`, 'cy':`${y}%`, 'r':MAPPING.radius});
            if(actual_room.connections.prev.length > 0) {
                prev_floor = Path.getRoomsByLvl(floor-1);
                for(let c=0; c<actual_room.connections.prev.length; c++) {
                    let connection = 0;
                    for(let i=0; i<prev_floor.length; i++) {
                        if(prev_floor[i].id == actual_room.connections.prev[c]) {
                            connection = i;
                            break;
                        }
                    }
                    let x1 = (100/(prev_floor.length + 1))*(connection + 1);
                    let y1 = (floor - 1)*MAPPING.floor_distance + MAPPING.initial_distance - periculosidade;
                    let path = createSvg('line', ['path', actual_room.connections.prev[c]], 
                    {'x1':`${x1}%`, 'y1':`${y1}%`, 'x2':`${x}%`, 'y2':`${y}%`, 'style':MAPPING.line_style});
                    map.appendChild(path);
                }
            }
            map.appendChild(room);
        }
    }
}

function initializeMap(map) {
    Path.createPath(16, 3, false);

    let next = [];
    let lvl_1 = Path.getRoomsByLvl(1);

    for(let room=0; room<lvl_1.length; room++) {
        lvl_1[room].connections.prev = [0];
        next.push(lvl_1[room].id);
    }

    let lvl_0 = new Room(0, [], next, 0);
    Path.rooms.unshift(lvl_0);
    updateMap(0, map);
}

function revealElements(revealed_ids) {
    for(let id=0; id<revealed_ids.length; id++) {
        let room = document.getElementById(revealed_ids[id]);
        room.className.baseVal = "room revealed";

        let path = document.getElementsByClassName(revealed_ids[id]);
        for(let p=0; p<path.length; p++)
            path[p].className.baseVal = `path ${revealed_ids[id]} revealed`;
    }
}