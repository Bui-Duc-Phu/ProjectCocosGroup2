const GameConfig = require("GameConfig");
const Emitter = require("Emitter");
const EventKey = require("EventKey");
const WaveCalculator = require("WaveCalculator");

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
        this.totalMonstersThisWave = WaveCalculator.calculateMonsterCountForLevel(this.currentLevel);
        this.monsterTypeCounts = WaveCalculator.calculateMonsterTypeCounts(this.currentLevel, this.totalMonstersThisWave);
        console.log("monsterTypeCounts", this.monsterTypeCounts);
        console.log("totalMonstersThisWave", this.totalMonstersThisWave);
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
