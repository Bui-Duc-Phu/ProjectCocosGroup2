

cc.Class({
    extends: cc.Component,

    properties: {
        id:{
            default:0,
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
        target:{
            default:[],
            type:[cc.Node],
            visible:false,
        },
    },
    init(data) {
        this.id = data.id
        this.type = data.type
        this.durationMove = data.durationMove
        this.damage = data.damage
        this.countTarget = data.countTarget
        this.type = data.type
    },
    onMove() {
       
    },
    onCollide(target){

    },
 
   



});
