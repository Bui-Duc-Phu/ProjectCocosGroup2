const Emitter = require('Emitter');
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
        playerScriptList: {
            default: [],
            type: [require('Player')],
            visible: false,
        },
        playerIndex: {
            default: 0,
            type: cc.Integer,
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
        this.playerScriptList.push(this.playerScript);
        this.playerIndex += 1;
        this.playerScript.node.name = `Player${this.playerIndex}`;
    },
    registerEventListener() {
        this.eventHandlers = {
            [EventKey.INPUT.MOVE_UP]: this.onMoveUp.bind(this),
            [EventKey.INPUT.MOVE_DOWN]: this.onMoveDown.bind(this),
            [EventKey.INPUT.SHOOT_ULTIMATE]: this.onShootUltimate.bind(this),
            [EventKey.INPUT.USE_BOMB]: this.onUseBomb.bind(this),
        };
        for (const event in this.eventHandlers) {
            Emitter.registerEvent(event, this.eventHandlers[event]);
        }
    },
    onMoveUp() {
        if (!this.playerScript.fsm.can('toMoveUp')) {
            return;
        }
        this.playerScript.fsm.toMoveUp();
        console.log('PlayerController onMoveUp');
    },
    onMoveDown() {
        if (!this.playerScript.fsm.can('toMoveDown')) {
            return;
        }
        this.playerScript.fsm.toMoveDown();
        console.log('PlayerController onMoveDown');
    },
    onShootUltimate() {
        if (!this.playerScript.fsm.can('toShootUltimate')) {
            return;
        }
        this.playerScript.fsm.toShootUltimate();
    },
    onUseBomb() {
        if (!this.playerScript.fsm.can('toUseBomb')) {
            return;
        }
        this.playerScript.fsm.toUseBomb();
    },
    onDestroy() {
        for (const event in this.eventHandlers) {
            Emitter.removeEvent(event, this.eventHandlers[event]);
        }
    },
});
