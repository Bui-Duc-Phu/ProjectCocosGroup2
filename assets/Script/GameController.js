const Emitter = require('Emitter');
const GameConfig = require('GameConfig');
const SpineAnimation = require('SpineAnimation');
const EventKey = require('EventKey');
const StateMachine = require('javascript-state-machine');

const FSM_STATE = {
    IDLE: 'idle',
    MOVE: 'move',
    SHOOT: 'shoot',
    SHOOT_ULTIMATE: 'shootUltimate',
    HIT: 'hit',
    DIE: 'die',
};

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
        this.initStateMachine();
    },

    initStateMachine() {
        this.currentHP = this.maxHP;
        this.fsm = new StateMachine({
            init: FSM_STATE.IDLE,
            transitions: [
                { name: 'toIdle', from: '*', to: FSM_STATE.IDLE },
                { name: 'toMove', from: [FSM_STATE.IDLE, FSM_STATE.HIT, FSM_STATE.SHOOT, FSM_STATE.SHOOT_ULTIMATE], to: FSM_STATE.MOVE },
                { name: 'toShoot', from: [FSM_STATE.IDLE, FSM_STATE.MOVE], to: FSM_STATE.SHOOT },
                { name: 'toShootUltimate', from: [FSM_STATE.IDLE, FSM_STATE.MOVE], to: FSM_STATE.SHOOT_ULTIMATE },
                { name: 'toHit', from: [FSM_STATE.IDLE, FSM_STATE.MOVE, FSM_STATE.SHOOT, FSM_STATE.SHOOT_ULTIMATE], to: FSM_STATE.HIT },
                { name: 'toDie', from: '*', to: FSM_STATE.DIE },
            ],
            methods: {
                onEnterIdle: () => this.handleEnterIdle(),
                onEnterMove: () => this.handleEnterMove(),
                onEnterShoot: () => this.handleEnterShoot(),
                onEnterShootUltimate: () => this.handleEnterShootUltimate(),
                onEnterHit: () => this.handleEnterHit(),
                onEnterDie: () => this.handleEnterDie(),
            },
        });
    },

    handleEnterIdle() {
        Emitter.emit(EventKey.PLAYER.STATE_CHANGED, FSM_STATE.IDLE);
    },

    handleEnterMove() {
        Emitter.emit(EventKey.PLAYER.STATE_CHANGED, FSM_STATE.MOVE);
    },

    handleEnterShoot() {
        Emitter.emit(EventKey.PLAYER.STATE_CHANGED, FSM_STATE.SHOOT);
    },

    handleEnterShootUltimate() {
        Emitter.emit(EventKey.PLAYER.STATE_CHANGED, FSM_STATE.SHOOT_ULTIMATE);
    },

    handleEnterHit() {
        Emitter.emit(EventKey.PLAYER.STATE_CHANGED, FSM_STATE.HIT);
    },

    handleEnterDie() {
        Emitter.emit(EventKey.PLAYER.STATE_CHANGED, FSM_STATE.DIE);
    },

    changeState(newStateMethodName) {
        if (this.fsm && this.fsm.can(newStateMethodName)) {
            this.fsm[newStateMethodName]();
        }
    },

    takeDamage(amount) {
        if (this.fsm.is(FSM_STATE.DIE)) return;

        this.currentHP -= amount;
        Emitter.emit(EventKey.PLAYER.ON_HIT, this.currentHP, this.maxHP);

        if (this.currentHP <= 0) {
            this.currentHP = 0;
            this.changeState('toDie');
        } else {
            this.changeState('toHit');
        }
    },
});