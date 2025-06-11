
cc.Class({
    extends: cc.Component,

    properties: {
        wave: {
            default: 0,
            type: cc.Integer,
        },
        titleWave: {
            default: null,
            type: cc.Label,
        },

    },

  
    init(wave){
        this.wave = wave;
        this.titleWave.string = `Round ${this.wave}`;
    },

    updateTitleWave(wave){
        this.titleWave.string = `Round ${wave}`;
    },
   

});
