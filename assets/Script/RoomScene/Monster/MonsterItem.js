


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
