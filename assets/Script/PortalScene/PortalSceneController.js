const Emitter = require('Emitter');
const EventKey = require('EventKey');
cc.Class({
    extends: cc.Component,

    properties: {
    },
    onGamePortalButtonClick() {
        Emitter.emit(EventKey.SOUND.STOP_BGM);
        cc.director.loadScene("Loading");
    },
    onPlayBGMButtonClick() {
        Emitter.emit(EventKey.SOUND.PLAY_BGM, 'room');
    }
});
