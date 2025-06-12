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
    initBulletByType(type, worldPos) {
        const bullet = this.createBullet(type);
        this.setupBullet(bullet, worldPos);
    },
    createBullet(type) {
        const prefab = this.gameAsset.getBulletPrefabByType(type.NAME);
        const bullet = cc.instantiate(prefab);
        const component = bullet.getComponent('BulletItem');
        const initData = this.getBulletInitData(type);
        component.init(initData);
        return { bullet, component };
    },
    getBulletInitData(type) {
        return {
            id: this.generateBulletId(),
            type: type.NAME,
            durationMove: type.DURATION_MOVE,
            damage: this.calculateBulletDamage(type),
            countTarget: type.COUNT_TARGET,
        };
    },
    setupBullet(bulletData, worldPos) {
        const { bullet, component } = bulletData;
        this.addBulletToScene(bullet, worldPos);
        this.addBulletToList(component);
    },
    addBulletToScene(bullet, worldPos) {
        this.node.addChild(bullet);
        this.setBulletPosition(bullet, worldPos);
    },
    addBulletToList(component) {
        this.listBullet.push(component);
        component.onMove();
    },
    setBulletPosition(bullet, worldPos) {
        const nodePos = this.node.convertToNodeSpaceAR(worldPos);
        bullet.setPosition(nodePos.x, nodePos.y);
    },
    generateBulletId() {
        return Date.now() + Math.random();
    },
    calculateBulletDamage(type) {
        const damageBase = this.getBaseDamage(type);
        if (!this.hasUpgrade(type)) {
            return damageBase;
        }
        return this.calculateUpgradedDamage(damageBase, type);
    },
    getBaseDamage(type) {
        return GameConfig.BULLET.DAMAGE_BASE * type.COEFFICIENT_DAMAGE;
    },
    hasUpgrade(type) {
        return type.UPGRADE;
    },
    calculateUpgradedDamage(damageBase, type) {
        const level = this.getBulletLevel(type.NAME);
        const percentDamage = level * type.UPGRADE.PERCENT_DAMAGE_ADD;
        return damageBase + (damageBase * percentDamage);
    },
    getBulletLevel(typeName) {
        if (this.isNormalBullet(typeName)) {
            return UpgradeController.getLeverNomalAttack();
        } 
        if (this.isUltimateBullet(typeName)) {
            return UpgradeController.getLeverUltimate();
        }
        return 0;
    },
    isNormalBullet(typeName) {
        return typeName === GameConfig.BULLET.TYPE.NOMAL.NAME;
    },
    isUltimateBullet(typeName) {
        return typeName === GameConfig.BULLET.TYPE.ULTIMATE.NAME;
    },
    registerEvent() {
        this.eventMap = this.createEventMap();
        this.registerEventHandlers();
    },
    createEventMap() {
        return new Map([
            [EventKey.PLAYER.SHOOT_NORMAL, this.onShootNormalBullet.bind(this)],
            [EventKey.PLAYER.SHOOT_ULTIMATE, this.onShootUltimateBullet.bind(this)],
            [EventKey.PLAYER.SHOOT_BOMB, this.onShootBombBullet.bind(this)],
            [EventKey.ROOM.GAME_OVER, this.onGameOver.bind(this)],
        ]);
    },
    registerEventHandlers() {
        this.eventMap.forEach((handler, key) => {
            Emitter.registerEvent(key, handler);
        });
    },
    unregisterEvent() {
        if (!this.eventMap) return;
        this.unregisterEventHandlers();
        this.clearEventMap();
    },
    unregisterEventHandlers() {
        this.eventMap.forEach((handler, key) => {
            Emitter.removeEvent(key, handler);
        });
    },
    clearEventMap() {
        this.eventMap.clear();
    },
    onShootNormalBullet(worldPos) {
        this.initBulletByType(GameConfig.BULLET.TYPE.NOMAL, worldPos);
    },
    onShootUltimateBullet(worldPos) {
        this.initBulletByType(GameConfig.BULLET.TYPE.ULTIMATE, worldPos);
    },
    onShootBombBullet() {
        const bombType = GameConfig.SHOP.ITEM.BOMB;
        const worldPos = this.getBombInitialPosition(bombType);
        this.initBulletByType(bombType, worldPos);
    },
    getBombInitialPosition(bombType) {
        return cc.v2(bombType.POSITION.INIT.X, bombType.POSITION.INIT.Y);
    },
    onGameOver() {
        this.clearAllBullets();
    },
    clearAllBullets() {
        this.listBullet.forEach((bullet) => {
            if (bullet.node) {
                bullet.onClear();
            }
        });
    }
});
