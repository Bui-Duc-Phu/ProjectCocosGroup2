const EventKey = require('EventKey');
const Emitter = require('Emitter');
const GameConfig = require('GameConfig');
const AudioName = require('AudioName');
cc.Class({
    extends: require('BulletItem'),

    properties: {
    },
    init(data) {
        this._super(data);
        this.enableCollider(false);
    },
    onCollisionEnter(other, self) {
        this.onCollide(other, self)
    },
    onMove() {
        this.moveTween = cc.tween(this.node)
        this.moveTween.by(this.durationMove, { y: -400 })
            .call(() => {
                this.onExplode();
            })
            .start();
    },
    onExplode() {
        this.activateTriggerState();
        Emitter.emit(EventKey.BULLET.BOMB.ON_EXPLODE, this);
        this.bombDamage();
    },
    onCollide(target, self) {
        if (!this.canAddTarget()) { return }
        this.addTargetIfValid(target);
    },
    canAddTarget() {
        return this.currentTarget.length < this.countTarget;
    },
    addTargetIfValid(target) {
        const monster = target.getComponent('MonsterItem');
        if (this.currentTarget.includes(monster)) { return }
        this.currentTarget.push(monster);
    },
    emitBombDamage(){
        if (this.currentTarget.length <= 0) { return }
        const worldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        Emitter.emit(EventKey.MONSTER.ON_BOMB_HIT, this.currentTarget, this, worldPos);
       
    },
    activateTriggerState() {
        this.enableCollider(true);
        this.node.opacity = 0;
    },
    bombDamage() {
        this.scheduleOnce(() => { 
            this.emitBombDamage()
            this.onClear();      
         }, 0.2);
    },
    enableCollider(enable) {
        const collider = this.getComponent(cc.Collider);
        collider.enabled = enable;
    },
    onClear() {
        this.stopTween(this.moveTween)
        this.node.destroy();
    },


});
