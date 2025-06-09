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
        ON_DIE: 'ON_DIE',
    },
    SCENE: {
        LOAD_LOBBY: 'LOAD_LOBBY', 
        LOAD_ROOM: 'LOAD_ROOM',   
    },

    GAME: {
        STATE_CHANGED: 'STATE_CHANGED',    
        REQUEST_EXIT: 'REQUEST_EXIT',            
        PREPARE_FOR_EXIT: 'PREPARE_FOR_EXIT', 
    }
};

module.exports = EventKey;