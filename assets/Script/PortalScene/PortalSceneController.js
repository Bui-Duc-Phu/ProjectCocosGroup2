const Emitter = require('Emitter');
const EventKey = require('EventKey');
cc.Class({
    extends: cc.Component,

    properties: {
    },
    onIconButtonClick() {
        cc.director.loadScene("Loading");
    },
    onPlayBgmButtonClick() {
        Emitter.emit(EventKey.SOUND.PLAY_BGM, 'room');
    }
});
