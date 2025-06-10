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
    },
    GOLD:{
        CHANGE_GOLD: 'CHANGE_GOLD'
    },
    MONSTER: {
        ON_HIT  : 'ON_HIT',
        ON_DIE: 'ON_DIE',

        ON_ULTIMATE_HIT: 'ON_ULTIMATE_HIT',
    },
    PLAYER: {
        ON_HIT: 'ON_HIT',
        SHOOT_NOMAL: 'SHOOT_NOMAL_BULLET',
        SHOOT_ULTIMATE: 'SHOOT_ULTIMATE_BULLET',

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