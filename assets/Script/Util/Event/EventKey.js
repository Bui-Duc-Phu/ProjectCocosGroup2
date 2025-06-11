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
        ON_BOMB_HIT: 'ON_BOMB_HIT',
        ON_ULTIMATE_HIT: 'ON_ULTIMATE_HIT',
    },
    PLAYER: {
        ON_HIT: 'ON_HIT',
        SHOOT_NORMAL: 'SHOOT_NORMAL_BULLET',
        SHOOT_ULTIMATE: 'SHOOT_ULTIMATE_BULLET',
        ON_DIE: 'PLAYER_ON_DIE',
        USE_BOMB: 'PLAYER_USE_BOMB',
        SHOOT_BOMB: 'SHOOT_BOMB_BULLET',
    },
    SCENE: {
        LOAD_LOBBY: 'LOAD_LOBBY', 
        LOAD_ROOM: 'LOAD_ROOM',   
    },
    GAME: {
        STATE_CHANGED: 'STATE_CHANGED',    
        REQUEST_EXIT: 'REQUEST_EXIT',            
        PREPARE_FOR_EXIT: 'PREPARE_FOR_EXIT', 
    },
    INPUT: {
        MOVE_UP: 'MOVE_UP',
        MOVE_DOWN: 'MOVE_DOWN',
        SHOOT_ULTIMATE: 'INPUT_SHOOT_ULTIMATE',
        USE_BOMB: 'INPUT_USE_BOMB',
    },
    ROOM: {
        PAUSE: 'ROOM_PAUSE',
        RESUME: 'ROOM_RESUME',
        RESTART: 'ROOM_RESTART',
        SHOOT_ULTIMATE: 'SHOOT_ULTIMATE',
        USE_BOMB: 'USE_BOMB',
    },
    WAVE: {
        WAVE_COMPLETE: 'WAVE_COMPLETE',
        START_SPECIFIC_WAVE: 'START_SPECIFIC_WAVE',
    },
};

module.exports = EventKey;