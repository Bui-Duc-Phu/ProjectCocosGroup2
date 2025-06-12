const GameConfig = require('GameConfig');
const Emitter = require('Emitter');
const EventKey = require('EventKey');
const LocalStorageKey = require('LocalStorageKey');
const UpgradeController = require('UpgradeController');
cc.Class({
    extends: cc.Component,

    properties: {
        gameAsset: {
            default: null,
            type: require('GameAsset')
        },
        listBullet: {
            default: [],
            type: [require('BulletItem')],
            visible: false
        }

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
            [EventKey.ROOM.GAME_OVER, this.gameOver.bind(this)],
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
        const initData = this.getAndParseData(type);
        component.init(initData);
        this.node.addChild(bullet);
        this.initPositionBullet(bullet, worldPos);
        this.listBullet.push(component);
        component.onMove();
    },

    initPositionBullet(bullet, worldPos) {
        const nodePos = this.node.convertToNodeSpaceAR(worldPos);
        bullet.setPosition(nodePos.x, nodePos.y);
    },
    getAndParseData(type) {
        return {
            id: this.genID(),
            type: type.NAME,
            durationMove: type.DURATION_MOVE,
            damage: this.caculateDamage(type, this.getLevelByTypeName(type.NAME)),
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
    caculateDamage(type, level) {
        const percentDamage = level * type.UPGRADE.PERCENT_DAMAGE_ADD;
        const damageBase = GameConfig.BULLET.DAMAGE_BASE * type.COEFFICIENT_DAMAGE;
        const newDamage = damageBase + damageBase * percentDamage;
        return newDamage;
    },
    getLevelByTypeName(typeName) {
        if (typeName === GameConfig.BULLET.TYPE.NOMAL.NAME) {
            return UpgradeController.getLeverNomalAttack();
        } else if (typeName === GameConfig.BULLET.TYPE.ULTIMATE.NAME) {
            return UpgradeController.getLeverUltimate();
        }
        return 1;
    },
    clearAllBullet() {
        this.listBullet.forEach((bullet) => {
            if (bullet.node) {
                bullet.onClear();
            }
        });
    },
    gameOver() {
        this.clearAllBullet();
    }
});
