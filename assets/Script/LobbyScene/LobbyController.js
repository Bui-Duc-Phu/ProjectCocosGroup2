const GoldController = require('GoldController') 
const Emitter = require('Emitter');
const EventKey = require('EventKey');
const AudioName = require('AudioName');
const PopupName = require('PopupName');
const LocalStorageKey = require('LocalStorageKey');
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
        },
        username: {
            type: cc.Label,
            default: null
        }
    },
    onLoad() {
        this.init();
    },
    init() {
        console.log(this.currentGold);
        this.onChangeGold();
        this._onChangeGold = this.onChangeGold.bind(this);
        this._onChangeName = this.onChangeName.bind(this);
        this.registerEvent();   
        Emitter.emit(EventKey.SOUND.PLAY_BGM, AudioName.BGM.LOBBY);
        
        let username = this.getUsername();
        this.username.string = username;
    },
    registerEvent() {
        Emitter.registerEvent(EventKey.GOLD.CHANGE_GOLD, this._onChangeGold);
        Emitter.registerEvent(EventKey.PLAYER.CHANGE_NAME, this._onChangeName);

    },
    start() {
        if (!cc.game.isPersistRootNode(this.popupNode)) {
            cc.game.addPersistRootNode(this.popupNode);
            console.log("PopupNode added to persist root nodes");
        } else {
            this.popupNode.destroy();
            console.log("PopupNode already exists in persist root nodes, destroying the old one");
        }
    },
    onChangeGold() {
        let goldData = GoldController.getGoldValue();
        this.currentGold.forEach(gold => {
            gold.string = goldData.toString();
        });
    },
    onChangeName() {
        let username = this.getUsername();
        this.username.string = username;
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
    showInfor() {
        Emitter.emit(EventKey.POPUP.SHOW, PopupName.INFOR);
    },
    showChangeName() {
        Emitter.emit(EventKey.POPUP.SHOW, PopupName.CHANGE_NAME);
    },
    onClickButton(){
        Emitter.emit(EventKey.SOUND.PLAY_SFX,AudioName.SFX.CLICK);
    },
    onClickStart(){
        Emitter.emit(EventKey.SCENE.LOAD_ROOM);
    },
    getUsername(){
        let username = cc.sys.localStorage.getItem(LocalStorageKey.PLAYER.NAME);
            if (!username) {
                username = 'Player';
                cc.sys.localStorage.setItem(LocalStorageKey.PLAYER.NAME, username);
                return username;
            }
            return username;
    },
    onDestroy() {
        console.log("LobbyController destroyed");
        Emitter.emit(EventKey.SOUND.ENABLE_BGM,false);
        Emitter.removeEvent(EventKey.GOLD.CHANGE_GOLD, this._onChangeGold);
        Emitter.removeEvent(EventKey.PLAYER.CHANGE_NAME, this._onChangeName);

    },
    
});
