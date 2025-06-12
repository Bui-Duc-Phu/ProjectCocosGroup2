const Emitter = require('Emitter');
const EventKey = require('EventKey');
const AudioName = require('AudioName');
const LocalStorageKey = require('LocalStorageKey')


cc.Class({
    extends: require('PopupItem'),

    properties: {
        volumeDefault: {
            type: cc.Float,
            default: 0.3
        },
        toggleBGM: {
            type: cc.Toggle,
            default: null
        },
        sliderSoundBGM: {
            type: cc.Slider,
            default: null
        },
        backGroundSliderBGM: {
            type: cc.Node,
            default: null
        },
        toggleSFX: {
            type: cc.Toggle,
            default: null
        },
        sliderSoundSFX: {
            type: cc.Slider,
            default: null
        },
        backGroundSliderSFX: {
            type: cc.Node,
            default: null
        },
        quitButton: {
            type: cc.Button,
            default: null
        },
    },
    onLoad() {
        this.init();
        
    },
    init() {
        const volumeBGM = cc.sys.localStorage.getItem(LocalStorageKey.SOUND.BGM_VOLUME_KEY);
        const volumeSFX = cc.sys.localStorage.getItem(LocalStorageKey.SOUND.SFX_VOLUME_KEY);
        console.log("volume df", this.volumeDefault)
        this.enableBGM = true;

        this.sliderSoundBGM.progress = volumeBGM;
        this.toggleBGM.target.active = false;
        this.backGroundSliderBGM.width = volumeBGM * this.sliderSoundBGM.node.width;

        this.sliderSoundSFX.progress = volumeSFX;
        this.toggleSFX.target.active = false;
        this.backGroundSliderSFX.width = volumeSFX * this.sliderSoundSFX.node.width;

        const sliderNode = this.sliderSoundSFX.node;
        sliderNode.on(cc.Node.EventType.TOUCH_END, this.onSliderSFXEnd, this);
        sliderNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderSFXEnd, this);
        const handle = this.sliderSoundSFX.handle.node;
        handle.on(cc.Node.EventType.TOUCH_END, this.onSliderSFXEnd, this);
        handle.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderSFXEnd, this);
    },
    onToggleBGMChanged() {
        if (this.toggleBGM.isChecked) {
            this.sliderSoundBGM.progress = this.sliderSoundBGM.progress || 0.1;
            this.toggleBGM.target.active = false;
            this.toggleBGM.checkMark.node.active = true;

            Emitter.emit(EventKey.SOUND.SET_BGM_VOLUME, this.sliderSoundBGM.progress);
            Emitter.emit(EventKey.SOUND.ENABLE_BGM, this.enableBGM, AudioName.BGM.LOBBY);
            this.backGroundSliderBGM.width = this.sliderSoundBGM.progress * this.sliderSoundBGM.node.width;
        } else {
            this.toggleBGM.target.active = true;
            this.toggleBGM.checkMark.node.active = false;

            Emitter.emit(EventKey.SOUND.ENABLE_BGM, !this.enableBGM, AudioName.BGM.LOBBY);
            this.backGroundSliderBGM.width = 0;
            this.sliderSoundBGM.progress = 0;
        }
    },

    onSliderBGMChange() {
        let volume = this.sliderSoundBGM.progress;
        this.backGroundSliderBGM.width = volume * this.sliderSoundBGM.node.width;
        console.log(volume);
        Emitter.emit(EventKey.SOUND.SET_BGM_VOLUME, volume);

        if (volume === 0) {
            this.toggleBGM.target.active = true;
            this.toggleBGM.checkMark.node.active = false;
            this.toggleBGM.isChecked = false;
        } else if (volume !== 0 && this.toggleBGM.target.active === true) {
            this.toggleBGM.target.active = false;
            this.toggleBGM.checkMark.node.active = true;
            this.toggleBGM.isChecked = true;
        }
    },

    onSliderSFXChange() {
        let volume = this.sliderSoundSFX.progress;
        this.backGroundSliderSFX.width = volume * this.sliderSoundSFX.node.width;
        if (volume === 0) {
            this.toggleSFX.target.active = true;
            this.toggleSFX.checkMark.node.active = false;
            this.toggleSFX.isChecked = false;
        } else {
            this.toggleSFX.target.active = false;
            this.toggleSFX.checkMark.node.active = true;
            this.toggleSFX.isChecked = true;
        }
    },

    onSliderSFXEnd() {
        let volume = this.sliderSoundSFX.progress;

        Emitter.emit(EventKey.SOUND.SET_SFX_VOLUME, volume);
        Emitter.emit(EventKey.SOUND.PLAY_SFX, AudioName.SFX.CLICK);

        if (volume === 0) {
            this.toggleSFX.target.active = true;
            this.toggleSFX.checkMark.node.active = false;
            this.toggleSFX.isChecked = false;
        } else {
            this.toggleSFX.target.active = false;
            this.toggleSFX.checkMark.node.active = true;
            this.toggleSFX.isChecked = true;
        }
    },

    onToggleSFXChanged() {
        if (this.toggleSFX.isChecked) {

            this.sliderSoundSFX.progress = this.sliderSoundSFX.progress || 0.1;
            this.toggleSFX.target.active = false;
            this.toggleSFX.checkMark.node.active = true;

            Emitter.emit(EventKey.SOUND.SET_SFX_VOLUME, this.sliderSoundSFX.progress);
            Emitter.emit(EventKey.SOUND.PLAY_SFX);
            this.backGroundSliderSFX.width = this.sliderSoundSFX.progress * this.sliderSoundSFX.node.width;
        } else {
            this.toggleSFX.target.active = true;
            this.toggleSFX.checkMark.node.active = false;

            Emitter.emit(EventKey.SOUND.SET_SFX_VOLUME, 0);
            this.backGroundSliderSFX.width = 0;
            this.sliderSoundSFX.progress = 0;
        }
    },
    onQuitButtonClicked() {
        if (cc.director.getScene().name === 'Lobby') {
            Emitter.emit(EventKey.GAME.REQUEST_EXIT);
        } else {
            Emitter.emit(EventKey.ROOM.EXIT);
            if (!cc.director.getScene().name === 'Room') {
                return;
            }
            cc.director.resume();
            this.hide();
        }
    },
    onRoomResume() {
        if (!cc.director.getScene().name === 'Room') {
            return;
        }
        cc.director.resume();
    }

});
