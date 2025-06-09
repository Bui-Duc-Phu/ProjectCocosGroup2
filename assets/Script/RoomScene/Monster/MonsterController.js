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
            type: cc.Boolean,
            visible: false,
        },
        currentLevel: {
            default: 1,
            type: cc.Integer,
            visible: false,
        },
        spawnedCount: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        totalMonstersThisWave: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        monsterTypeCounts: {
            default: {},
            visible: false,
        },
        spawnInterval: {
            default: 1.5,
            type: cc.Float,
            tooltip: "Time between monster spawns in seconds"
        },
        spriteFrameAsset: {
            default: null,
            type: require('SpriteFrameAsset')
        }
    },

    onLoad() {
        this.registerEvent();
        this.startWave();
    },
    onDestroy(){
        this.unregisterEvent();
    },

    startWave() {
        this.spawnedCount = 0;
        this.totalMonstersThisWave = this.calculateMonstersForLevel(this.currentLevel);
        this.calculateMonsterTypeCounts();
        this.spawnNextMonster();
    },

    calculateMonsterTypeCounts() {
        const probabilities = this.calculateTypeProbabilities(this.currentLevel);
        this.monsterTypeCounts = {};
        for (const [type, probability] of Object.entries(probabilities)) {
            this.monsterTypeCounts[type] = Math.round(this.totalMonstersThisWave * probability);
        }

        const total = Object.values(this.monsterTypeCounts).reduce((sum, count) => sum + count, 0);
        if (total !== this.totalMonstersThisWave) {
            const diff = this.totalMonstersThisWave - total;
            const mostCommonType = Object.entries(probabilities).reduce((a, b) => a[1] > b[1] ? a : b)[0];
            this.monsterTypeCounts[mostCommonType] += diff;
        }
    },
    spawnNextMonster() {
        if (this.spawnedCount >= this.totalMonstersThisWave) {
            return;
        }
        this.spawnMonster();
        this.spawnedCount++;
        if (this.spawnedCount < this.totalMonstersThisWave) {
            this.scheduleOnce(() => {
                this.spawnNextMonster();
            }, this.spawnInterval);
        }
    },
    calculateMonstersForLevel(level) {
        return Math.min(5 + level, 50);
    },
    spawnMonster() {
        const monsterType = this.selectMonsterTypeForSpawn();
        this.initMonsterByType(monsterType);
    },
    selectMonsterTypeForSpawn() {
        if (this.currentLevel % 5 === 0 && this.shouldSpawnBoss(this.spawnedCount)) {
            return GameConfig.MONSTER.TYPE.BOSS;
        }
        for (const [type, count] of Object.entries(this.monsterTypeCounts)) {
            if (count > 0) {
                this.monsterTypeCounts[type]--;
                return GameConfig.MONSTER.TYPE[type];
            }
        }
        return GameConfig.MONSTER.TYPE.DOG;
    },
    shouldSpawnBoss(spawnIndex) {
        const totalMonsters = this.totalMonstersThisWave;
        const bossPosition = Math.floor(Math.random() * totalMonsters);
        return spawnIndex === bossPosition;
    },
    calculateTypeProbabilities(level) {
        const probabilities = {};
        let dogProb = Math.max(0.4, 0.8 - (level * 0.008));
        let infernoDogProb = Math.min(0.4, 0.15 + (level * 0.005));
        let dragonProb = 0;

        if (level >= 10) {
            dragonProb = Math.min(0.2, (level - 10) * 0.004 + 0.05);
            const totalOthers = dogProb + infernoDogProb;
            const adjustment = dragonProb / totalOthers;
            dogProb *= (1 - adjustment);
            infernoDogProb *= (1 - adjustment);
        }

        const total = dogProb + infernoDogProb + dragonProb;
        probabilities.DOG = dogProb / total;
        probabilities.INFERNO_DOG = infernoDogProb / total;
        if (level >= 10) {
            probabilities.DRAGON = dragonProb / total;
        }
        return probabilities;
    },

    initMonsterByType(type) {
        const position = this.genInitPosison();
        const id = this.genIDMonster();
        const baseStats = this.calculateBaseStats(this.currentLevel);
        const hp = baseStats.hp * type.COEFFICIENT_HP;
        const damage = baseStats.damage * type.COEFFICIENT_DAMAGE;
        const durationMove = this.calculateMoveDuration(type, this.currentLevel);
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
            level: this.currentLevel,
            spriteFrame
        });
        this.node.addChild(monster);
        this.positionInit(monster, position);
        monsterItem.onMove();
        this.listChar.push(monsterItem);
    },
    getSpriteFrameByType(type) {
        return this.spriteFrameAsset.getSpriteFramByType(type);
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
        if (this.listChar.length === 0 && this.spawnedCount >= this.totalMonstersThisWave) {
            this.onWaveComplete();
        }
    },
    onWaveComplete() {
        this.scheduleOnce(() => {
            this.onNextWave();
        }, 3);
    },
    onNextWave() {
        this.currentLevel++;
        this.startWave();
    },
    getWaveStatus() {
        return {
            currentLevel: this.currentLevel,
            spawnedCount: this.spawnedCount,
            totalMonstersThisWave: this.totalMonstersThisWave,
            aliveMonsters: this.listChar.length,
            probabilities: this.calculateTypeProbabilities(this.currentLevel)
        };
    },
    startSpecificWave(level) {
        this.currentLevel = level;
        this.listChar.forEach(monster => {
            if (monster.node && cc.isValid(monster.node)) {
                monster.onDie();
            }
        });
        this.listChar = [];
        this.startWave();
    },
    registerEvent() {
        this.eventMap = new Map([
            [EventKey.MONSTER.ON_HIT, this.onMonsterHit.bind(this)],
            [EventKey.MONSTER.ON_ULTIMATE_HIT, this.onUltimateHit.bind(this)],
            [EventKey.MONSTER.ON_DIE, this.onMonsterDie.bind(this)],
        ]);
        this.eventMap.forEach((handler, key) => {
            Emitter.registerEvent(key, handler);
        });
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
        monsters.forEach((monster,index) => {
            this.takeDamage(monster, bullet);
        });
    },
    takeDamage(monster, bullet) {
        monster.hp -= bullet.damage;
    },
    
});