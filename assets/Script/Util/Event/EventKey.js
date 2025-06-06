const EventKey = {
    SOUND: {
        SET_BGM_VOLUME: 'soundControllerSetBgmVolumeRequest',
        SET_SFX_VOLUME: 'soundControllerSetSfxVolumeRequest',
        ON_CLICK_SOUND: 'soundControllerPlayClickSoundRequest',
        PLAY_BGM: 'soundControllerPlayBgmRequest',
        STOP_BGM: 'soundControllerStopBgmRequest',
    },
    POPUP: {
        SHOW: 'showPopup',
        // SHOW_SHOP: 'showPopupShop',
        // SHOW_HERO: 'showPopupHero',
        // SHOW_SKILL: 'showPopupSkill',
    }
};

module.exports = EventKey;