const Emitter = require('Emitter');
const EventKey = require('EventKey');
cc.Class({
    extends: require('BulletItem'),

    properties: {
    },

    init(data) {
        this._super(data);
        this.resetState();
        this.enableColliderByTag(2, false);
    },

    resetState() {
        this.hasTriggered = false;
        this.currentTarget = [];
    },

    onCollisionEnter(other, self) {
        const collisionHandler = this.getCollisionHandler(self.tag);
        if (collisionHandler) {
            collisionHandler(other, self);
        }
    },
    getCollisionHandler(tag) {
        const handlers = {
            1: this.handleTriggerCollision.bind(this),
            2: this.handleDamageCollision.bind(this)
        };
        return handlers[tag];
    },
    onMove() {
        this.moveTween = cc.tween(this.node)
            .by(this.durationMove, { x: 3000 })
            .call(() => this.onClear())
            .start();
    },
    handleTriggerCollision(other, self) {
        if (this.hasTriggered) return;
        this.activateTriggerState();
        this.scheduleOnce(() => {
            this.emitAndClear();
        }, 0.1);
    },

    activateTriggerState() {
        this.hasTriggered = true;
        this.stopTween(this.moveTween);
        this.enableColliderByTag(2, true);
        this.node.opacity = 0;
    },
    emitAndClear() {
        if (this.currentTarget.length <= 0) { return }
        Emitter.emit(EventKey.MONSTER.ON_ULTIMATE_HIT, this.currentTarget, this);
        this.onClear();
    },
    handleDamageCollision(other, self) {
        if (!this.canAddTarget()) { return }
        this.addTargetIfValid(other);
    },
    canAddTarget() {
        return this.hasTriggered == true && this.currentTarget.length < this.countTarget;
    },
    addTargetIfValid(other) {
        const monster = other.getComponent('MonsterItem');
        if (this.currentTarget.includes(monster)) { return }
        this.currentTarget.push(monster);
    },
    enableColliderByTag(tag, enable) {
        const colliders = this.getComponents(cc.Collider);
        colliders.forEach(collider => {
            if (collider.tag === tag) {
                collider.enabled = enable;
            }
        });
    },
    onClear() {
        this.stopTween(this.tween);
        this.node.destroy();
    },
});
