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
        this.resetWaveState(data);
        this.spawnNextMonster(data);
    },
    resetWaveState(data) {
        this.spawnedCount = 0;
        this.currentWaveData = data;
        this.totalMonsters = data.totalMonsters;
    },
    spawnNextMonster(waveData) {
        if (this.shouldStopSpawning(waveData)) {
            return;
        }
        const monsterType = this.selectMonsterTypeForSpawn(waveData);
        this.spawnMonster(monsterType, waveData.level);
        this.incrementSpawnCount();
        this.scheduleNextSpawn(waveData);
    },
    shouldStopSpawning(waveData) {
        return this.spawnedCount >= waveData.totalMonsters;
    },
    incrementSpawnCount() {
        this.spawnedCount++;
    },
    scheduleNextSpawn(waveData) {
        if (this.spawnedCount < waveData.totalMonsters && !this.isGameOver) {
            this.scheduleOnce(() => {
                this.spawnNextMonster(waveData);
            }, waveData.spawnInterval);
        }
    },
    selectMonsterTypeForSpawn(waveData) {
        if (this.shouldSpawnBoss(waveData)) {
            return GameConfig.MONSTER.TYPE.BOSS;
        }
        return this.selectRandomMonsterType(waveData);
    },
    selectRandomMonsterType(waveData) {
        const monsterTypes = Object.keys(waveData.monsterTypeCounts);
        const randomIndex = Math.floor(Math.random() * monsterTypes.length);
        const selectedType = monsterTypes[randomIndex];
        waveData.monsterTypeCounts[selectedType]--;
        return GameConfig.MONSTER.TYPE[selectedType];
    },
    shouldSpawnBoss(waveData) {
        const level = waveData.level;
        return level % 2 === 0 && this.spawnedCount === waveData.totalMonsters - 5;
    },
    spawnMonster(type, level) {
        const monsterConfig = this.createMonsterConfig(type, level);
        const monster = this.instantiateMonster(monsterConfig);
        this.setupMonster(monster, monsterConfig);
    },
    createMonsterConfig(type, level) {
        const baseStats = this.calculateBaseStats(level);
        return {
            id: this.generateMonsterId(),
            type,
            position: this.genInitPosison(),
            hp: baseStats.hp * type.COEFFICIENT_HP,
            damage: baseStats.damage * type.COEFFICIENT_DAMAGE,
            durationMove: this.calculateMoveDuration(type, level),
            gold: baseStats.gold * type.COEFFICIENT_GOLD,
            level,
            spriteFrame: this.getSpriteFrameByType(type.NAME)
        };
    },
    instantiateMonster(config) {
        const monster = cc.instantiate(this.prefabMonster);
        const monsterItem = monster.getComponent(require('Monster'));
        monsterItem.init(config);
        return { monster, monsterItem };
    },
    setupMonster(monsterData, config) {
        const { monster, monsterItem } = monsterData;
        this.addMonsterToScene(monster, config.position);
        this.addMonsterToList(monsterItem);
    },
    addMonsterToScene(monster, position) {
        this.node.addChild(monster);
        this.setMonsterPosition(monster, position);
    },
    addMonsterToList(monsterItem) {
        this.listChar.push(monsterItem);
        monsterItem.onMove();
    },
    setMonsterPosition(monster, worldPos) {
        const localPos = this.node.convertToNodeSpaceAR(worldPos);
        monster.setPosition(localPos);
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
        return Math.max(3, type.DURATION_MOVE - speedBonus);
    },
    generateMonsterId() {
        return Date.now() + Math.random();
    },
    genInitPosison() {
        const x = GameConfig.MONSTER.INIT_LOCATION.X;
        const listY = GameConfig.MONSTER.INIT_LOCATION.Y;
        const y = listY[Math.floor(Math.random() * listY.length)];
        return new cc.Vec2(x, y);
    },
    getSpriteFrameByType(type) {
        return this.gameAsset.getSpriteFramByType(type);
    },
    onMonsterDie(monster) {
        this.removeMonsterFromList(monster);
        this.checkWaveCompletion();
    },
    removeMonsterFromList(monster) {
        monster.onDie();
        const index = this.listChar.indexOf(monster);
        if (index !== -1) {
            this.listChar.splice(index, 1);
        }
    },
    checkWaveCompletion() {
        if (this.listChar.length === 0 && !this.isGameOver && this.totalMonsters === this.spawnedCount) {
            Emitter.emit(EventKey.WAVE.WAVE_COMPLETE);
        }
    },
    takeDamage(monster, bullet) {
        this.applyDamage(monster, bullet);
        this.handleMonsterDeath(monster);
    },
    applyDamage(monster, bullet) {
        monster.hp -= bullet.damage;
    },
    handleMonsterDeath(monster) {
        if (monster.hp <= 0) {
            this.updateGameStats(monster);
        }
    },
    updateGameStats(monster) {
        this.sumGold += monster.gold;
        this.sumMonsterKill++;
    },
    registerEvent() {
        this.eventMap = this.createEventMap();
        this.registerEventHandlers();
    },
    createEventMap() {
        return new Map([
            [EventKey.WAVE.START_WAVE, this.onStartWave.bind(this)],
            [EventKey.MONSTER.ON_HIT, this.onMonsterHit.bind(this)],
            [EventKey.MONSTER.ON_ULTIMATE_HIT, this.onUltimateHit.bind(this)],
            [EventKey.MONSTER.ON_BOMB_HIT, this.onBombHit.bind(this)],
            [EventKey.MONSTER.ON_DIE, this.onMonsterDie.bind(this)],
            [EventKey.ROOM.GAME_OVER, this.onGameOver.bind(this)],
        ]);
    },
    registerEventHandlers() {
        this.eventMap.forEach((handler, key) => {
            Emitter.registerEvent(key, handler);
        });
    },
    unregisterEvent() {
        if (!this.eventMap) return;
        this.unregisterEventHandlers();
        this.clearEventMap();
    },
    unregisterEventHandlers() {
        this.eventMap.forEach((handler, key) => {
            Emitter.removeEvent(key, handler);
        });
    },
    clearEventMap() {
        this.eventMap.clear();
    },
    onGameOver() {
        this.setGameOverState();
        this.clearMonsters();
        this.emitGameSummary();
    },
    setGameOverState() {
        this.isGameOver = true;
    },
    clearMonsters() {
        this.listChar.forEach((monster) => {
            monster.onDie();
        });
        this.listChar = [];
    },
    emitGameSummary() {
        Emitter.emit(EventKey.ROOM.SUMMARY_GAME, this.sumGold, this.sumMonsterKill);
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
    }
});