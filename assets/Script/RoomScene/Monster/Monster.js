

cc.Class({
    extends: require('MonsterItem'),

    properties: {
        
    
    },
    
    init(data) {
        super.init(data);
    },

  
    onMove(duration) {
        this.moveTween = cc.tween(this.node)
            .by(10, { x: -1560 })
            .call(() => {
                this.onDie();
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
        this.moveTween.stop();
        this.floatTween.stop();
        this.dieTween.stop();
    },
   

});
