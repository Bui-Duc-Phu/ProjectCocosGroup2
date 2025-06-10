const GoldController = require('GoldController') 
const Emitter = require('Emitter');
const EventKey = require('EventKey');
const AudioName = require('AudioName');
const typePopup = {
    Setting: 'Setting',
    Shop: 'Shop',
    Hero: 'Hero',
    Skill: 'Skill'
}
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
        console.log(this.currentGold);
        this.onChangeGold();
        this._onChangeGold = this.onChangeGold.bind(this);
        this.registerEvent();
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
        Emitter.emit(EventKey.POPUP.SHOW, typePopup.Setting);
    },
    showShop() {
        Emitter.emit(EventKey.POPUP.SHOW, typePopup.Shop);
    },
    showHero() {
        Emitter.emit(EventKey.POPUP.SHOW, typePopup.Hero);
    },
    showSkill() {
        Emitter.emit(EventKey.POPUP.SHOW, typePopup.Skill);
    },
    onClickButton(){
         Emitter.emit(EventKey.SOUND.PLAY_SFX,AudioName.SFX.CLICK);
    },
    onDestroy() {
        Emitter.removeEvent(EventKey.GOLD.CHANGE_GOLD, this._onChangeGold);
    },
    
});
