const Emitter = require("Emitter");
const EventKey = require("EventKey");
const GameConfig = require("GameConfig");
const PopupName = require("PopupName");
const GoldController = require("GoldController");
const AudioName = require("AudioName");

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
        this.initCollisionManager();
        this.registerEvent();
        this.initGame();    
    },
    initCollisionManager() {
        const manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },
    registerEvent() {
        this.eventMap = this.createEventMap();
        this.registerEventHandlers();
    },
    createEventMap() {
        return new Map([
            [EventKey.PLAYER.ON_DIE, this.gameOver.bind(this)],
            [EventKey.WAVE.WAVE_COMPLETE, this.summaryWave.bind(this)],
            [EventKey.ROOM.SUMMARY_GAME, this.summaryGame.bind(this)],
            [EventKey.ROOM.EXIT, this.onExitRoom.bind(this)],
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
    initGame() {
        this.initTitleWave();
        this.scheduleGameStart();
        this.playBackgroundMusic();
    },
    scheduleGameStart() {
        this.scheduleOnce(() => {
            this.startGame();
            this.enableTitleWave(false);
        }, GameConfig.ROOM.TIME_START_GAME);
    },
    playBackgroundMusic() {
        Emitter.emit(EventKey.SOUND.PLAY_BGM, AudioName.BGM.ROOM);
    },
    initTitleWave() {
        const wavePosition = this.getWavePosition();
        this.createTitleWave(wavePosition);
    },
    getWavePosition() {
        return cc.v2(GameConfig.ROOM.WORD_POS.X, GameConfig.ROOM.WORD_POS.Y);
    },
    createTitleWave(position) {
        this.titleWave = cc.instantiate(this.gameAsset.getTitleWavePrefab());
        this.componentTitleWave = this.titleWave.getComponent('Round');
        this.componentTitleWave.init(this.waveCurrent);
        this.titleWave.parent = this.node;
        this.setPosition(this.titleWave, position);
    },
    enableTitleWave(enable) {
        this.titleWave.active = enable;
    },
    setPosition(node, worldPos) {
        const localPos = this.node.convertToNodeSpaceAR(worldPos);
        node.setPosition(localPos);
    },
    gameOver() {
        Emitter.emit(EventKey.ROOM.GAME_OVER);
    },
    summaryWave() {
        if (this.isLastWave()) {
            this.handleLastWave();
            return;
        }
        this.handleNextWave();
    },
    isLastWave() {
        return this.waveCurrent === 3;
    },
    handleLastWave() {
        this.gameOver();
        console.log('game over');
    },
    handleNextWave() {
        console.log('summary wave', this.waveCurrent);
        this.updateWaveTitle();
        this.scheduleNextWave();
    },
    updateWaveTitle() {
        this.componentTitleWave.updateTitleWave(this.waveCurrent + 1);
        this.enableTitleWave(true);
    },
    scheduleNextWave() {
        this.scheduleOnce(() => {
            this.nextWave();
            this.enableTitleWave(false);
        }, GameConfig.ROOM.TIME_START_GAME);
    },
    startGame() {
        Emitter.emit(EventKey.WAVE.START_SPECIFIC_WAVE, this.waveCurrent);
    },
    nextWave() {
        this.incrementWave();
        this.startGame();
    },
    incrementWave() {
        this.waveCurrent++;
    },
    summaryGame(sumGold, sumMonsterKill) {
        this.updateGameStats(sumGold, sumMonsterKill);
        this.handleGameSummary();
    },
    updateGameStats(sumGold, sumMonsterKill) {
        this.sumGold = parseInt(sumGold);
        this.sumMonsterKill = parseInt(sumMonsterKill);
        this.score = this.calculateScore();
    },
    handleGameSummary() {
        this.updateResult(this.score, this.sumGold);
        this.showPopupResult();
        this.saveGoldToLocalStorage(this.sumGold);
    },
    calculateScore() {
        const scoreKill = this.calculateKillScore();
        const scoreWave = this.calculateWaveScore();
        return scoreKill + scoreWave;
    },
    calculateKillScore() {
        return this.sumMonsterKill * GameConfig.ROOM.SUMMARY_GAME.SCORE_ONE_KILL;
    },
    calculateWaveScore() {
        return this.waveCurrent * GameConfig.ROOM.SUMMARY_GAME.SCORE_ONE_WAVE;
    },
    showPopupResult() {
        Emitter.emit(EventKey.POPUP.SHOW, PopupName.RESULT);
    },
    updateResult(score, sumGold) {
        Emitter.emit(EventKey.ROOM.UPDATE_RESULT, score, sumGold);
    },
    saveGoldToLocalStorage(sumGold) {
        console.log("add Gold", sumGold);
        GoldController.addGold(sumGold);
    },
    onExitRoom() {
        this.scheduleSceneTransition();
    },
    scheduleSceneTransition() {
        this.scheduleOnce(() => {
            Emitter.emit(EventKey.SCENE.LOAD_LOBBY);
        }, 0.3);
    }
});
