const Emitter = require('Emitter');
const EventKey = require('EventKey');
const audioName = require('audioName');

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
        this.getBGMVolumes();
        this.getSFXVolume();
        this.registerEvents();

        cc.game.addPersistRootNode(this.node);
    },

    registerEvents() {
        this.eventHandlers = {
            [EventKey.SOUND.SET_BGM_VOLUME]: this.setBGMVolume.bind(this),
            [EventKey.SOUND.SET_SFX_VOLUME]: this.setSFXVolume.bind(this),
            [EventKey.SOUND.ON_CLICK_SOUND]: this.playSFX.bind(this),
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
        let storedBgmVolume = cc.sys.localStorage.getItem(BGM_VOLUME_KEY);
        if (storedBgmVolume !== null) {
            this.bgmVolume = parseFloat(storedBgmVolume);
        } else {
            cc.sys.localStorage.setItem(BGM_VOLUME_KEY, this.bgmVolume.toString());
        }
        return this.bgmVolume;
    },
    getSFXVolume() {
        let storedSfxVolume = cc.sys.localStorage.getItem(SFX_VOLUME_KEY);
        if (storedSfxVolume !== null) {
            this.effectVolume = parseFloat(storedSfxVolume);
        } else {
            cc.sys.localStorage.setItem(SFX_VOLUME_KEY, this.effectVolume.toString());
        }
        return this.effectVolume;
    },
    setBGMVolume(newVolume) {
        this.bgmVolume = newVolume;
        cc.audioEngine.setVolume(this.currentBgmAudioId, this.bgmVolume);
        cc.sys.localStorage.setItem(BGM_VOLUME_KEY, this.bgmVolume.toString());
    },
    setSFXVolume(newVolume) {
        this.effectVolume = newVolume;
        cc.audioEngine.setVolume(this.currentClickAudioId, this.effectVolume);
        cc.sys.localStorage.setItem(SFX_VOLUME_KEY, this.effectVolume.toString());
    },
    playBGM(bgmName) {
        if (this.currentBgmAudioId !== null) {
            cc.audioEngine.stop(this.currentBgmAudioId);
        }
        if (bgmName === audioName.BGM.LOBBY) {
            this.currentBgmAudioId = cc.audioEngine.play(this.audioLobbyBgm, true, this.bgmVolume);
        }
        else if (bgmName === audioName.BGM.ROOM) {
            this.currentBgmAudioId = cc.audioEngine.play(this.audioRoomBgm, true, this.bgmVolume);
        }
        console.log("Playing BGM:", bgmName, "with volume:", this.bgmVolume);
    },
    playSFX(sfxName) {
        switch (sfxName) {
            case audioName.SFX.CLICK:
                cc.audioEngine.play(this.audioClick, false, this.effectVolume);
                break;
            default:
                cc.audioEngine.play(this.audioClick, false, this.effectVolume);
        }
    },
    stopBGM() {
        if (this.currentBgmAudioId !== null) {
            cc.audioEngine.stop(this.currentBgmAudioId);
            this.currentBgmAudioId = null;
        }
    },
});