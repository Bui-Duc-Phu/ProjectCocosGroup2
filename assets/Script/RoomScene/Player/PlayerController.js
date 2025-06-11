const Emitter = require('Emitter');
const GameConfig = require('GameConfig');
const EventKey = require('EventKey');
cc.Class({
    extends: cc.Component,

    properties: {
        playerPrefab: {
            default: null,
            type: cc.Prefab,
        },
        playerList: {
            default: [],
            type: [cc.Node],
            visible: false,
        },

    },
    onLoad() {
        this.init();
    },
    init() {
        this.registerEventListener();
        this.createPlayer();
    },
    createPlayer() {
        this.playerNode = cc.instantiate(this.playerPrefab);
        this.node.addChild(this.playerNode);
        this.playerScript = this.playerNode.getChildByName('PlayerSpine').getComponent('Player');
        this.playerList.push(this.playerNode);
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
        if (!this.playerScript.fsm.can('toMoveUp')) {
            return;
        }
        if (this.playerScript.currentHP <= 0) {
            return;
        }
        this.playerScript.fsm.toMoveUp();
    },
    onMoveDown() {
        if (!this.playerScript.fsm.can('toMoveDown')) {
            return;
        }
        if (this.playerScript.currentHP <= 0) {
            return;
        }
        this.playerScript.fsm.toMoveDown();
    },
    onShootUltimate() {
        if (!this.playerScript.fsm.can('toShootUltimate')) {
            return;
        }
        if (this.playerScript.currentHP <= 0) {
            return;
        }
        this.playerScript.fsm.toShootUltimate();
    },
    onUseBomb() {
        if (!this.playerScript.fsm.can('toUseBomb')) {
            return;
        }
        if (this.playerScript.currentHP <= 0) {
            return;
        }
        this.playerScript.fsm.toUseBomb();
    },
    onPause() {
    },
    onResume() {
    },
    onRestart() {
    },
    onDestroy() {
        for (const event in this.eventHandlers) {
            Emitter.unregisterEvent(event, this.eventHandlers[event]);
        }
    },
});
