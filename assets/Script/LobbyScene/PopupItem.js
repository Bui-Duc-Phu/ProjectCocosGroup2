
cc.Class({
    extends: cc.Component,
    show() {
        this.node.active = true;
    },
    hide() {
        this.node.active = false;
    }
});
