const GameConfig = require('GameConfig');
const EventKey = require('EventKey');
const Emitter = require('Emitter');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad(){
        this.registerEvent();
    },
    onDestroy(){
        this.unregisterEvent();
    },

     spawnHitEffect(type,worldPos){
        const prefab = this.gameAsset.getHitEffectPrefabByType(type);
        const hitEffect = cc.instantiate(prefab);
        hitEffect.setPosition(worldPos);
        this.node.addChild(hitEffect);
     },
     setPositionHitEffect(hitEffect,worldPos){
        const localPos = this.node.convertToNodeSpaceAR(worldPos);
        hitEffect.setPosition(localPos);
     },
     registerEvent(){
        this.eventMap = new Map([
            [EventKey.MONSTER.ON_HIT, this.onMonsterHit.bind(this)],
        ]);
        this.eventMap.forEach((handler, key) => {
            Emitter.registerEvent(key, handler);
        });
     },
     unregisterEvent(){
        this.eventMap.forEach((handler, key) => {
            Emitter.removeEvent(key, handler);
        });
        this.eventMap.clear();
    },
    onMonsterHit(monster, bullet){
        console.log('onHitEffect',bullet.type);
        this.spawnHitEffect(bullet.type, monster.node.position);
    }


});
