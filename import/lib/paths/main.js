/**
 * Rooms base.
 * 
 */
class Room {
    #door;

/**
 * Constructor of the new element of class Room; 
 * has a private property named "door" that have to be replaced with what have in the room.
 * 
 * @param {integer} id - ID of the room
 * @param {array} connections_prev - Rooms of the previous floor that are connected to this room
 * @param {array} connections_next - Rooms of the next floor that are connected to this room
 * @param {number} lvl - Level of the room are optional, in case you don't need this to be different, will be 0
 */
    constructor(id, connections_prev, connections_next, lvl='0') {
        this.id = id;
        this.connections = {
            'prev': connections_prev,
            'next': connections_next
        }
        this.lvl = lvl;
    }

    //#region [GET-SET]
    set door(obj) {
        this.#door = obj;
    }
    get door() {
        return this.#door;
    }
    //#endregion
}

class Path {
    static rooms = []; 

    /**
     * Method to add a room to Path.
     * 
     * @param {Room} room_instance - instance of class Room
     */
     static addRoom(room_instance) {
        Path.rooms.push(room_instance);
    }

    /**
     * Method to remove one room with a given ID.
     * 
     * @param {string} room_id - ID of the room to be removed of the Path
     */
    static removeRoomById(room_id) {
        Path.rooms = Path.rooms.filter(room => room.id != room_id);
    }

    /**
     * Method to find a room with a given ID.
     * 
     * @param {string} room_id - ID of the room to be found in path
     * @returns {Room} returns the room of the given ID or null in case there's no room with that ID
     */
    static getRoomById(room_id) {
        return Path.rooms.filter(room => room.id === room_id)[0] || null;
    }

    /**
     * Method to find the rooms with a given level.
     * 
     * @param {number} room_lvl - lvl of rooms to be found in path
     * @returns an array with the rooms of the given level or null in case there's no room with that level
     */
    static getRoomsByLvl(room_lvl) {
        return Path.rooms.filter(room => room.lvl == room_lvl) || null;
    }

    /**
     * Method to create a path with a given number of rooms, maximum of rooms per floor and 
     * if all floors have the same maximum number of rooms. 
     * The IDs of the rooms and the levels of the floors will be initiated in 1.
     * 
     * @param {integer} qnt_rooms - quantity of rooms on the path
     * @param {integer} max_rooms - maximum number of rooms in a floor of the path
     * @param {boolean} qnt_fixed - if not given will be 'true' and the floors will have the same 
     *                              maximum number of connections that was given while is possible
     * @returns quantity of floors/levels are in path
     */
    static createPath(qnt_rooms, max_rooms, qnt_fixed='true') {
        Path.rooms = [];
        let lvls = [];

        const getRandom = max => max <= 1? 1: Math.floor(Math.random() * (max - 1) + 1);
        const validNumber = (array, number) => {
            if(number && !(array.filter(num => num == number)).length)
                return true;
            return false;
        }

        if(qnt_fixed) {
            let remainder = qnt_rooms%max_rooms;
            if(!remainder) {
                for(let floor=0; floor < qnt_rooms/max_rooms; floor++) {
                    let lvl = [];
                    for(let room=1; room < max_rooms+1; room++) {
                        lvl.push((floor*max_rooms) + room);
                    }
                    lvls.push(lvl);
                }
            }
            else {
                let connection = parseInt(qnt_rooms/max_rooms);
                for(let floor=0; floor < connection; floor++) {
                    let lvl = [];
                    for(let room=1; room < max_rooms+1; room++) {
                        lvl.push((floor*max_rooms) + room);
                    }
                    lvls.push(lvl);
                }
                let lvl = [];
                let room = connection*max_rooms + 1;
                for(let r=0; r < remainder; r++){
                    lvl.push(room + r);
                }
                lvls.push(lvl);
            }
        }
        else {
            for(let room=1; room < qnt_rooms+1; room++) {
                let floor_rooms = getRandom(qnt_rooms - room);
                if(floor_rooms > max_rooms)
                    floor_rooms = max_rooms;
                let lvl = [];
                for(var r=0; r < floor_rooms; r++) {
                    lvl.push(room);
                    if(r + 1 != floor_rooms)
                        room++;
                }
                lvls.push(lvl);
            }
        }

        let new_room;
        let id = 0;

        for(let lvl in lvls) {
            lvl = parseInt(lvl);
            let disconnected = false;
            let intersection = false;
            for(let room=1; room < lvls[lvl].length+1; room++) {
                let next_lvl = lvls[lvl + 1];
                let connections_next = [];
                let connection = room-1;
                id++;

                if(next_lvl) {
                    if(next_lvl.length > lvls[lvl].length) {
                        let connections = parseInt(next_lvl.length/lvls[lvl].length);
                        let remainder = next_lvl.length%lvls[lvl].length;

                        for(let c=0; c < connections; c++) {
                            connections_next.push(next_lvl[connection]);
                            connection++;
                        }
                        if(remainder)
                            if(Math.random() < 0.5) {
                                connections_next.push(next_lvl[connection]);
                                connection++;
                                remainder--;
                            }
                        if(connection+1 == next_lvl.length && validNumber(connections_next, next_lvl[connection + 1]))
                            connections_next.push(next_lvl[connection + 1]);

                    }
                    else if(next_lvl.length == lvls[lvl].length){
                        connections_next.push(next_lvl[connection]);
                        if(Math.random() < 0.5 && validNumber(connections_next, next_lvl[connection - 1]) && !intersection)
                            connections_next.push(next_lvl[connection - 1]);
                        if(Math.random() < 0.5 && validNumber(connections_next, next_lvl[connection + 1])) {
                            connections_next.push(next_lvl[connection + 1]);
                            intersection = true;
                        }
                        else
                            intersection = false;
                    }
                    else {
                        let connections = next_lvl.length;

                        if(disconnected && validNumber(connections_next, next_lvl[connection - 1])) {
                            connections_next.push(next_lvl[connection - 1]);
                            disconnected = false;
                        }
                        
                        if(next_lvl.length == 1 && validNumber(connections_next, next_lvl[0])) {
                            connections_next.push(next_lvl[0]);
                        }
                        else if(connections && Math.random() < 0.5 && validNumber(connections_next, next_lvl[connection])) {
                            connections_next.push(next_lvl[connection]);
                            connections--;
                            if(Math.random() < 0.5 && validNumber(connections_next, next_lvl[connection + 1])) {
                                connections_next.push(next_lvl[connection + 1]);
                                intersection = true;
                            }
                            else {
                                if(Math.random() < 0.5 && validNumber(connections_next, next_lvl[connection - 1]) && !intersection)
                                    connections_next.push(next_lvl[connection - 1]);
                                intersection = false;
                            }
                        }
                        else
                            disconnected = true;
                    }
                }

                let prev_lvl = lvls[lvl - 1];
                let connections_prev = [];
                if(prev_lvl) {
                    prev_lvl = Path.getRoomsByLvl(lvl);
                    for(let r in prev_lvl) {
                        r = parseInt(r);
                        if(prev_lvl[r].connections.next) {
                            for(let i in prev_lvl[r].connections.next) {
                                i = parseInt(i);
                                if(prev_lvl[r].connections.next[i] == id && validNumber(connections_prev, prev_lvl[r].id)) 
                                    connections_prev.push(prev_lvl[r].id);
                            }
                        }
                    }
                }
                new_room = new Room(id, connections_prev, connections_next, lvl+1);
                Path.addRoom(new_room);
            }
        };

        return lvls.length;
    }
}