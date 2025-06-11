const GameConfig = require("GameConfig");
const Emitter = require("Emitter");
const EventKey = require("EventKey");

cc.Class({
    extends: cc.Component,

    properties: {
        prefabMonster: {
            default: null,
            type: cc.Prefab
        },
        listChar: {
            default: [],
            type: [require('MonsterItem')],
            visible: false,
        },
        isWinLevel: {
            default: true,
            visible: false,
        },
        isGameOver: {
            default: false,
            visible: false,
        },
        spawnedCount: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        currentWaveData: {
            default: null,
            visible: false,
        },
        gameAsset: {
            default: null,
            type: require('GameAsset')
        },
        sumGold: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        sumMonsterKill: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
    },
    onLoad() {
        this.registerEvent();
    },
    onDestroy() {
        this.unregisterEvent();
    },
    onStartWave(data) {
        this.spawnedCount = 0;
        this.currentWaveData = data;
        this.spawnNextMonster(data);
        this.totalMonsters = data.totalMonsters;
    },
    spawnNextMonster(waveData) {
        if (this.spawnedCount >= waveData.totalMonsters) {
            return;
        }
        const monsterType = this.selectMonsterTypeForSpawn(waveData);
        this.spawnMonster(monsterType, waveData.level);
        this.spawnedCount++;
        if (this.spawnedCount < waveData.totalMonsters && !this.isGameOver) {
            this.scheduleOnce(() => {
                this.spawnNextMonster(waveData);
            }, waveData.spawnInterval);
        }
    },

    selectMonsterTypeForSpawn(waveData) {
        if (waveData.level % 5 === 0 && this.shouldSpawnBoss(this.spawnedCount, waveData.totalMonsters)) {
            return GameConfig.MONSTER.TYPE.BOSS;
        }
        for (const [type, count] of Object.entries(waveData.monsterTypeCounts)) {
            if (count > 0) {
                waveData.monsterTypeCounts[type]--;
                return GameConfig.MONSTER.TYPE[type];
            }
        }
        return GameConfig.MONSTER.TYPE.DOG;
    },
    shouldSpawnBoss(spawnIndex, totalMonsters) {
        const bossPosition = Math.floor(Math.random() * totalMonsters);
        return spawnIndex === bossPosition;
    },

    spawnMonster(type, level) {
        const position = this.genInitPosison();
        const id = this.genIDMonster();
        const baseStats = this.calculateBaseStats(level);
        const hp = baseStats.hp * type.COEFFICIENT_HP;
        const damage = baseStats.damage * type.COEFFICIENT_DAMAGE;
        const durationMove = this.calculateMoveDuration(type, level);
        const gold = baseStats.gold * type.COEFFICIENT_GOLD;
        const spriteFrame = this.getSpriteFrameByType(type.NAME);

        const monster = cc.instantiate(this.prefabMonster);
        const monsterItem = monster.getComponent(require('Monster'));
        monsterItem.init({
            id,
            type,
            hp,
            damage,
            durationMove,
            gold,
            level: level,
            spriteFrame
        });

        this.node.addChild(monster);
        this.positionInit(monster, position);
        monsterItem.onMove();
        this.listChar.push(monsterItem);
    },

    getSpriteFrameByType(type) {
        return this.gameAsset.getSpriteFramByType(type);
    },

    calculateBaseStats(level) {
        const levelMultiplier = 1 + (level - 1) * 0.15 + Math.pow(level - 1, 1.2) * 0.02;
        return {
            hp: GameConfig.MONSTER.HP_BASE * levelMultiplier,
            damage: GameConfig.MONSTER.DAMAGE_BASE * levelMultiplier,
            gold: GameConfig.MONSTER.GOLD_BASE * levelMultiplier
        };
    },

    calculateMoveDuration(type, level) {
        const speedBonus = Math.min(2, level * 0.05);
        const adjustedDuration = Math.max(3, type.DURATION_MOVE - speedBonus);
        return adjustedDuration;
    },

    positionInit(monster, worldPos) {
        const localPos = this.node.convertToNodeSpaceAR(worldPos);
        monster.setPosition(localPos);
    },

    genInitPosison() {
        const x = GameConfig.MONSTER.INIT_LOCATION.X;
        const listY = GameConfig.MONSTER.INIT_LOCATION.Y;
        const y = listY[Math.floor(Math.random() * listY.length)];
        return new cc.Vec2(x, y);
    },

    genIDMonster() {
        return Date.now() + Math.random();
    },

    onMonsterDie(monster) {
        monster.onDie();
        const index = this.listChar.indexOf(monster);
        if (index !== -1) {
            this.listChar.splice(index, 1);
        }
        if (this.listChar.length === 0 && !this.isGameOver && this.totalMonsters === this.spawnedCount) {
            Emitter.emit(EventKey.WAVE.WAVE_COMPLETE);
        }
    },

    registerEvent() {
        this.eventMap = new Map([
            [EventKey.WAVE.START_WAVE, this.onStartWave.bind(this)],
            [EventKey.MONSTER.ON_HIT, this.onMonsterHit.bind(this)],
            [EventKey.MONSTER.ON_ULTIMATE_HIT, this.onUltimateHit.bind(this)],
            [EventKey.MONSTER.ON_BOMB_HIT, this.onBombHit.bind(this)],
            [EventKey.MONSTER.ON_DIE, this.onMonsterDie.bind(this)],
            [EventKey.ROOM.GAME_OVER, this.onGameOver.bind(this)],
        ]);
        this.eventMap.forEach((handler, key) => {
            Emitter.registerEvent(key, handler);
        });
    },
    onGameOver() {
        this.isGameOver = true;
        this.listChar.forEach((monster) => {
            monster.onDie();
        });
        this.listChar = [];
        Emitter.emit(EventKey.ROOM.SUMMARY_GAME, this.sumGold, this.sumMonsterKill);
    },
    unregisterEvent() {
        if (!this.eventMap) return;
        this.eventMap.forEach((handler, key) => {
            Emitter.removeEvent(key, handler);
        });
        this.eventMap.clear();
    },
    onMonsterHit(monster, bullet) {
        this.takeDamage(monster, bullet);
    },
    onUltimateHit(monsters, bullet) {
        monsters.forEach((monster) => {
            this.takeDamage(monster, bullet);
        });
    },
    onBombHit(monsters, bullet) {
        monsters.forEach((monster) => {
            this.takeDamage(monster, bullet);
        });
    },
    takeDamage(monster, bullet) {
        monster.hp -= bullet.damage;
        if(monster.hp <= 0) {
            this.sumGold += monster.gold;
            this.sumMonsterKill++;
        }
    }

});