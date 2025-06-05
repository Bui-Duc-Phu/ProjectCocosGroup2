const Emitter = require("../Utils/Emitter");
const SoundEvent = require("../Sound/SoundEvent");
cc.Class({
    extends: cc.Component,

    properties: {
    },
    onIconButtonClick() {
        cc.director.loadScene("Loading");
    },
    onPlayBgmButtonClick() {
        Emitter.emit(SoundEvent.SOUND_EVENTS.PLAY_BGM_REQUEST, 'room');
    }
});
