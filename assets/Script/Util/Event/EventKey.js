const EventKey = {
    SOUND: {
        SET_BGM_VOLUME: 'SET_BGM_VOLUME',
        SET_SFX_VOLUME: 'SET_SFX_VOLUME',
        PLAY_SFX: 'PLAY_SFX',
        ENABLE_BGM: 'ENABLE_BGM',
        PLAY_BGM: 'PLAY_BGM',
        STOP_BGM: 'STOP_BGM',
    },
    POPUP: {
        SHOW: 'showPopup',
        // SHOW_SHOP: 'showPopupShop',
        // SHOW_HERO: 'showPopupHero',
        // SHOW_SKILL: 'showPopupSkill',
    },
    MONSTER: {
        ON_HIT  : 'ON_HIT',
        ON_DIE: 'ON_DIE',
    },
    PLAYER: {
        ON_HIT: 'ON_HIT',
        SHOOT_NOMAL: 'SHOOT_NOMAL_BULLET',
        SHOOT_ULTIMATE: 'SHOOT_ULTIMATE_BULLET',
    }
};

module.exports = EventKey;