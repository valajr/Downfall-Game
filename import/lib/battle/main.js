/**
 * Char base.
 * 
 */
class Char {
    #skill_function;

    /**
     * Constructor of a character.
     * 
     * @param {string} name - name of character
     * @param {number} life - life of character
     * @param {number} max_life - maximum of life of character
     * @param {number} attack - attack of character
     * @param {number} defense - defense of char is optional, if was not given will be 0
     * @param {number} initiative - initiative of char is optional, if was not given will be 100
     */
    constructor(name, life, max_life, attack, defense=0, initiative=100) {
        this.name = name;
        this.life = life;
        this.max_life = max_life;
        this.attack = attack;
        this.defense = defense;
        this.initiative = initiative;
    }

    //#region [GET-SET]
    set skill(f) {
        this.#skill_function = f;
    }
    get skill() {
        return this.#skill_function;
    }
    //#endregion

    /**
     * Method to change the maximum life of a character.
     * 
     * @param {number} ml - quantity of maximum life to be modified
     */
    changeMaxLife(ml) {
        this.life += ml;
        this.max_life += ml;
    }
}

/**
 * Battle bases. The party has a 100% chance of escape, if wasn't modified.
 * 
 */
class Battle {
    static allies = [];
    static enemies = [];
    static turn = 'allies';
    static escape_chance = 100;
    static end_game = null;

    /**
     * Method to update/change turn of battle.
     * 
     * @param {string} team - team will be the turn next, if not given will change based on the last turn
     */
    static updateTurn(team=null) {
        Battle.checkEnd();

        if(team !== null)
            Battle.turn = team;
        else
            Battle.turn = Battle.turn == 'allies'? 'enemies': 'allies';
    }

    /**
     * Method to add ally based on your initiative on allies.
     * 
     * @param {Char} ally - ally to be added to allies
     */
    static addAlly(ally) {
        if(!Battle.allies.length)
            Battle.allies.push(ally);
        else {
            let prev = 0;
            for(let a in Battle.allies) {
                a = parseInt(a);
                if(Battle.allies[a].initiative > ally.initiative)
                    prev = a + 1;
            }
            Battle.allies.splice(prev, 0, ally);
        }
    }

    /**
     * Method to add enemy based on your initiative on enemies.
     * 
     * @param {Char} enemy - enemy to be added to enemies
     */
    static addEnemy(enemy) {
        if(!Battle.enemies.length)
            Battle.enemies.push(enemy);
        else {
            let prev = 0;
            for(let e in Battle.enemies) {
                e = parseInt(e);
                if(Battle.enemies[e].initiative > enemy.initiative)
                    prev = e + 1;
            }
            Battle.enemies.splice(prev, 0, enemy);
        }
    }

    /**
     * Method to remove ally from allies.
     * 
     * @param {Char} ally - ally to be removed from allies
     */
    static removeAlly(ally) {
        for(let a in Battle.allies) {
            a = parseInt(a);
            if(Battle.allies[a] == ally)
                Battle.allies.splice(a, 1);
        }
    }
 
    /**
     * Method to remove enemy from enemies.
     * 
     * @param {Char} enemy - enemy to be removed from enemies
     */
    static removeEnemy(enemy) {
        for(let e in Battle.enemies) {
            e = parseInt(e);
            if(Battle.enemies[e] == enemy)
                Battle.enemies.splice(e, 1);
        }
    }

    /**
     * Method to remove completely all enemy from enemies.
     * 
     */
    static removeEnemies() {
        for(let e in Battle.enemies) {
            e = parseInt(e);
            this.removeEnemy(Battle.enemies[e]);
        }
    }
    
    /**
     * Method to deliver a normal attack of a character to another.
     * 
     * @param {Char} aggressor - character that will attack
     * @param {Char} victim - character that will receive the attack
     * @returns 0 in case the attack wasn't successful (defense of victim higher than attack of aggressor)
     */
    static normalAttack(aggressor, victim) {
        if(aggressor.attack > victim.defense && victim.life > 0) {
            victim.life -= aggressor.attack - victim.defense;
            if(victim.life < 0)
                victim.life = 0;
            if(Battle.turn === 'allies')
                Battle.checkLife('enemies');
            else
                Battle.checkLife('allies');
            Battle.checkEnd();
        }
    }

