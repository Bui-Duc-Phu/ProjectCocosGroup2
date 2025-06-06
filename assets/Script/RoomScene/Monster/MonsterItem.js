


const MonterState = {
    IDLE: "IDLE",
    MOVE: "MOVE",
    ATTACK: "ATTACK",
    DEAD: "DEAD",
}

const Transition = {
    IDLE: "onIdle",
    MOVE: "onMove",
    ATTACK: "onAttack",
    DEAD: "onDead",
}

const Value = {
    TWEEN: {
        MOVE: {
            BY_X: 300,
        },
    },
}

cc.Class({
    extends: cc.Component,

    properties: {
        id: {
            default: 0,
            type: cc.String,
            visible: false
        },
        type: {
            default: "",
            type: cc.String,
            visible: false
        },
        HP: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        damage: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        speed: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        reward: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        hpBar: {
            default: null,
            type: cc.ProgressBar,
        },
        sprite: {
            default: null,
            type: cc.Sprite,
        },
    },

    init(data) {
        this.id = data.id;
        this.type = data.type;
        this.HP = data.HP;
        this.damage = data.damage;
        this.speed = data.speed;
        this.reward = data.reward;
        this.hpBar.progress = 1;
    },

    onMove() {
        
    },
    onDie() {
        
    },





});
