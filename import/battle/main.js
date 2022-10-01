const BATTLE = {
    player_img: '',
    barbarian_img: '',
    zombie_img: '',
    skeleton_img: '',
    ghost_img: '',
    demon_img: ''
}

const NAMES = {
    'barbarian': ['Thorfinn', 'Thors', 'Askeladd', 'Bjorn', 'Canute', 'Ragnar', 'Helga', 'Ylva'],
    'zombie': ['Sakura', 'Saki', 'Ai', 'Junko', 'Tae', 'Yuugiri', 'Lily', 'Romero', 'Koutaro'],
    'skeleton': ['Brook', 'Ainz', 'Ooal', 'Gown', 'Momonga', 'Keldor'],
    'ghost': ['Einstein', 'Newton', 'Hawkings', 'Tesla', 'Dali', 'Da Vinci'],
    'demon': ['Asmodeus', 'Leviathan', 'Azazel', 'Beelzebub']
}

function verifyName(tribe, enemy) {
    for(let name in tribe) {
        if(tribe[name] == enemy.name)
            return true;
    }
    return false;
}

function getLife(id) {
    let life = document.querySelectorAll(`#${id} > div > span`)

    return life[1];
}

function updateLifes() {
    let player = getLife('player'); 
    player.innerHTML = `${Battle.allies[0].life}/${Battle.allies[0].max_life}`;

    for(let e=0; e<Battle.enemies.length; e++) {
        let enemy = getLife(`enemy-0${e+1}`);
        enemy.innerHTML = `${Battle.enemies[e].life}/${Battle.enemies[e].max_life}`;
    }
}

function backButton() {

}

function escapeButton() {
    Battle.checkEscape();
    if(Battle.end_game === null) {
        alert('Failed to run away!');
        Battle.updateTurn();
    }
}

function atkButton() {

}

function autoButton() {
    if(Player.arrows > 0) {
        Battle.autoAttack(Battle.allies[0]);
        updateLifes();
        Player.arrows--;
    }
    else
        alert('No arrows! Try to escape!');
}

function confirmButton() {

}

function initializeBattle(battle) {
    battle.innerHTML = '';
    Battle.end_game = null;
    Battle.removeEnemies();

    let enemies_img = [];
    let enemies_type = [];
    for(let enemy=0; enemy<Battle.enemies.length; enemy++) {
        let barbarian = verifyName(NAMES.barbarian, Battle.enemies[enemy]);
        if(barbarian) {
            enemies_img.push(BATTLE.barbarian_img);
            enemies_type.push('barbarian');
        }
        else {
            let zombie = verifyName(NAMES.zombie, Battle.enemies[enemy]);
            if(zombie) {
                enemies_img.push(BATTLE.zombie_img);
                enemies_type.push('zombie');
            }
            else {
                let skeleton = verifyName(NAMES.skeleton, Battle.enemies[enemy]);
                if(skeleton) {
                    enemies_img.push(BATTLE.skeleton_img);
                    enemies_type.push('skeleton');
                }
                else {
                    let ghost = verifyName(NAMES.ghost, Battle.enemies[enemy]);
                    if(ghost) {
                        enemies_img.push(BATTLE.ghost_img);
                        enemies_type.push('ghost');
                    }
                    else {
                        enemies_img.push(BATTLE.demon_img);
                        enemies_type.push('demon');
                    }
                }
            }
        }
    }

    battle.appendChild(createSimpleCardHTML('player', 'Player', 'ally libcards-reveal-card', 
    BATTLE.player_img, `${Battle.allies[0].life}/${Battle.allies[0].max_life}`));
    for(let e=0; e<Battle.enemies.length; e++) {
        battle.appendChild(createSimpleCardHTML(`enemy-0${e+1}`, Battle.enemies[e].name, 
        `enemy-${enemies_type[e]} libcards-reveal-card`, enemies_img[e], 
        `${Battle.enemies[e].life}/${Battle.enemies[e].max_life}`));
    }

    let back = createButton('back', 'button', '<< Back', backButton);
    let escape = createButton('escape', 'button', 'Escape', escapeButton);
    let attack = createButton('attack', 'button', 'Attack', atkButton);
    let auto_attack = createButton('auto-atk', 'button', 'Auto attack', autoButton);
    let confirm = createButton('confirm', 'button', 'Confirm', confirmButton);

    back.setAttribute('hidden', true);
    confirm.setAttribute('hidden', true);

    battle.appendChild(back);
    battle.appendChild(escape);
    battle.appendChild(attack);
    battle.appendChild(auto_attack);
    battle.appendChild(confirm);
}

Battle.win = () => {
    setTimeout(() => {
        // get loot (random number of arrows and some gold)

        alert("You win the battle!");

        let lvl = Path.getRoomById(last_battle);
        lvl = lvl.lvl;
        updateLevel(last_battle, lvl);
    }, 1000);
}

Battle.lose = () => {

}

Battle.escape = () => {
    alert("Escaped!")

    let id = revealed_ids[revealed_ids.length-1];
    let lvl = Path.getRoomById(id);
    lvl = lvl.lvl;
    updateLevel(id, lvl);
}