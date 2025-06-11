const GameConfig = require("GameConfig");
const Emitter = require("Emitter");
const EventKey = require("EventKey");

cc.Class({
    extends: cc.Component,

    properties: {
        currentLevel: {
            default: 1,
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
        }
    },

    onLoad() {
        this.registerEvent();
    },

    onDestroy() {
        this.unregisterEvent();
    },

    startWave() {
        this.totalMonstersThisWave = this.calculateMonstersForLevel(this.currentLevel);
        this.calculateMonsterTypeCounts();
        Emitter.emit(EventKey.WAVE.START_WAVE, {
            level: this.currentLevel,
            totalMonsters: this.totalMonstersThisWave,
            monsterTypeCounts: this.monsterTypeCounts,
            spawnInterval: this.spawnInterval
        });
    },

    onNextWave() {
        this.currentLevel++;
        this.startWave();
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

    calculateMonstersForLevel(level) {
        const waveCount = GameConfig.MONSTER.WAVE_COUNT;
        return Math.min(waveCount + level, 50);
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

    startSpecificWave(level) {
        this.currentLevel = level;
        this.startWave();
    },

    registerEvent() {
        this.eventMap = new Map([
            [EventKey.WAVE.START_SPECIFIC_WAVE, this.startSpecificWave.bind(this)]
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
    }
});
