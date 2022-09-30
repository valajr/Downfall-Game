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

function initializeBattle(battle) {
    battle.innerHTML = '';

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

    battle.appendChild(createSimpleCardHTML('player', 'Player', 'ally libcards-reveal-card', BATTLE.player_img));
    for(let e=0; e<Battle.enemies.length; e++) {
        battle.appendChild(createSimpleCardHTML(`enemy-0${e+1}`, Battle.enemies[e].name, 
        `enemy-${enemies_type[e]} libcards-reveal-card`, enemies_img[e]));
    }
}