    /**
     * Method to attack the other team based on the one with more life, defense, attack or initiative.
     * Will be choosen one attribute randomly.
     * 
     * @param {Char} aggressor - character that will attack
     */
    static autoAttack(aggressor) {
        let target = 0;
        let target_team = [];
        let choice = Math.random();

        if(choice < 0.25) { // More Life
            if(Battle.turn === 'allies') {
                for(let e in Battle.enemies) {
                    e = parseInt(e);
                    if(Battle.enemies[e].life > 0)
                        target_team.push(Battle.enemies[e].life);
                }
                target_team.sort();
                for(let e in Battle.enemies) {
                    e = parseInt(e);
                    if(Battle.enemies[e].life == target_team[0]) {
                        target = e;
                        break;
                    }
                }
                Battle.normalAttack(aggressor, Battle.enemies[target]);
            }
            else {
                for(let a in Battle.allies) {
                    a = parseInt(a);
                    if(Battle.allies[a].life > 0)
                        target_team.push(Battle.allies[a].life);
                }
                target_team.sort();
                for(let a in Battle.allies) {
                    a = parseInt(a);
                    if(Battle.allies[a].life == target_team[0]) {
                        target = a;
                        break;
                    }
                }
                Battle.normalAttack(aggressor, Battle.allies[target]);
            }
        }
        else if(choice < 0.5) { // More Defense
            if(Battle.turn === 'allies') {
                for(let e in Battle.enemies) {
                    e = parseInt(e);
                    if(Battle.enemies[e].life > 0)
                        target_team.push(Battle.enemies[e].defense);
                }
                target_team.sort();
                for(let e in Battle.enemies) {
                    e = parseInt(e);
                    if(Battle.enemies[e].defense == target_team[0]) {
                        target = e;
                        break;
                    }
                }
                Battle.normalAttack(aggressor, Battle.enemies[target]);
            }
            else {
                for(let a in Battle.allies) {
                    a = parseInt(a);
                    if(Battle.allies[a].life > 0)
                        target_team.push(Battle.allies[a].defense);
                }
                target_team.sort();
                for(let a in Battle.allies) {
                    a = parseInt(a);
                    if(Battle.allies[a].defense == target_team[0]) {
                        target = a;
                        break;
                    }
                }
                Battle.normalAttack(aggressor, Battle.allies[target]);
            }
        }
        else if(choice < 0.75) { // More Attack
            if(Battle.turn === 'allies') {
                for(let e in Battle.enemies) {
                    e = parseInt(e);
                    if(Battle.enemies[e].life > 0)
                        target_team.push(Battle.enemies[e].attack);
                }
                target_team.sort();
                for(let e in Battle.enemies) {
                    e = parseInt(e);
                    if(Battle.enemies[e].attack == target_team[0]) {
                        target = e;
                        break;
                    }
                }
                Battle.normalAttack(aggressor, Battle.enemies[target]);
            }
            else {
                for(let a in Battle.allies) {
                    a = parseInt(a);
                    if(Battle.allies[a].life > 0)
                        target_team.push(Battle.allies[a].attack);
                }
                target_team.sort();
                for(let a in Battle.allies) {
                    a = parseInt(a);
                    if(Battle.allies[a].attack == target_team[0]) {
                        target = a;
                        break;
                    }
                }
                Battle.normalAttack(aggressor, Battle.allies[target]);
            }
        }
        else { // More Initiative
            if(Battle.turn === 'allies') {
                for(let e in Battle.enemies) {
                    e = parseInt(e);
                    if(Battle.enemies[e].life > 0)
                        target_team.push(Battle.enemies[e].initiative);
                }
                target_team.sort();
                for(let e in Battle.enemies) {
                    e = parseInt(e);
                    if(Battle.enemies[e].initiative == target_team[0]) {
                        target = e;
                        break;
                    }
                }
                Battle.normalAttack(aggressor, Battle.enemies[target]);
            }
            else {
                for(let a in Battle.allies) {
                    a = parseInt(a);
                    if(Battle.allies[a].life > 0)
                        target_team.push(Battle.allies[a].initiative);
                }
                target_team.sort();
                for(let a in Battle.allies) {
                    a = parseInt(a);
                    if(Battle.allies[a].initiative == target_team[0]) {
                        target = a;
                        break;
                    }
                }
                Battle.normalAttack(aggressor, Battle.allies[target]);
            }
        }
    }

    /**
     * Method to sum the life from a team (allies or enemies) and flag if one team has win the battle.
     * 
     * @param {string} team - team to be sum the life
     */
    static checkLife(team) {
        let total_life = 0;
        if(team == 'allies') {
            for(let a in Battle.allies) {
                a = parseInt(a);
                total_life += Battle.allies[a].life;
            }
            if(total_life <= 0)
                Battle.end_game = -1;
        }
        else {
            for(let e in Battle.enemies) {
                e = parseInt(e);
                total_life += Battle.enemies[e].life;
            }
            if(total_life <= 0)
                Battle.end_game = 1;
        }
    }

    /**
     * Method to verify if the ally team has escaped successfully.
     * 
     */
    static checkEscape() {
        let result = Battle.escape_chance - (Math.random() * 100);

        if(result > 0)
            Battle.end_game = 0;

        Battle.checkEnd();
    }

    /**
     * Method to check if the game has ended, by win, lose or escape condition.
     * 
     */
    static checkEnd() {
        if(Battle.end_game !== null) {
            if(Battle.end_game == 1)
                Battle.win();
            else if(Battle.end_game == -1)
                Battle.lose();
            else if(Battle.end_game == 0)
                Battle.escape();
        }
    }

    /**
     * Method to be replaced with the win result.
     * 
     */
    static win() { console.log("Winner!") }

    /**
     * Method to be replaced with the lose result.
     * 
     */
    static lose() { console.log("Loser!") }

    /**
     * Method to be replaced with the escape result.
     * 
     */
    static escape() { console.log("Escaped!") }
}