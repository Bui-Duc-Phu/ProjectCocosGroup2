const Emitter = require('Emitter');
const GameConfig = require('GameConfig');
const EventKey = require('EventKey');
cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node,
        },

    },
    onLoad() {
        this.init();
    },
    init() {
        this.registerEventListener();
    },
    registerEventListener() {
        const eventHandlers = {
            [EventKey.INPUT.MOVE_UP]: this.onMoveUp.bind(this),
            [EventKey.INPUT.MOVE_DOWN]: this.onMoveDown.bind(this),
            [EventKey.INPUT.SHOOT_ULTIMATE]: this.onShootUltimate.bind(this),
            [EventKey.INPUT.USE_BOMB]: this.onUseBomb.bind(this),
            [EventKey.ROOM.PAUSE]: this.onPause.bind(this),
            [EventKey.ROOM.RESUME]: this.onResume.bind(this),
            [EventKey.ROOM.RESTART]: this.onRestart.bind(this),
        };
        for (const event in eventHandlers) {
            Emitter.registerEvent(event, eventHandlers[event]);
        }
    },
    onMoveUp() {
        this.player.getComponent('Player').fsm.toMoveUp();
    },
    onMoveDown() {
        this.player.getComponent('Player').fsm.toMoveDown();
    },
    onShootUltimate() {
        this.player.getComponent('Player').fsm.toShootUltimate();
    },
    onUseBomb() {
        this.player.getComponent('Player').fsm.toUseBomb();
    },
    onPause() {
        this.player.getComponent('Player').fsm.toPortal();
    },
    onResume() {
        this.player.getComponent('Player').fsm.toShoot();
    },
    onRestart() {
        this.player.getComponent('Player').init();
        this.player.getComponent('Player').fsm.toShoot();
    },
    onDestroy() {
        for (const event in this.eventHandlers) {
            Emitter.unregisterEvent(event, this.eventHandlers[event]);
        }
    },
});
