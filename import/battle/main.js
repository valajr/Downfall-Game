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

function changeTurn(team) {
    let escape = document.querySelector('#escape');
    let attack = document.querySelector('#attack');
    let auto_atk = document.querySelector('#auto-atk');

    if(team === 'allies') {
        escape.disabled = false;
        attack.disabled = false;
        auto_atk.disabled = false;
        Battle.updateTurn('allies');
    }
    else {
        escape.disabled = true;
        attack.disabled = true;
        auto_atk.disabled = true;
        Battle.updateTurn('enemies');
    }
}

function enemyTurn() {
    changeTurn('enemies');
    for(let enemy=0; enemy<Battle.enemies.length; enemy++) {
        if(Battle.enemies[enemy].life && Battle.end_game === null) {
            Battle.autoAttack(Battle.enemies[enemy]);
            updateLifes();
        }
    }
    changeTurn('allies');
}

function backButton() {
    let back = document.querySelector('#back');
    back.setAttribute('hidden', true);
    
    let escape = document.querySelector('#escape');
    let attack = document.querySelector('#attack');
    let auto_atk = document.querySelector('#auto-atk');
    escape.innerHTML = 'Escape';
    escape.onclick = escapeButton;
    attack.innerHTML = 'Attack';
    attack.onclick = atkButton;
    attack.removeAttribute('hidden', true);
    auto_atk.innerHTML = 'Auto attack';
    auto_atk.onclick = autoButton;
    auto_atk.removeAttribute('hidden', true);
}

function escapeButton() {
    Battle.checkEscape();
    if(Battle.end_game === null) {
        alert('Failed to run away!');
        Battle.updateTurn();
    }
}

function atkButton() {
    let back = document.querySelector('#back');
    back.removeAttribute('hidden');
    
    let enemies = [];
    let number_enemies = Battle.enemies.length;
    enemies.push(document.querySelector('#escape'));
    enemies.push(document.querySelector('#attack'));
    enemies.push(document.querySelector('#auto-atk'));
    for(let e=0; e< number_enemies; e++) {
        enemies[e].innerHTML = Battle.enemies[e].name;
        enemies[e].onclick = () => {
            if(Player.arrows > 0) {
                Battle.normalAttack(Battle.allies[0], Battle.enemies[e]);
                updateLifes();
                Player.arrows -= 1;
                updateInfoBar();
                if(!Battle.end_game)
                    enemyTurn();
            }
            else {
                alert('No arrows! Try to escape!');
            }
            backButton();
        };
    }
    if(number_enemies < 3) {
        enemies[2].setAttribute('hidden', true);
        if(number_enemies < 2)
            enemies[1].setAttribute('hidden', true);
    }
}

function autoButton() {
    if(Player.arrows > 0) {
        Battle.autoAttack(Battle.allies[0]);
        updateLifes();
        Player.arrows -= 1;
        updateInfoBar();
        if(!Battle.end_game)
            enemyTurn();
    }
    else
        alert('No arrows! Try to escape!');
}

function initializeBattle(battle) {
    battle.innerHTML = '';
    Battle.end_game = null;

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

    let back = createHTML('button', 'back', 'button', '<< Back', backButton);
    let escape = createHTML('button', 'escape', 'button', 'Escape', escapeButton);
    let attack = createHTML('button', 'attack', 'button', 'Attack', atkButton);
    let auto_attack = createHTML('button', 'auto-atk', 'button', 'Auto attack', autoButton);

    back.setAttribute('hidden', true);

    battle.appendChild(back);
    battle.appendChild(escape);
    battle.appendChild(attack);
    battle.appendChild(auto_attack);
}

function getLoot(lvl) {
    Player.arrows += lvl;
    Player.gold += 4*lvl;
}

Battle.win = () => {
    setTimeout(() => {
        alert("You win the battle!");

        Battle.enemies = [];
        let lvl = Path.getRoomById(last_battle);
        lvl = lvl.lvl;
        getLoot(lvl);
        updateLevel(last_battle, lvl);
    }, 1000);
}

Battle.lose = () => {
    alert("You lose the battle!\nTry again in another life.");

    Battle.enemies = [];
    window.location.reload();
}

Battle.escape = () => {
    alert("Escaped!")

    Battle.enemies = [];
    id = revealed_ids[revealed_ids.length - 1];
    let lvl = Path.getRoomById(id).lvl;
    updateLevel(id, lvl);
}