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

    },
    registerEventListener() {
        const eventHandlers = {
            [EventKey.INPUT.MOVE_UP]: this.onMoveUp.bind(this),
            [EventKey.INPUT.MOVE_DOWN]: this.onMoveDown.bind(this),
            [EventKey.INPUT.SHOOT_ULTIMATE]: this.onShootUltimate.bind(this),
            [EventKey.INPUT.USE_BOMB]: this.onUseBomb.bind(this),
        };
        for (const event in eventHandlers) {
            Emitter.registerEvent(event, eventHandlers[event]);
        }
    },
});
