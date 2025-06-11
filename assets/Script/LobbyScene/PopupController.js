const Emitter = require('Emitter');
const EventKey = require('EventKey');
const typePopup = {
    Setting: 'Setting',
    Shop: 'Shop',
    Hero: 'Hero',
    Skill: 'Skill'
}
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
        this.hideAllPopup();
        this.overlay.active = false;
        this.registerEvent();

    },
    registerEvent() {
        Emitter.registerEvent(EventKey.POPUP.SHOW, this.onShowPopup)
    },
    showPopup(type) {
        this.overlay.active = true;
        switch (type) {
            case typePopup.Setting:
                this.popupSetting.show();
                break;
            case typePopup.Shop:
                this.popupShop.show();
                break;
            case typePopup.Hero:
                this.popupHero.show();
                break;
            case typePopup.Skill:
                this.popupSkill.show();
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
    onDestroy() {
        Emitter.removeEvent(EventKey.POPUP.SHOW, this.onShowPopup);
    }
});
