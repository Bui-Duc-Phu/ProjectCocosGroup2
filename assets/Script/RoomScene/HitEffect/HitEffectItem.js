
cc.Class({
    extends: cc.Component,

    properties: {
        id: {
            default: '',
            visible: false,
        },
        type: {
            default: '',
            visible: false,
        },
    },


    init(data) {
        this.id = data.id;
        this.type = data.type;
    },
    playHitEffect() {

    },


    onStopEffect() {

    },

    onDestroy() {
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
