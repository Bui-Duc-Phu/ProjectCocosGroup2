const Emitter = require('../Utils/Emitter');
const SoundEvent = require('../Sound/SoundEvent');

const BGM_VOLUME_KEY = 'game_bgmVolume';
const SFX_VOLUME_KEY = 'game_sfxVolume';

cc.Class({
    extends: cc.Component,

    properties: {
        audioClick: {
            default: null,
            type: cc.AudioClip
        },
        audioLobbyBgm: {
            default: null,
            type: cc.AudioClip
        },
        audioRoomBgm: {
            default: null,
            type: cc.AudioClip
        },
        audioGold: {
            default: null,
            type: cc.AudioClip
        },
        bgmVolume: {
            default: 1,
            type: cc.Float,
            range: [0.0, 1, 0.1],
            slide: true
        },
        effectVolume: {
            default: 0,
            type: cc.Float,
            range: [0.0, 1, 0.1],
            slide: true
        },
        currentBgmAudioId: null,
        currentClickAudioId: null,
    },

    onLoad() {
        this.loadInitialVolumes();
        this.registerEvents();

        this.node.parent = null;
        cc.game.addPersistRootNode(this.node);
    },

    registerEvents() {
        this.eventHandlers = {
            [SoundEvent.SOUND_EVENTS.SET_BGM_VOLUME_REQUEST]: this.handleSetBgmVolumeRequest.bind(this),
            [SoundEvent.SOUND_EVENTS.SET_SFX_VOLUME_REQUEST]: this.handleSetSfxVolumeRequest.bind(this),
            [SoundEvent.SOUND_EVENTS.PLAY_CLICK_SOUND_REQUEST]: this.playSoundClick.bind(this),
            [SoundEvent.SOUND_EVENTS.PLAY_BGM_REQUEST]: this.playBgm.bind(this),
            [SoundEvent.SOUND_EVENTS.STOP_BGM_REQUEST]: this.stopBgm.bind(this),
        };
        for (const event in this.eventHandlers) {
            Emitter.registerEvent(event, this.eventHandlers[event]);
        }
    },
    onDestroy() {
        for (const event in this.eventHandlers) {
            Emitter.removeEvent(event, this.eventHandlers[event]);
        }
        cc.audioEngine.stop(this.currentBgmAudioId);
    },
    loadInitialVolumes() {
        let storedBgmVolume = cc.sys.localStorage.getItem(BGM_VOLUME_KEY);
        if (storedBgmVolume !== null) {
            this.bgmVolume = parseFloat(storedBgmVolume);
        } else {
            cc.sys.localStorage.setItem(BGM_VOLUME_KEY, this.bgmVolume.toString());
        }

        let storedSfxVolume = cc.sys.localStorage.getItem(SFX_VOLUME_KEY);
        if (storedSfxVolume !== null) {
            this.effectVolume = parseFloat(storedSfxVolume);
        } else {
            cc.sys.localStorage.setItem(SFX_VOLUME_KEY, this.effectVolume.toString());
        }
    },
    handleSetBgmVolumeRequest(newVolume) {
        this.bgmVolume = Math.max(0, Math.min(1, newVolume));
        cc.audioEngine.setVolume(this.currentBgmAudioId, this.bgmVolume);
        cc.sys.localStorage.setItem(BGM_VOLUME_KEY, this.bgmVolume.toString());
    },
    handleSetSfxVolumeRequest(newVolume) {
        this.effectVolume = Math.max(0, Math.min(1, newVolume));
        cc.audioEngine.setVolume(this.currentClickAudioId, this.effectVolume);
        cc.sys.localStorage.setItem(SFX_VOLUME_KEY, this.effectVolume.toString());
    },
    playBgm(bgmName) {
        if (this.currentBgmAudioId !== null) {
            cc.audioEngine.stop(this.currentBgmAudioId);
        }
        if (bgmName === 'lobby') {
            this.currentBgmAudioId = cc.audioEngine.play(this.audioLobbyBgm, true, this.bgmVolume);
        }
        else if (bgmName === 'room') {
            this.currentBgmAudioId = cc.audioEngine.play(this.audioRoomBgm, true, this.bgmVolume);
        }
        console.log("Playing BGM:", bgmName, "with volume:", this.bgmVolume);
    },
    playSoundClick() {
        this.currentClickAudioId = cc.audioEngine.play(this.audioClick, false, this.effectVolume);
        console.log("Playing click sound with volume:", this.effectVolume);
    },
    stopBgm() {
        if (this.currentBgmAudioId !== null) {
            cc.audioEngine.stop(this.currentBgmAudioId);
            this.currentBgmAudioId = null;
        }
    },
});