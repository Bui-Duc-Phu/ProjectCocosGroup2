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
        PlayerSpine: {
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
    },
    init() {
        this.currentHP = this.maxHP;
        this.PlayerSpine = this.node.getChildByName('PlayerSpine').getComponent(sp.Skeleton);
        this.hpProgressBar.progress = this.currentHP / this.maxHP;
        this.initStateMachine();
        this.PlayerSpine.setAnimation(0, SpineAnimation.ANIM_LIST.IDLE, true);
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

                onLeavePortal: () => this.PlayerSpine.setCompleteListener(null),
                onLeaveMoveUp: () => this.PlayerSpine.setCompleteListener(null),
                onLeaveMoveDown: () => this.PlayerSpine.setCompleteListener(null),
                onLeaveShootUltimate: () => this.PlayerSpine.setCompleteListener(null),
                onLeaveHit: () => this.PlayerSpine.setCompleteListener(null),
            },
        });
    },
    handleEnterPortal() {
        this.PlayerSpine.setAnimation(1, SpineAnimation.ANIM_LIST.PORTAL, false);
        this.PlayerSpine.setCompleteListener((trackEntry) => {
            this.fsm.toShoot();
        });
    },
    handleEnterShoot() {
        this.PlayerSpine.setAnimation(2, SpineAnimation.ANIM_LIST.SHOOT, true);
    },
    handleLeaveShoot() {
        this.PlayerSpine.clearTrack(2);
    },
    handleUseBomb() {
        this.PlayerSpine.setAnimation(1, SpineAnimation.ANIM_LIST.SHOOT, false);
        this.PlayerSpine.setCompleteListener(() => {
            Emitter.emit(EventKey.PLAYER.USE_BOMB);
            this.fsm.toShoot();
        });
    },
    handleEnterMoveUp() {
        this.PlayerSpine.setAnimation(1, SpineAnimation.ANIM_LIST.RUN, false);
        this.PlayerSpine.setCompleteListener((trackEntry) => {
            this.fsm.toShoot();
        });
    },
    handleEnterMoveDown() {
        Emitter.emit(EventKey.PLAYER.STATE_CHANGED, FSM_STATE.MOVE_DOWN);
        this.PlayerSpine.setAnimation(1, SpineAnimation.ANIM_LIST.RUN, false);
        this.PlayerSpine.setCompleteListener(() => {
            this.fsm.toShoot();
        });
    },
    handleEnterShootUltimate() {
        this.PlayerSpine.setAnimation(1, SpineAnimation.ANIM_LIST.SHOOT, false);
        this.PlayerSpine.setCompleteListener(() => {
            Emitter.emit(EventKey.PLAYER.SHOOT_ULTIMATE);
            this.fsm.toShoot();
        });
    },
    handleEnterHit() {
        this.PlayerSpine.setAnimation(1, SpineAnimation.ANIM_LIST.IDLE_TURNS, false);
        this.PlayerSpine.setCompleteListener(() => {
            this.fsm.toShoot();
        });
    },
    handleEnterDie() {
        this.PlayerSpine.setAnimation(1, SpineAnimation.ANIM_LIST.DEATH, false);
        this.PlayerSpine.setCompleteListener(() => {
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
        this.PlayerSpine.setCompleteListener(null);
    }
});