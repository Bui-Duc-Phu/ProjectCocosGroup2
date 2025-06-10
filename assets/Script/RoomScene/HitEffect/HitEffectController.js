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
        const prefab = this.gameAsset.getHitEffectPrefabByType(type);
        const hitEffect = cc.instantiate(prefab);
        const component = hitEffect.getComponent('HitEffectItem');
        component.init({ id: this.genID(), type: type });
        this.setPositionHitEffect(hitEffect, worldPos);
        this.node.addChild(hitEffect);
        component.playHitEffect();
    },
    setPositionHitEffect(hitEffect, worldPos) {
        const localPos = this.node.convertToNodeSpaceAR(worldPos);
        hitEffect.setPosition(localPos);
    },
    genID() {
        return Date.now();
    },
    registerEvent() {
        this.eventMap = new Map([
            [EventKey.MONSTER.ON_HIT, this.onMonsterHit.bind(this)],
            [EventKey.MONSTER.ON_ULTIMATE_HIT, this.onMonsterHitUltimate.bind(this)],
            [EventKey.MONSTER.ON_BOMB_HIT, this.onMonsterHitBomb.bind(this)],
        ]);
        this.eventMap.forEach((handler, key) => {
            Emitter.registerEvent(key, handler);
        });
    },
    unregisterEvent() {
        this.eventMap.forEach((handler, key) => {
            Emitter.removeEvent(key, handler);
        });
        this.eventMap.clear();
    },
    onMonsterHit(monster, bullet, worldPos) {
        this.spawnHitEffect(bullet.type, worldPos);
    },
    onMonsterHitUltimate(monster, bullet, worldPos) {
        console.log('onMonsterHitUltimate', worldPos);
        console.log(bullet.type);
        this.spawnHitEffect(bullet.type, worldPos);
    },
    onMonsterHitBomb(monster, bullet, worldPos) {
        this.spawnHitEffect(bullet.type, worldPos);
    },


});
