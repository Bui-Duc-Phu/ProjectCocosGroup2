const Emitter = require("Emitter");
const EventKey = require("EventKey");
cc.Class({
    extends: require('MonsterItem'),

    properties: {
    },
    onMove() {
        this.moveTween = cc.tween(this.node)
            .by(this.durationMove, { x: -1560 })
            .call(() => {
                Emitter.emit(EventKey.MONSTER.ON_DIE, this);
            })
            .start();
        this.floatTween = cc.tween(this.node)
            .repeatForever(
                cc.tween()
                    .parallel(
                        cc.tween().sequence(
                            cc.tween().to(0.4, { scale: 0.9 }),
                            cc.tween().to(0.4, { scale: 1 })
                        ),
                        cc.tween().sequence(
                            cc.tween().by(0.7, { y: 10 }),
                            cc.tween().by(0.4, { y: -10 })
                        )
                    )
            )
            .start();
    },
    onDie() {
        this.dieTween = cc.tween(this.node)
            .to(0.8, { opacity: 0 })
            .call(() => {
                this.node.destroy();
            })
            .start();
        this.moveTween.stop();
        this.node.destroy();
    },
    stopAllTween() {
        this.stopTween(
            this.moveTween,
            this.floatTween,
            this.dieTween
        )
    },
    stopTween(...tweens) {
        tweens.forEach(tween => {
            if (tween) {
                tween.stop();
            }
        });
    },
});
