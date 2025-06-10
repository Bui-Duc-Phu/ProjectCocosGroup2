const Emitter = require('Emitter');
const GameConfig = require('GameConfig');
const SpineAnimation = require('SpineAnimation');
const EventKey = require('EventKey');
const StateMachine = require('javascript-state-machine');

cc.Class({
    extends: cc.Component,
    properties: {
        maxHP: {
            default: 1500,
            type: cc.Integer,
        },
        currentHP: {
            default: 1500,
            type: cc.Integer,
            visible: false,
        },

        fsm: {
            default: null,
            serializable: false,
        },
    },

    onLoad() {
        this.init();
    },
    init() {
        this.currentHP = this.maxHP;
        this.fsm = new StateMachine({
            init: 'idle',
            transitions: [
                { name: 'idle', from: '*', to: 'idle' },
                { name: 'move', from: '*', to: 'move' },
                { name: 'attack', from: '*', to: 'attack' },
                { name: 'die', from: '*', to: 'die' },
            ],
            methods: {
                onEnterState(state) {
                    Emitter.emit(EventKey.PLAYER_STATE_CHANGE, state);
                },
            },
        });
    },
});