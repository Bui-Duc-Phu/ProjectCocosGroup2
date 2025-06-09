cc.Class({
    extends: cc.Component,

    properties: {
        totalDuration: {
            default: 0,
            visible: false,
        },
        remainingTime: {
            default: 0,
            visible: false,
        },
        isOnCooldown: {
            default: false,
            visible: false,
        },
        progressBarComponent: {
            default: null,
            visible: false,
        },
        durationSeconds: {
            default: 0,
            type: cc.Integer,
        },
    },

    onLoad() {
        this.init();
    },

    init() {
        this.progressBarComponent = this.node.getComponent(cc.ProgressBar);
        this.node.active = false;
        this.progressBarComponent.progress = 0;
    },

    onEnable() {
        this.totalDuration = durationSeconds;
        this.remainingTime = durationSeconds;
        this.isOnCooldown = true;
        this.progressBarComponent.progress = 1;
    },

    update(dt) {
        if (!this.isOnCooldown) {
            return;
        }

        this.remainingTime -= dt;

        if (this.remainingTime <= 0) {
            this.node.active = false;
        } else {
            this.progressBarComponent.progress = this.remainingTime / this.totalDuration;
        }
    },
    onDisable() {
        this.isOnCooldown = false;
        this.progressBarComponent.progress = 0;
    },
});