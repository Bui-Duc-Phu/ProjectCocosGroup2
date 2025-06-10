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
        UserSpine: {
            default: null,
            type: sp.Skeleton,
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
        this.UserSpine = this.node.getChildByName('UserSpine').getComponent(sp.Skeleton);
        this.initStateMachine();
        this.UserSpine.setAnimation(0, SpineAnimation.ANIM_LIST.IDLE, true);
    },
    initStateMachine() {
        this.fsm = new StateMachine({
            init: FSM_STATE.PORTAL,
            transitions: [
                { name: 'toPortal', from: '*', to: FSM_STATE.PORTAL },
                { name: 'toShoot', from: '*', to: FSM_STATE.SHOOT },
                { name: 'toMoveUp', from: [FSM_STATE.SHOOT, FSM_STATE.HIT, FSM_STATE.PORTAL, FSM_STATE.MOVE_DOWN], to: FSM_STATE.MOVE_UP },
                { name: 'toMoveDown', from: [FSM_STATE.SHOOT, FSM_STATE.HIT, FSM_STATE.PORTAL, FSM_STATE.MOVE_UP], to: FSM_STATE.MOVE_DOWN },
                { name: 'toShootUltimate', from: [FSM_STATE.SHOOT, FSM_STATE.MOVE_UP, FSM_STATE.MOVE_DOWN], to: FSM_STATE.SHOOT_ULTIMATE },
                { name: 'toHit', from: [FSM_STATE.SHOOT, FSM_STATE.MOVE_UP, FSM_STATE.MOVE_DOWN, FSM_STATE.SHOOT_ULTIMATE, FSM_STATE.PORTAL], to: FSM_STATE.HIT },
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

                onLeavePortal: () => this.UserSpine.setCompleteListener(null),
                onLeaveMoveUp: () => this.UserSpine.setCompleteListener(null),
                onLeaveMoveDown: () => this.UserSpine.setCompleteListener(null),
                onLeaveShootUltimate: () => this.UserSpine.setCompleteListener(null),
                onLeaveHit: () => this.UserSpine.setCompleteListener(null),
            },
        });
    },
    handleEnterPortal() {
        this.UserSpine.setAnimation(1, SpineAnimation.ANIM_LIST.PORTAL, false);
        this.UserSpine.setCompleteListener((trackEntry) => {
            this.fsm.toShoot();
        });
    },
    handleEnterShoot() {
        this.UserSpine.setAnimation(2, SpineAnimation.ANIM_LIST.SHOOT, true);
    },
    handleLeaveShoot() {
        this.UserSpine.clearTrack(2);
    },
    handleEnterMoveUp() {
        this.UserSpine.setAnimation(1, SpineAnimation.ANIM_LIST.RUN, false);
        this.UserSpine.setCompleteListener((trackEntry) => {
            this.fsm.toShoot();
        });
    },
    handleEnterMoveDown() {
        Emitter.emit(EventKey.PLAYER.STATE_CHANGED, FSM_STATE.MOVE_DOWN);
        this.UserSpine.setAnimation(1, SpineAnimation.ANIM_LIST.RUN, false);
        this.UserSpine.setCompleteListener(() => {
            this.fsm.toShoot();
        });
    },
    handleEnterShootUltimate() {
        this.UserSpine.setAnimation(1, SpineAnimation.ANIM_LIST.SHOOT, false);
        this.UserSpine.setCompleteListener(() => {
            Emitter.emit(EventKey.PLAYER.SHOOT_ULTIMATE);
            this.fsm.toShoot();
        });
    },
    handleEnterHit() {
        this.UserSpine.setAnimation(1, SpineAnimation.ANIM_LIST.IDLE_TURNS, false);
        this.UserSpine.setCompleteListener(() => {
            this.fsm.toShoot();
        });
    },
    handleEnterDie() {
        this.UserSpine.setAnimation(1, SpineAnimation.ANIM_LIST.DEATH, false);
        this.UserSpine.setCompleteListener(() => {
            this.node.active = false;
            Emitter.emit(EventKey.PLAYER.ON_DIE, this.node);
        });
    },
    takeDamage(amount) {
        if (this.fsm.is(FSM_STATE.DIE)) return;

        this.currentHP -= amount;
        Emitter.emit(EventKey.PLAYER.ON_HIT, this.currentHP, this.maxHP);

        if (this.currentHP <= 0) {
            this.currentHP = 0;
            this.fsm.toDie();
        } else {
            this.fsm.toHit();
        }
    },
    onDisable() {
        this.UserSpine.setCompleteListener(null);
    }
});