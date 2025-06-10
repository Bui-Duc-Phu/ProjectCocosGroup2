
cc.Class({
    extends: cc.Component,

    properties: {
        id: {
            default: 0,
            type: cc.Integer,
        },
        type: { 
            default: null,
            type: require('BulletType'),
        },
    },
 

    init(data){
        this.id = data.id;
        this.type = data.type;
    },
    playHitEffect(){

    },


    onStopEffect(){
     
    },

    onDestroy(){
        this.onStopEffect();
    },
    stopTween(...tweens) {
        tweens.forEach(tween => {
            if (tween) {
                tween.stop();
            }
        });
    },


});
