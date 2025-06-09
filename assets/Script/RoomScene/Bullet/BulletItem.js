

cc.Class({
    extends: cc.Component,

    properties: {
        id:{
            default:"", 
            type:cc.String,
            visible:false,
        },
        durationMove:{
            default:0,
            type:cc.Float,
            visible:false,
        },
        damage:{
            default:0,
            type:cc.Float,
            visible:false,
        },
        countTarget:{
            default:0,
            type:cc.Integer,
            visible:false,
        },
        type:{
            default:"",
            type:cc.String,
            visible:false,
        },
        currentTarget:{
            default:[],
            type:[require('MonsterItem')],
            visible:false,
        },
    },
    init(data) {
        this.id = data.id
        this.type = data.type
        this.durationMove = data.durationMove
        this.damage = data.damage
        this.countTarget = data.countTarget
    },
    onMove() {
       
    },
    onClear(){
    },

    onCollide(){

    },
    stopTween(...tweens) {
        tweens.forEach(tween => {
            if (tween) {
                tween.stop();
            }
        });
    },
 
   



});
