const Emitter = require('Emitter');
const GameConfig = require('GameConfig');
const SpineAnimation = require('SpineAnimation');
const EventKey = require('EventKey');
const StateMachine = require('javascript-state-machine');

const FSM_STATE = {
    PORTAL: 'portal',
    SHOOT: 'shoot',
    MOVE_UP: 'moveUp',
    MOVE_DOWN: 'moveDown',
    SHOOT_ULTIMATE: 'shootUltimate',
    HIT: 'hit',
    DIE: 'die',
    USE_BOMB: 'useBomb',
};

cc.Class({
    extends: cc.Component,
    properties: {
        maxHP: {
            default: 1500,
            type: cc.Integer,
            visible: false,
        },
        currentHP: {
            default: 1500,
            type: cc.Integer,
            visible: false,
        },
        fsm: {
            default: null,
            serializable: false,
            visible: false,
        },
        playerSpine: {
            default: null,
            type: sp.Skeleton,
            visible: false,
        },
        hpProgressBar: {
            default: null,
            type: cc.ProgressBar,
        },
    },
    onLoad() {
        this.init();
        console.log('Player component loaded');
    },
    init() {
        this.currentHP = this.maxHP;
        this.playerSpine = this.node.getComponent(sp.Skeleton);
        this.hpProgressBar.progress = this.currentHP / this.maxHP;
        this.node.setPosition(-550,0);
        this.initStateMachine();
    },
    initStateMachine() {
        this.fsm = new StateMachine({
            init: FSM_STATE.PORTAL,
            transitions: [
                { name: 'toPortal', from: '*', to: FSM_STATE.PORTAL },
                { name: 'toShoot', from: '*', to: FSM_STATE.SHOOT },
                { name: 'toMoveUp', from: [FSM_STATE.SHOOT, FSM_STATE.HIT, FSM_STATE.PORTAL, FSM_STATE.MOVE_DOWN], to: FSM_STATE.MOVE_UP },
                { name: 'toMoveDown', from: [FSM_STATE.SHOOT, FSM_STATE.HIT, FSM_STATE.PORTAL, FSM_STATE.MOVE_UP], to: FSM_STATE.MOVE_DOWN },
                { name: 'toUseBomb', from: [FSM_STATE.SHOOT, FSM_STATE.MOVE_UP, FSM_STATE.MOVE_DOWN], to: FSM_STATE.USE_BOMB },
                { name: 'toShootUltimate', from: [FSM_STATE.SHOOT, FSM_STATE.MOVE_UP, FSM_STATE.MOVE_DOWN], to: FSM_STATE.SHOOT_ULTIMATE },
                { name: 'toHit', from: [FSM_STATE.SHOOT, FSM_STATE.MOVE_UP, FSM_STATE.MOVE_DOWN, FSM_STATE.SHOOT_ULTIMATE], to: FSM_STATE.HIT },
                { name: 'toDie', from: '*', to: FSM_STATE.DIE },
            ],
            methods: {
                onEnterPortal: () => this.handleEnterPortal(),
                onEnterShoot: () => this.handleEnterShoot(),
                onLeaveShoot: () => this.handleLeaveShoot(),
                onEnterMoveUp: () => this.handleEnterMoveUp(),
                onEnterMoveDown: () => this.handleEnterMoveDown(),
                onEnterShootUltimate: () => this.handleEnterShootUltimate(),
                onEnterHit: () => this.handleEnterHit(),
                onEnterDie: () => this.handleEnterDie(),
                onUseBomb: () => this.handleUseBomb(),

                onLeavePortal: () => this.playerSpine.setCompleteListener(null),
                onLeaveMoveUp: () => this.playerSpine.setCompleteListener(null),
                onLeaveMoveDown: () => this.playerSpine.setCompleteListener(null),
                onLeaveShootUltimate: () => this.playerSpine.setCompleteListener(null),
                onLeaveHit: () => this.playerSpine.setCompleteListener(null),
            },
        });
    },
    handleEnterPortal() {
        this.playerSpine.setAnimation(1, SpineAnimation.PORTAL, false);
        this.playerSpine.setCompleteListener(() => {
            this.playerSpine.setAnimation(0, SpineAnimation.HOVERBOARD, false);
            this.fsm.toShoot();
            this.node.angle = 10;
        });
    },
    handleEnterShoot() {
        this.playerSpine.setAnimation(2, SpineAnimation.SHOOT, true);
    },
    handleLeaveShoot() {
        this.playerSpine.clearTrack(2);
    },
    handleUseBomb() {
        this.playerSpine.setAnimation(1, SpineAnimation.SHOOT, false);
        this.playerSpine.setCompleteListener(() => {
            Emitter.emit(EventKey.PLAYER.USE_BOMB);
            this.fsm.toShoot();
        });
    },
    handleEnterMoveUp() {
        this.playerSpine.setAnimation(1, SpineAnimation.HOVERBOARD, false);
        this.playerSpine.setCompleteListener(() => {
            this.fsm.toShoot();
        });
    },
    handleEnterMoveDown() {
        this.playerSpine.setAnimation(1, SpineAnimation.HOVERBOARD, false);
        this.playerSpine.setCompleteListener(() => {
            this.fsm.toShoot();
        });
    },
    handleEnterShootUltimate() {
        this.playerSpine.setAnimation(1, SpineAnimation.SHOOT, false);
        this.playerSpine.setCompleteListener(() => {
            Emitter.emit(EventKey.PLAYER.SHOOT_ULTIMATE);
            this.fsm.toShoot();
        });
    },
    handleEnterHit() {
        this.playerSpine.setAnimation(1, SpineAnimation.IDLE_TURNS, false);
        this.playerSpine.setCompleteListener(() => {
            this.fsm.toShoot();
        });
    },
    handleEnterDie() {
        this.playerSpine.setAnimation(1, SpineAnimation.DEATH, false);
        this.playerSpine.setCompleteListener(() => {
            this.node.active = false;
            Emitter.emit(EventKey.PLAYER.ON_DIE, this.node);
        });
    },
    takeDamage(amount) {
        if (this.fsm.is(FSM_STATE.DIE)) return;

        this.currentHP -= amount;
        this.hpProgressBar.progress = this.currentHP / this.maxHP;
        Emitter.emit(EventKey.PLAYER.ON_HIT, this.currentHP, this.maxHP);

        if (this.currentHP <= 0) {
            this.currentHP = 0;
            this.fsm.toDie();
        } else {
            this.fsm.toHit();
        }
    },
    onDisable() {
        this.playerSpine.setCompleteListener(null);
    }
});