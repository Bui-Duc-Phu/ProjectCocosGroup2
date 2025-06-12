const GoldController = require('GoldController') 
const Emitter = require('Emitter');
const EventKey = require('EventKey');
const AudioName = require('AudioName');
const PopupName = require('PopupName');

cc.Class({
    extends: cc.Component,
    properties: {
        popupNode: {
            type: cc.Node,
            default: null
        },
        currentGold: {
            type: [cc.Label],
            default: []
        }
    },
    onLoad() {
        this.init();
    },
    init() {
        this.onChangeGold();
        this._onChangeGold = this.onChangeGold.bind(this);
        this.registerEvent();
        Emitter.emit(EventKey.SOUND.PLAY_BGM, AudioName.BGM.LOBBY);
    },
    registerEvent() {
        Emitter.registerEvent(EventKey.GOLD.CHANGE_GOLD, this._onChangeGold);
    },
    start() {
        if (!cc.game.isPersistRootNode(this.popupNode)) {
            cc.game.addPersistRootNode(this.popupNode);
        } else {
            this.popupNode.destroy();
        }
    },
    onChangeGold() {
        let goldData = GoldController.getGoldValue();
        this.currentGold.forEach(gold => {
            gold.string = goldData.toString();
        });
    },
    showSetting() {
        Emitter.emit(EventKey.POPUP.SHOW, PopupName.SETTING);
    },
    showShop() {
        Emitter.emit(EventKey.POPUP.SHOW, PopupName.SHOP);
    },
    showHero() {
        Emitter.emit(EventKey.POPUP.SHOW, PopupName.HERO);
    },
    showSkill() {
        Emitter.emit(EventKey.POPUP.SHOW, PopupName.SKILL);
    },
    onClickButton(){
        Emitter.emit(EventKey.SOUND.PLAY_SFX,AudioName.SFX.CLICK);
    },
    onClickStart(){
        console.log("Start Game");
        Emitter.emit(EventKey.SCENE.LOAD_ROOM);
    },
    onDestroy() {
        Emitter.emit(EventKey.SOUND.ENABLE_BGM,false);
        Emitter.removeEvent(EventKey.GOLD.CHANGE_GOLD, this._onChangeGold);
    },
    
});
