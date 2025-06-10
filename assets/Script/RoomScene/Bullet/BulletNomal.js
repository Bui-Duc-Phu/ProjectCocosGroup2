const Emitter = require('Emitter');
const EventKey = require('EventKey');

cc.Class({
    extends: require('BulletItem'),

    properties: {

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
    onCollide(target, self) {
        const worldPos = self.node.convertToWorldSpaceAR(cc.v2(0, 0));
        Emitter.emit(EventKey.MONSTER.ON_HIT, target.getComponent('MonsterItem'), this, worldPos)
        this.onClear()
    },
    onClear() {
        this.stopTween(this.tween)
        this.node.destroy();
    },





});
