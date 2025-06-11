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
        this.initGame();    
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
        const wordPos = cc.v2(GameConfig.ROOM.WORD_POS.X,GameConfig.ROOM.WORD_POS.Y);
        this.titleWave = cc.instantiate(this.gameAsset.getTitleWavePrefab());
        let component = this.titleWave.getComponent('Round');
        component.init(this.waveCurrent);
        this.titleWave.parent = this.node;
        this.setPosition(this.titleWave,wordPos);
    },
    removeTitleWave() {
        this.titleWave.active = false;
    },
    setPosition(node,wordPos) {
        const pos =  this.node.convertToNodeSpaceAR(wordPos);
        node.setPosition(pos);
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
        this.initTitleWave();
        this.scheduleOnce(() => {
            this.startGame();
            this.removeTitleWave();
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
