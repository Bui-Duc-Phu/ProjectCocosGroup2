const Emitter = require('Emitter');
const EventKey = require('EventKey');
const AudioName = require('AudioName');
cc.Class({
    extends: cc.Component,

    properties: {
    },
    onGamePortalButtonClick() {
        Emitter.emit(EventKey.SOUND.STOP_BGM);
        cc.director.loadScene("Loading");
    },
    onPlayBGMButtonClick() {
        Emitter.emit(EventKey.SOUND.PLAY_BGM, AudioName.BGM.ROOM);
    }
});
