
const Emitter = require('Emitter');
const EventKey = require('EventKey');
const typePopup ={
    Setting: 'Setting',
    Shop: 'Shop',
    Hero: 'Hero',
    Skill: 'Skill'
}
cc.Class({
    extends: cc.Component,
    showSetting(){
        Emitter.emit(EventKey.POPUP.SHOW,typePopup.Setting);
    },
    showShop(){
        Emitter.emit(EventKey.POPUP.SHOW,typePopup.Shop);
    },
    showHero(){
        Emitter.emit(EventKey.POPUP.SHOW,typePopup.Hero);
    },
    showSkill(){
        Emitter.emit(EventKey.POPUP.SHOW,typePopup.Skill);
    }
});
