const Emitter = require('Emitter');
const EventKey = require('EventKey');
const StateMachine = require('javascript-state-machine');
const GoldController = require('GoldController');
const UpgradeController = require('UpgradeController');
const LocalStorageKey = require('LocalStorageKey');
const ItemName = require('ItemName');


const FSM_STATES = {
    LOBBY: 'Lobby',
    ROOM: 'Room',
    EXITING: 'Exiting',
};

cc.Class({
    extends: cc.Component,

    properties: {
        fsm: {
            default: null,
            visible: false,
        },
        isSceneLoading: {
            default: false,
            visible: false,
        },
        eventHandlers: {
            default: null,
            visible: false,
        },
        singletonList: {
            default: [],
            visible: false,
        },
    },

    onLoad() {
        this.init();
    },
    init() {
        if (cc.game['GAME_CONTROLLER_EXIST']) {
            this.node.destroy();
            return;
        }
        cc.game['GAME_CONTROLLER_EXIST'] = true;
        cc.game.addPersistRootNode(this.node);
        this.isSceneLoading = false;
        this.initializeStateMachine();
        this.registerEventListeners();
        this.addSingletonToList();
        let amount = cc.sys.localStorage.getItem(LocalStorageKey.PLAYER.BOMB_AMOUNT);
        if (amount === null) {
            amount = 0;
            cc.sys.localStorage.setItem(LocalStorageKey.PLAYER.BOMB_AMOUNT, amount);
        };
    },
    addSingletonToList() {
        this.singletonList.push(Emitter);
    },

    initializeStateMachine() {
        this.fsm = new StateMachine({
            init: 'init',
            transitions: [
                { name: 'enterRoom', from: [FSM_STATES.LOBBY, 'init'], to: FSM_STATES.ROOM },
                { name: 'leaveRoom', from: FSM_STATES.ROOM, to: FSM_STATES.LOBBY },
                { name: 'requestExit', from: [FSM_STATES.LOBBY, 'init'], to: FSM_STATES.EXITING }
            ],
            methods: {
                onEnterLobby: (lifecycle) => {
                    this.emitStateChange(FSM_STATES.LOBBY, lifecycle.from);
                },
                onEnterRoom: (lifecycle) => {
                    this.emitStateChange(FSM_STATES.ROOM, lifecycle.from);
                },
                onEnterExiting: (lifecycle) => {
                    Emitter.emit(EventKey.GAME.PREPARE_FOR_EXIT);
                    this.executeExitSteps();
                },
                onEnterRoom: () => {
                    if (this.isSceneLoading) {
                        return;
                    }
                    this.loadSceneInternal('Room');
                },
                onLeaveRoom: () => {
                    if (this.isSceneLoading) {
                        return;
                    }
                    this.loadSceneInternal('Lobby');
                },
            }
        });
    },

    emitStateChange(newState, oldState) {
        Emitter.emit(EventKey.GAME.STATE_CHANGED, newState, oldState);
    },

    registerEventListeners() {
        this.eventHandlers = {
            [EventKey.SCENE.LOAD_LOBBY]: this.onLoadLobbyRequest.bind(this),
            [EventKey.SCENE.LOAD_ROOM]: this.onLoadRoomRequest.bind(this),
            [EventKey.GAME.REQUEST_EXIT]: this.onRequestExit.bind(this),
        };
        for (const eventName in this.eventHandlers) {
            Emitter.registerEvent(eventName, this.eventHandlers[eventName]);
        }
    },

    unregisterEventListeners() {
        if (this.eventHandlers) {
            for (const eventName in this.eventHandlers) {
                Emitter.removeEvent(eventName, this.eventHandlers[eventName]);
            }
            this.eventHandlers = null;
        }
    },
    cleanupSingletonList() {
        for (let i = this.singletonList.length - 1; i >= 0; i--) {
            this.singletonList[i].destroy();
        };
        this.singletonList = [];
    },
    onLoadLobbyRequest() {
        this.fsm.leaveRoom();
    },
    onLoadRoomRequest() {
        this.fsm.enterRoom();
    },
    onRequestExit() {
        this.fsm.requestExit();
    },

    loadSceneInternal(sceneName) {
        if (sceneName === 'Room' && !this.roomInitLoad) {
            this.roomInitLoad = true;
            return;
        }
        if (sceneName === 'Lobby' && !this.lobbyInitLoad) {
            this.lobbyInitLoad = true;
            return;
        }
        this.isSceneLoading = true;
        cc.director.preloadScene(sceneName, (completedCount, totalCount,item) => {
            console.log(`Preloading scene ${sceneName}: ${completedCount}/${totalCount}`);
        },() => {
            cc.director.loadScene(sceneName);
            this.isSceneLoading = false;
        });
        Emitter.emit(EventKey.SOUND.STOP_BGM);
    },

    executeExitSteps() {
        this.cleanupSingletonList();
        this.unregisterEventListeners();
        cc.director.preloadScene('Portal', () => {
            cc.director.loadScene('Portal');
            cc.game['GAME_CONTROLLER_EXIST'] = false;
            cc.game.removePersistRootNode(this.node);
            this.node.destroy();
        });
    },
});