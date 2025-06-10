const EventKey = require('EventKey');
const Emitter = require('Emitter');
const GameConfig = require('GameConfig');
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
    emitAndClear() {
        if (this.currentTarget.length <= 0) { return }
        Emitter.emit(EventKey.MONSTER.ON_BOMB_HIT, this.currentTarget, this);
        this.onClear();
    },
    activateTriggerState() {
        this.enableCollider(true);
        this.node.opacity = 0;
    },
    onExplode() {
        this.activateTriggerState();
        this.scheduleOnce(() => { this.emitAndClear() }, 0.2);
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
