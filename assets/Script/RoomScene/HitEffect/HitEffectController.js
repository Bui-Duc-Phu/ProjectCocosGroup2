const GameConfig = require('GameConfig');
const EventKey = require('EventKey');
const Emitter = require('Emitter');
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
    spawnHitEffect(type, worldPos) {
        const hitEffect = this.createHitEffect(type);
        this.setupHitEffect(hitEffect, worldPos);
    },
    createHitEffect(type) {
        const prefab = this.gameAsset.getHitEffectPrefabByType(type);
        const hitEffect = cc.instantiate(prefab);
        const component = hitEffect.getComponent('HitEffectItem');
        this.initializeHitEffect(component, type);
        return hitEffect;
    },
    initializeHitEffect(component, type) {
        component.init({
            id: this.generateHitEffectId(),
            type: type
        });
    },
    setupHitEffect(hitEffect, worldPos) {
        this.setPositionHitEffect(hitEffect, worldPos);
        this.addHitEffectToScene(hitEffect);
        this.playHitEffect(hitEffect);
    },
    setPositionHitEffect(hitEffect, worldPos) {
        const localPos = this.node.convertToNodeSpaceAR(worldPos);
        hitEffect.setPosition(localPos);
    },
    addHitEffectToScene(hitEffect) {
        this.node.addChild(hitEffect);
    },
    playHitEffect(hitEffect) {
        const component = hitEffect.getComponent('HitEffectItem');
        component.playHitEffect();
    },
    generateHitEffectId() {
        return Date.now();
    },
    registerEvent() {
        this.eventMap = this.createEventMap();
        this.registerEventHandlers();
    },
    createEventMap() {
        return new Map([
            [EventKey.MONSTER.ON_HIT, this.onMonsterHit.bind(this)],
            [EventKey.MONSTER.ON_ULTIMATE_HIT, this.onMonsterHitUltimate.bind(this)],
            [EventKey.MONSTER.ON_BOMB_HIT, this.onMonsterHitBomb.bind(this)],
        ]);
    },
    registerEventHandlers() {
        this.eventMap.forEach((handler, key) => {
            Emitter.registerEvent(key, handler);
        });
    },
    unregisterEvent() {
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
    onMonsterHit(monster, bullet, worldPos) {
        this.spawnHitEffect(bullet.type, worldPos);
    },
    onMonsterHitUltimate(monster, bullet, worldPos) {
        this.spawnHitEffect(bullet.type, worldPos);
    },
    onMonsterHitBomb(monster, bullet, worldPos) {
        this.spawnHitEffect(bullet.type, worldPos);
    },

});
