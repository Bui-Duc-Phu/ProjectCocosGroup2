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
            visible: false,
        },
    },

    onLoad() {
        this.init();
    },
    init() {
        this.progressBarComponent = this.node.getComponent(cc.ProgressBar);
        this.cooldownLabel = this.node.getChildByName('label').getComponent(cc.Label);
        this.node.active = false;
        this.progressBarComponent.progress = 0;
    },
    onEnable() {
        this.totalDuration = this.durationSeconds;
        this.remainingTime = this.durationSeconds;
        this.cooldownLabel.string = `${Math.floor(this.durationSeconds)}s`;
        this.isOnCooldown = true;
        this.progressBarComponent.progress = 1;
    },
    update(dt) {
        if (!this.isOnCooldown) {
            return;
        }

        this.remainingTime -= dt;
        this.cooldownLabel.string = `${Math.floor(this.remainingTime)}s`;
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