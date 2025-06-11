const Emitter = require("Emitter");
const EventKey = require("EventKey");
const GameConfig = require("GameConfig");


cc.Class({
    extends: cc.Component,

    properties: {
        waveCurrent: {
            default: 1,
            type: cc.Integer,
        },
        gameAsset: require("GameAsset"),
    },
    onLoad() {
        this.colisionManager();
        this.registerEvent();
    },
    colisionManager() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true
    },
    registerEvent() {
        this.eventMap = new Map([
            [EventKey.PLAYER.ON_DIE, this.gameOver.bind(this)],
        ]);
        this.eventMap.forEach((handler, key) => {
            Emitter.registerEvent(key, handler);
        });
    },
    initTitleWave() {
        let titleWave = cc.instantiate(gameAsset.getTitleWavePrefab());
        const show = () => {
            titleWave.parent = this.node;
            titleWave.setPosition(0, 0);
        }
        show();
    },
    unregisterEvent() {
        if (!this.eventMap) return;
        this.eventMap.forEach((handler, key) => {
            Emitter.removeEvent(key, handler);
        });
        this.eventMap.clear();
    },
    gameOver() {
        Emitter.emit(EventKey.ROOM.GAME_OVER);
    },
    initGame() {
        this.scheduleOnce(() => {
            this.startGame();
        }, GameConfig.ROOM.TIME_START_GAME);
    },
    summaryWave() {
    },
    startGame() {
        Emitter.emit(EventKey.WAVE.START_SPECIFIC_WAVE, this.waveCurrent);
    },
    nextWave() {
        this.waveCurrent++;
        Emitter.emit(EventKey.WAVE.START_SPECIFIC_WAVE, this.waveCurrent);
    },
});
