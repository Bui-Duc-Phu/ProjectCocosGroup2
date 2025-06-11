const Emitter = require("Emitter");
const EventKey = require("EventKey");
const GameConfig = require("GameConfig");
const PopupName = require("PopupName");


cc.Class({
    extends: cc.Component,

    properties: {
        waveCurrent: {
            default: 1,
            type: cc.Integer,
            visible: false,
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
            [EventKey.WAVE.WAVE_COMPLETE, this.summaryWave.bind(this)],
            [EventKey.ROOM.SUMMARY_GAME, this.summaryGame.bind(this)],
        ]);
        this.eventMap.forEach((handler, key) => {
            Emitter.registerEvent(key, handler);
        });
    },
    summaryGame(sumGold, sumMonsterKill) {
        this.sumGold = sumGold - 100;
        this.sumMonsterKill = sumMonsterKill;
        this.score = this.caculateScore();
        this.updateResult(this.score,this.sumGold);
        this.showPopupResult();
    },
    initTitleWave() {
        const wordPos = cc.v2(GameConfig.ROOM.WORD_POS.X,GameConfig.ROOM.WORD_POS.Y);
        this.titleWave = cc.instantiate(this.gameAsset.getTitleWavePrefab());
        this.componentTitleWave = this.titleWave.getComponent('Round');
        this.componentTitleWave.init(this.waveCurrent);
        this.titleWave.parent = this.node;
        this.setPosition(this.titleWave,wordPos);
    },
    enableTitleWave(enable) {
        this.titleWave.active = enable;
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
            this.enableTitleWave(false);
        }, GameConfig.ROOM.TIME_START_GAME);
    },
    summaryWave() {
        if(this.waveCurrent == 3) {
            this.gameOver();
            console.log('game over');
            return;
        }
        this.componentTitleWave.updateTitleWave(this.waveCurrent + 1);
        this.enableTitleWave(true);
        this.scheduleOnce(() => {
            this.nextWave();
            this.enableTitleWave(false);
        }, GameConfig.ROOM.TIME_START_GAME);
    },
    startGame() {
        Emitter.emit(EventKey.WAVE.START_SPECIFIC_WAVE, this.waveCurrent);
    },
    nextWave() {
        this.waveCurrent++;
        Emitter.emit(EventKey.WAVE.START_SPECIFIC_WAVE, this.waveCurrent);
    },
    caculateScore() {
        const scoreKill = this.sumMonsterKill * GameConfig.ROOM.SUMMARY_GAME.SCORE_ONE_KILL;
        const scoreWave = this.waveCurrent * GameConfig.ROOM.SUMMARY_GAME.SCORE_ONE_WAVE;
        return scoreKill + scoreWave;
    },
    showPopupResult() {
        Emitter.emit(EventKey.POPUP.SHOW, PopupName.RESULT);
    },
    updateResult(score, sumGold) {
        Emitter.emit(EventKey.ROOM.UPDATE_RESULT, score, sumGold);
    },

});
