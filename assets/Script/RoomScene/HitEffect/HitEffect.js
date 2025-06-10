
cc.Class({
    extends: require('HitEffectItem'),

    properties: {
      
    },
    playHitEffect(){
        this.tween = cc.tween(this.node)
        this.tween.parallel(
            cc.tween().to(0.3, { scale: 1.5 },{easing: cc.easing.sineOut()}),
            cc.tween().to(0.3, { opacity: 0 },{easing: cc.easing.quadIn()})
        )
        .call(() => {
            this.node.destroy()
        })
        .start()
    },
    onStopEffect(){
        this.stopTween(this.tween);
    },


});
