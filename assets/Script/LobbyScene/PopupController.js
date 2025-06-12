const Emitter = require('Emitter');
const EventKey = require('EventKey');
const PopupName = require('PopupName');

cc.Class({
    extends: cc.Component,

    properties: {
        popupSetting: {
            type: require('PopupItem'),
            default: null
        },
        popupShop: {
            type: require('PopupItem'),
            default: null
        },
        popupHero: {
            type: require('PopupItem'),
            default: null
        },
        popupResult: {
            type: require('PopupItem'),
            default: null
        },
        overlay: {
            type:cc.Node,
            default: null
        }

    },
    onLoad() {
        this.init();
    },
    init() {
        this.onShowPopup = this.showPopup.bind(this);
        this.onUpdateResult = this.updateResult.bind(this);
        this.selfDestroy = this.onSelfDestroy.bind(this);
        this.hideAllPopup();
        this.overlay.active = false;
        this.registerEvent();

    },

    updateResult(score, sumGold) {
        console.log("updateResult11", score, sumGold);
        this.popupResult.updateResult(score, sumGold);
    },
    registerEvent() {
        Emitter.registerEvent(EventKey.POPUP.SHOW, this.onShowPopup)
        Emitter.registerEvent(EventKey.ROOM.UPDATE_RESULT, this.onUpdateResult);
        Emitter.registerEvent(EventKey.GAME.PREPARE_FOR_EXIT, this.selfDestroy);
    },
    showPopup(type) {
        this.overlay.active = true;
        switch (type) {
            case PopupName.SETTING:
                this.popupSetting.show();
                break;
            case PopupName.SHOP:
                this.popupShop.show();
                break;
            case PopupName.HERO:
                this.popupHero.show();
                break;
            case PopupName.SKILL:
                this.popupSkill.show();
                break;
            case PopupName.RESULT:
                this.popupResult.show();
                break;
            default:
                break;
        }
    },
    hideAllPopup() {
        this.popupSetting.hide();
        this.popupShop.hide();
        this.popupHero.hide();
        this.popupResult.hide();
    },
    onSelfDestroy() {
        console.log('PopupController selfDestroy');
        this.hideAllPopup();
        cc.game.removePersistRootNode(this.node);
        this.node.destroy();
    },
    onDestroy() {
        Emitter.removeEvent(EventKey.POPUP.SHOW, this.onShowPopup);
        Emitter.removeEvent(EventKey.ROOM.UPDATE_RESULT, this.onUpdateResult);
        Emitter.removeEvent(EventKey.GAME.PREPARE_FOR_EXIT, this.selfDestroy);
    }
});
