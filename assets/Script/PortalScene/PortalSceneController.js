cc.Class({
    extends: cc.Component,

    properties: {
    },
    onIconButtonClick() {
        cc.director.loadScene("LoadingScene");
    }
});
