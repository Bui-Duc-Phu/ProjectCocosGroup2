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
        popupSkill: {
            type: require('PopupItem'),
            default: null
        },

    },
    onLoad() {
        this.init();
        this.registerEvent();
    },
    init() {
        this.onShowPopup = this.showPopup.bind(this);
        this.hideAllPopup();
    },
    registerEvent() {
        Emitter.registerEvent(EventKey.POPUP.SHOW, this.onShowPopup)
    },
    showPopup(type) {
        this.hideAllPopup();
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
        this.popupSkill.hide();
    },
    onDestroy() {
        Emitter.removeEvent(EventKey.POPUP.SHOW, this.onShowPopup);
    }
});
