const Emitter = require('Emitter');
const EventKey = require('EventKey');
const StateMachine = require('javascript-state-machine');

const FSM_STATES = {
    LOADING: 'Loading',
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
        cc.game.addPersistRootNode(this.node);
        this.isSceneLoading = false;
        this.initializeStateMachine();
        this.registerEventListeners();
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLaunched, this);
    },

    onDestroy() {
        this.unregisterEventListeners();
        cc.director.off(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLaunched, this);
    },

    addSingletonToList() {
        this.singletonList.push(Emitter);
    },

    initializeStateMachine() {
        this.fsm = new StateMachine({
            init: FSM_STATES.LOADING,
            transitions: [
                { name: 'finishLoading', from: FSM_STATES.LOADING, to: FSM_STATES.LOBBY },
                { name: 'enterRoom', from: FSM_STATES.LOBBY, to: FSM_STATES.ROOM },
                { name: 'leaveRoom', from: FSM_STATES.ROOM, to: FSM_STATES.LOBBY },
                { name: 'requestExit', from: FSM_STATES.LOBBY, to: FSM_STATES.EXITING }
            ],
            methods: {
                onEnterLoading: (lifecycle) => {
                    this.emitStateChange(FSM_STATES.LOADING, lifecycle.from);
                },
                onEnterLobby: (lifecycle) => {
                    this.emitStateChange(FSM_STATES.LOBBY, lifecycle.from);
                },
                onEnterRoom: (lifecycle) => {
                    this.emitStateChange(FSM_STATES.ROOM, lifecycle.from);
                },
                onEnterExiting: (lifecycle) => {
                    this.emitStateChange(FSM_STATES.EXITING, lifecycle.from);
                    this.executeExitSteps();
                },

                onFinishLoading: () => {
                    this.loadSceneInternal('Lobby');
                },
                onEnterRoom: () => {
                    this.loadSceneInternal('Room');
                },
                onLeaveRoom: () => {
                    this.loadSceneInternal('Lobby');
                },
            }
        });
        this.emitStateChange(FSM_STATES.LOADING, 'None');
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
    cleanupSingletons() {
        for (let i = this.singletonList.length - 1; i >= 0; i--) {
            this.singletonList[i].destroy();
        };
        this.singletonList = [];
    },
    onLoadLobbyRequest() {
        if (this.fsm.is(FSM_STATES.LOADING)) {
            this.fsm.finishLoading();
        } else if (this.fsm.is(FSM_STATES.ROOM)) {
            this.fsm.leaveRoom();
        }
    },

    onLoadRoomRequest() {
        this.fsm.enterRoom();
    },

    onRequestExit() {
        this.fsm.requestExit();
    },

    onSceneLaunched(scene) {
        this.isSceneLoading = false;
    },

    loadSceneInternal(sceneName) {
        this.isSceneLoading = true;
        cc.director.preloadScene(sceneName, () => {
            cc.director.loadScene(sceneName);
        });
    },

    executeExitSteps() {
        this.cleanupSingletons();
        Emitter.emit(EventKey.GAME.PREPARE_FOR_EXIT);
        this.node.destroy();
        cc.game.end();
    },
});