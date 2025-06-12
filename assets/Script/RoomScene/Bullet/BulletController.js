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

    onLoad() {
        this.registerEvent();
    },
    onDestroy() {
        this.unregisterEvent();
    },
    registerEvent() {
        this.eventMap = new Map([
            [EventKey.PLAYER.SHOOT_NORMAL, this.onShootNormalBullet.bind(this)],
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
    caculateDamage(type,level) {
      const percentDamage = level *  type.UPGRADE.PERCENT_DAMAGE_ADD;
      const damageBase = GameConfig.BULLET.DAMAGE_BASE * type.COEFFICIENT_DAMAGE;
      const newDamage = damageBase + damageBase * percentDamage;
      return newDamage;
    },
    initPositionBullet(bullet, worldPos) {
        const nodePos = this.node.convertToNodeSpaceAR(worldPos);
        bullet.setPosition(nodePos.x, nodePos.y);
    },
    parseData(type,level) {
        return {
            id: this.genID(),
            type: type.NAME,
            durationMove: type.DURATION_MOVE,
            damage: this.caculateDamage(type,level),
            countTarget: type.COUNT_TARGET,
        }
    },
    genID() {
        return Date.now() + Math.random();
    },
    onShootNormalBullet(worldPos) {
        this.initBulletByType(GameConfig.BULLET.TYPE.NOMAL, worldPos);
    },
    onShootUltimateBullet(worldPos) {
        this.initBulletByType(GameConfig.BULLET.TYPE.ULTIMATE, worldPos);
    },
    onShootBombBullet() {
        const BomDType = GameConfig.SHOP.ITEM.BOMB;
        const worldPos = cc.v2(BomDType.POSITION.INIT.X, BomDType.POSITION.INIT.Y)
        this.initBulletByType(BomDType, worldPos);
    },

    getDataLocalStorageByKey(key) {
        const data = cc.sys.localStorage.getItem(key);
        return data;
    },

    getLevelBulletByType(type) {
        if(type.NAME == GameConfig.BULLET.TYPE.NOMAL.NAME) {
            const level = this.getDataLocalStorageByKey(LocalStorageKey.PLAYER.NORMAL_ATTACK_LEVEL);
            return level;
        }
        if(type.NAME == GameConfig.BULLET.TYPE.ULTIMATE.NAME) {
            const level = this.getDataLocalStorageByKey(LocalStorageKey.PLAYER.ULTIMATE_LEVEL);
            return level;
        }
        return 1;
    },
    
 
   






});
