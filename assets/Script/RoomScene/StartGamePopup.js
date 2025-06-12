cc.Class({
    extends: cc.Component,

    properties: {
        countdownLabel: {
            default: null,
            type: cc.Label,
        },
        countdownTime: {
            default: 3,
            type: cc.Integer,
        },
    },
    onLoad() {
        this.node.active = false;
    },
    onEnable() {
        this.countdownTime = 3;
        this.startCountdown();
    },
    startCountdown() {
        this.countdownLabel.getComponent(cc.Label).string = this.countdownTime.toString();
        this.schedule(this.updateCountdown, 1);
    },
    updateCountdown() {
        this.countdownTime--;
        if (this.countdownTime <= 0) {
            this.unschedule(this.updateCountdown);
            this.node.active = false;
            Emitter.emit(EventKey.ROOM.START_GAME);
        } else {
            this.countdownLabel.getComponent(cc.Label).string = this.countdownTime.toString();
        }
    },

});
