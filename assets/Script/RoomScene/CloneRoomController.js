const Emitter = require("Emitter");
const EventKey = require("EventKey");

cc.Class({
    extends: cc.Component,

    properties: {
    
    },
    onLoad(){
        this.colisionManager();
        this.registerEvent();
    },
    onDestroy(){
        this.unregisterEvent();
    },
    colisionManager(){
        let manager = cc.director.getCollisionManager();
        manager.enabled = true
    },
    registerEvent() {
        this.eventMap = new Map([
            [EventKey.PLAYER.SHOOT_NOMAL, this.onShootNomalBullet.bind(this)],
            [EventKey.PLAYER.SHOOT_ULTIMATE, this.onShootUltimateBullet.bind(this)],
            [EventKey.PLAYER.SHOOT_BOMB, this.onShootBombBullet.bind(this)],
        ]);
        this.eventMap.forEach((handler, key) => {
            Emitter.registerEvent(key, handler);
        });
    },
    unregisterEvent() {
        if (!this.eventMap) return;
        this.eventMap.forEach((handler, key) => {
            Emitter.removeEvent(key, handler);
        });
        this.eventMap.clear();
    },
});
