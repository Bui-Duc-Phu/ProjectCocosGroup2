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
            default: GameConfig.PLAYER.HP_BASE,
            type: cc.Integer,
            visible: false,
        },
        currentHP: {
            default: 0,
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
        playerFrame: {
            default: null,
            type: cc.Node,
        },
        playerPositionY: {
            default: [],
            type: [cc.Integer],
            visible: false,
        },
        moveDuration: {
            default: 0.5,
            type: cc.Float,
            visible: false,
        },
        bulletPointer: {
            default: null,
            type: cc.Node,
        },
        xInit: {
            default: -420,
            type: cc.Integer,
        },
        yInit: {
            default: -100,
            type: cc.Integer,
        },
    },
    onLoad() {
        this.init();
    },
    init() {
        this.currentHP = this.maxHP;
        this.playerSpine = this.node.getComponent(sp.Skeleton);
        this.hpProgressBar.progress = this.currentHP / this.maxHP;
        this.playerFrame.setPosition(this.xInit, this.yInit);
        this.initStateMachine();
        this.playerPositionY = [-300, -100, 100];

    },
    onCollisionEnter(other, self) {
        console.log(other.node.getComponent('MonsterItem'), "  ", self.node);
        this.takeDamage(other.node.getComponent('MonsterItem').damage);

    },
    initStateMachine() {
        this.fsm = new StateMachine({
            init: FSM_STATE.PORTAL,
            transitions: [
                { name: 'toPortal', from: '*', to: FSM_STATE.PORTAL },
                { name: 'toShoot', from: '*', to: FSM_STATE.SHOOT },
                { name: 'toMoveUp', from: [FSM_STATE.SHOOT, FSM_STATE.HIT], to: FSM_STATE.MOVE_UP },
                { name: 'toMoveDown', from: [FSM_STATE.SHOOT, FSM_STATE.HIT], to: FSM_STATE.MOVE_DOWN },
                { name: 'toUseBomb', from: [FSM_STATE.SHOOT, FSM_STATE.MOVE_UP, FSM_STATE.MOVE_DOWN], to: FSM_STATE.USE_BOMB },
                { name: 'toShootUltimate', from: [FSM_STATE.SHOOT, FSM_STATE.MOVE_UP, FSM_STATE.MOVE_DOWN], to: FSM_STATE.SHOOT_ULTIMATE },
                { name: 'toDie', from: '*', to: FSM_STATE.DIE },
            ],
            methods: {
                onEnterPortal: () => this.handleEnterPortal(),
                onEnterShoot: () => this.handleEnterShoot(),
                onEnterMoveUp: () => this.handleEnterMoveUp(),
                onEnterMoveDown: () => this.handleEnterMoveDown(),
                onEnterShootUltimate: () => this.handleEnterShootUltimate(),
                onEnterDie: () => this.handleEnterDie(),
                onUseBomb: () => this.handleUseBomb(),

                onLeavePortal: () => this.playerSpine.setCompleteListener(null),
                onLeaveMoveUp: () => this.playerSpine.setCompleteListener(null),
                onLeaveMoveDown: () => this.playerSpine.setCompleteListener(null),
                onLeaveShootUltimate: () => this.playerSpine.setCompleteListener(null),
                onLeaveUseBomb: () => this.playerSpine.setCompleteListener(null),
            },
        });
    },
    handleEnterPortal() {
        this.playerSpine.setAnimation(1, SpineAnimation.PORTAL, false);
        this.playerSpine.setCompleteListener(() => {
            this.playerSpine.setAnimation(0, SpineAnimation.IDLE, true);
            this.node.angle = 5;
            this.fsm.toShoot();
        });
    },
    handleEnterShoot() {
        if (!this.boundOnShootBullet) {
            this.boundOnShootBullet = this.onShootBullet.bind(this);
            this.schedule(this.boundOnShootBullet, 0.4);
        }
    },
    onShootBullet() {
        this.playerSpine.setAnimation(1, SpineAnimation.SHOOT, false);
        let bulletPosition = this.node.parent.convertToWorldSpaceAR(this.bulletPointer.position);
        Emitter.emit(EventKey.PLAYER.SHOOT_NORMAL, bulletPosition);
    },
    handleUseBomb() {
        this.unschedule(this.boundOnShootBullet);
        this.boundOnShootBullet = null;
        this.playerSpine.setAnimation(1, SpineAnimation.SHOOT, false);
        this.playerSpine.setCompleteListener(() => {
            let bulletPosition = this.node.parent.convertToWorldSpaceAR(this.bulletPointer.position);
            Emitter.emit(EventKey.PLAYER.USE_BOMB, bulletPosition);
            this.fsm.toShoot();
        });
    },
    handleEnterMoveUp() {
        this.targetY = this.playerFrame.position.y;
        if (this.playerFrame.position.y === this.playerPositionY[0]) {
            this.targetY = this.playerPositionY[1];
        } else if (this.playerFrame.position.y === this.playerPositionY[1]) {
            this.targetY = this.playerPositionY[2];
        };
        cc.tween(this.playerFrame)
            .to(this.moveDuration, { y: this.targetY })
            .call(() => {
                this.fsm.toShoot();
            })
            .start();
    },
    handleEnterMoveDown() {
        this.targetY = this.playerFrame.position.y;
        if (this.playerFrame.position.y === this.playerPositionY[2]) {
            this.targetY = this.playerPositionY[1];
        } else if (this.playerFrame.position.y === this.playerPositionY[1]) {
            this.targetY = this.playerPositionY[0];
        };
        cc.tween(this.playerFrame)
            .to(this.moveDuration, { y: this.targetY })
            .call(() => {
                this.fsm.toShoot();
            })
            .start();
    },
    handleEnterShootUltimate() {
        this.unschedule(this.boundOnShootBullet);
        this.boundOnShootBullet = null;
        this.playerSpine.setAnimation(1, SpineAnimation.SHOOT, false);
        let bulletPosition = this.node.parent.convertToWorldSpaceAR(this.bulletPointer.position);
        Emitter.emit(EventKey.PLAYER.SHOOT_ULTIMATE, bulletPosition);
        this.playerSpine.setCompleteListener(() => {

            this.fsm.toShoot();
            console.log(bulletPosition);
        });
    },
    handleEnterDie() {
        this.playerSpine.setAnimation(1, SpineAnimation.DEATH, false);
        this.playerSpine.setCompleteListener(() => {
            this.node.parent.active = false;
            Emitter.emit(EventKey.PLAYER.ON_DIE, this.node);
        });
    },
    takeDamage(amount) {
        if (this.fsm.is(FSM_STATE.DIE)) return;

        console.log(`Player took damage: ${amount}`);
        this.currentHP -= amount;
        console.log(`Current HP: ${this.currentHP}`);
        this.hpProgressBar.progress = this.currentHP / this.maxHP;
        cc.tween(this.node)
            .to(0.2, { opacity: 150 }, { easing: 'sineInOut' })
            .to(0.2, { opacity: 255 }, { easing: 'sineInOut' })
            .start();
        if (this.currentHP <= 0) {
            this.currentHP = 0;
            this.unschedule(this.boundOnShootBullet);
            this.boundOnShootBullet = null;
            this.playerSpine.clearTrack(1);
            this.fsm.toDie();
        }
    },
    onDisable() {
        this.playerSpine.setCompleteListener(null);
    }
});