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
        this.registerEvent();
    },
    onDestroy(){
        this.unregisterEvent();
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
    onShootBombBullet() {
        console.log('onShootBombBullet');
        const BomDType = GameConfig.SHOP.ITEM.BOMB;
        const worldPos = cc.v2(BomDType.POSITION.INIT.X,BomDType.POSITION.INIT.Y)
        this.initBulletByType( BomDType, worldPos);
    },
    shootUltimateBullet(worldPos){
        this.onShootUltimateBullet(cc.v2(155,355))
    },
    shootNomalBullet(worldPos){
        this.onShootNomalBullet(cc.v2(155,355))
    },
  





});
