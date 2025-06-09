const GameConfig = require('GameConfig');
const Emitter = require('Emitter');
const EventKey = require('EventKey');

cc.Class({
    extends: cc.Component,

    properties: {
        gameAsset: {
            default: null,
            type: require('GameAsset')
        },

    },

    onLoad(){
        this.colisionManager()
    },
    colisionManager(){
        let manager = cc.director.getCollisionManager();
        manager.enabled = true
    },
    shootUltimateBullet(worldPos){
        this.onShootUltimateBullet(cc.v2(155,355))
    },
    shootNomalBullet(worldPos){
        this.onShootNomalBullet(cc.v2(155,355))
    },

    initBulletByType(type, worldPos) {
        const prefab = this.gameAsset.getBulletPrefabByType(type.NAME);
        const bullet = cc.instantiate(prefab);
        const component = bullet.getComponent('BulletItem');
        const initData = this.parseData(type);
        component.init(initData);
        this.node.addChild(bullet);
        this.initPositionBullet(bullet, worldPos);
        component.onMove();
    },

    initPositionBullet(bullet, worldPos) {
        const nodePos = this.node.convertToNodeSpaceAR(worldPos);
        bullet.setPosition(nodePos.x, nodePos.y);
    },
    parseData(type) {
        return {
            id: this.genID(),
            type: type.NAME,
            durationMove: type.DURATION_MOVE,
            damage: GameConfig.BULLET.DAMAGE_BASE * type.COEFFICIENT_DAMAGE,
            countTarget: type.COUNT_TARGET,
        }
    },
    genID() {
        return Date.now() + Math.random();
    },
    onShootNomalBullet(worldPos) {
        this.initBulletByType(GameConfig.BULLET.TYPE.NOMAL, worldPos);
    },
    onShootUltimateBullet(worldPos) {
        this.initBulletByType(GameConfig.BULLET.TYPE.ULTIMATE, worldPos);
    },
    registerEvent() {
        this.registerEventFunction();
        Emitter.emit(EventKey.PLAYER.SHOOT_NOMAL, this.onShootNomal);
        Emitter.emit(EventKey.PLAYER.SHOOT_ULTIMATE, this.onShootUltimate);
    },
    registerEventFunction() {
        this.onShootNomal = this.onShootNomalBullet.bind(this);
        this.onShootUltimate = this.onShootUltimateBullet.bind(this);
    },
    unregisterEvent() {
        Emitter.removeEvent(EventKey.PLAYER.SHOOT_NOMAL, this.onShootNomal);
        Emitter.removeEvent(EventKey.PLAYER.SHOOT_ULTIMATE, this.onShootUltimate);
    },





});
