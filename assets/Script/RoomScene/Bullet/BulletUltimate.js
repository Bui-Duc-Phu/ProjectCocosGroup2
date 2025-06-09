
cc.Class({
    extends: require('BulletItem'),

    properties: {

    },
    init(data) {
        super._init(data)
        this.initSetup()
    },

    onCollisionEnter(other, self) {
        this.onCollide(other, self)
    },

    onMove() {
        this.tween = cc.tween(this.node)
        this.tween.by(this.durationMove, { x: 3000 })
            .call(() => {
                this.onClear()
            })
            .start();
    },
    initSetup() {
        this.tagetColiderNode = this.node.getChildByName('TargetColider')
        this.targetColider = this.tagetColiderNode.getComponent(cc.BoxCollider2D)
        this.targetColider.enabled = false;
    },

    onCollide(target, self) {
        this.targetColider.enabled = true;
        Emitter.emit(EventKey.MONSTER.ON_HIT, target, self)
        this.onClear()
    },
    onClear() {
        this.stopTween(this.tween)
        this.node.destroy();
    },
});
