const Emitter = require('Emitter');
const EventKey = require('EventKey');

const LocalStorageKey = require('LocalStorageKey')


cc.Class({
    extends: cc.Component,

    properties: {
        bgmList: {
            default: [],
            type: cc.AudioClip
        },
        sfxList: {
            default: [],
            type: cc.AudioClip
        },
        bgmVolume: {
            default: 1,
            type: cc.Float,
            range: [0.0, 1, 0.1],
            slide: true
        },
        sfxVolume: {
            default: 0,
            type: cc.Float,
            range: [0.0, 1, 0.1],
            slide: true
        },
        currentBgmAudioId: null,
        currentClickAudioId: null,
    },

    onLoad() {
        this.getBGMVolumes();
        this.getSFXVolume();
        this.registerEvents();
        cc.game.addPersistRootNode(this.node);
    },

    registerEvents() {
        this.eventHandlers = {
            [EventKey.SOUND.ENABLE_BGM]: this.onEnableBGM.bind(this),
            [EventKey.SOUND.SET_BGM_VOLUME]: this.setBGMVolume.bind(this),
            [EventKey.SOUND.SET_SFX_VOLUME]: this.setSFXVolume.bind(this),
            [EventKey.SOUND.PLAY_SFX]: this.playSFX.bind(this),
            [EventKey.SOUND.PLAY_BGM]: this.playBGM.bind(this),
            [EventKey.SOUND.STOP_BGM]: this.stopBGM.bind(this),
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
    getBGMVolumes() {
        let storedBgmVolume = cc.sys.localStorage.getItem(LocalStorageKey.SOUND.BGM_VOLUME_KEY);
        if (storedBgmVolume !== null) {
            this.bgmVolume = parseFloat(storedBgmVolume);
        } else {
            cc.sys.localStorage.setItem(LocalStorageKey.SOUND.BGM_VOLUME_KEY, this.bgmVolume.toString());
        }
        return this.bgmVolume;
    },
    getSFXVolume() {
        let storedSfxVolume = cc.sys.localStorage.getItem(LocalStorageKey.SOUND.SFX_VOLUME_KEY);
        if (storedSfxVolume !== null) {
            this.sfxVolume = parseFloat(storedSfxVolume);
        } else {
            cc.sys.localStorage.setItem(LocalStorageKey.SOUND.SFX_VOLUME_KEY, this.sfxVolume.toString());
        }
        return this.sfxVolume;
    },
    setBGMVolume(newVolume) {
        this.bgmVolume = newVolume;
        cc.audioEngine.setVolume(this.currentBgmAudioId, this.bgmVolume);
        cc.sys.localStorage.setItem(LocalStorageKey.SOUND.BGM_VOLUME_KEY, this.bgmVolume.toString());
    },
    setSFXVolume(newVolume) {
        this.sfxVolume = newVolume;
        cc.audioEngine.setVolume(this.currentClickAudioId, this.sfxVolume);
        cc.sys.localStorage.setItem(LocalStorageKey.SOUND.SFX_VOLUME_KEY, this.sfxVolume.toString());
    },
    onEnableBGM(isEnabled, bgmName) {
        console.log("vo ham enabel bgm")
        if (isEnabled) {
            console.log("nhan su kien phat bgm");
            this.playBGM(bgmName);
        } else {
            this.stopBGM();
        }
    },
    playBGM(bgmName) {
        if (this.currentBgmAudioId !== null) {
            cc.audioEngine.stop(this.currentBgmAudioId);
        }
        let bgmClip = this.bgmList.find(clip => clip.name === bgmName);
        this.currentBgmAudioId = cc.audioEngine.play(bgmClip, true, this.bgmVolume);
    },
    playSFX(sfxName) {
        let sfxClip = this.sfxList.find(clip => clip.name === sfxName);
        this.sfxAudioId = cc.audioEngine.play(sfxClip, false, this.sfxVolume);
    },
    stopBGM() {
        if (this.currentBgmAudioId !== null) {
            cc.audioEngine.stop(this.currentBgmAudioId);
            this.currentBgmAudioId = null;
        }
    },
});