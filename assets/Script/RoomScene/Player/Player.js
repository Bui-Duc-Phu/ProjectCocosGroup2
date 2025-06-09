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
        this.initStateMachine();
        this.playerSpine = this.node.getChildByName(sp.Skeleton);
    },

    initStateMachine() {
        this.fsm = new StateMachine({
            init: 'idle',
            transitions: [
                { name: 'moveTo',       from: ['idle', 'shoot', 'hit'],  to: 'move' },
                { name: 'idleFromMove', from: 'move',                     to: 'idle' },
                { name: 'shootTo',      from: ['idle', 'move', 'hit'],   to: 'shoot' },
                { name: 'idleFromShoot',from: 'shoot',                    to: 'idle' },
                { name: 'useSkillTo',   from: ['idle', 'move', 'hit'],   to: 'useSkill' },
                { name: 'finishSkill',  from: 'useSkill',                 to: 'idle' },
                { name: 'hitTo',        from: ['idle', 'move', 'shoot', 'useSkill'], to: 'hit' },
                { name: 'recoverFromHit',from: 'hit',                     to: 'idle' },
                { name: 'dieTo',        from: '*',                        to: 'die' }
            ],
            methods: {
                onEnterDie: function() {
                    Emitter.emit(EventKey.PLAYER.ON_DIE);
                },
                onEnterUseSkill: function(lifecycle, skillData) {
                    Emitter.emit(EventKey.PLAYER.SHOOT_ULTIMATE, skillData);
                },
                onEnterHit: function(lifecycle, damageData) {
                    Emitter.emit(EventKey.PLAYER.ON_HIT, damageData);
                },
                onBeforeMoveTo: function() {
                    return !this.is('useSkill') && !this.is('die');
                },
                onBeforeShootTo: function() {
                    return !this.is('useSkill') && !this.is('die');
                },
                onBeforeUseSkillTo: function() {
                    return !this.is('die');
                },
                onBeforeHitTo: function() {
                    return !this.is('die');
                }
            }
        });
    },

    playerMove() {
        if (this.fsm.can('moveTo')) {
            this.fsm.moveTo();
        }
    },

    playerStopMove() {
        if (this.fsm.is('move') && this.fsm.can('idleFromMove')) {
            this.fsm.idleFromMove();
        }
    },

    playerShoot(bulletType) {
        if (this.fsm.can('shootTo')) {
            this.fsm.shootTo();
            Emitter.emit(bulletType);
        }
    },

    playerFinishShoot() {
        if (this.fsm.is('shoot') && this.fsm.can('idleFromShoot')) {
            this.fsm.idleFromShoot();
        }
    },

    playerUseSkill(skillData) {
        if (this.fsm.can('useSkillTo')) {
            this.fsm.useSkillTo(skillData);
        }
    },

    playerFinishSkill() {
        if (this.fsm.is('useSkill') && this.fsm.can('finishSkill')) {
            this.fsm.finishSkill();
        }
    },

    playerTakeDamage(damageAmount) {
        if (this.isDead()) return;

        this.currentHP -= damageAmount;
        const damageData = { amount: damageAmount, currentHP: this.currentHP };

        if (this.currentHP <= 0) {
            this.currentHP = 0;
            if (this.fsm.can('dieTo')) {
                this.fsm.dieTo();
            }
        } else {
            if (this.fsm.can('hitTo')) {
                this.fsm.hitTo(damageData);
            }
        }
    },

    playerRecoverFromHit() {
        if (this.fsm.is('hit') && this.fsm.can('recoverFromHit')) {
            this.fsm.recoverFromHit();
        }
    },

    getCurrentState() {
        return this.fsm ? this.fsm.state : null;
    },

    isDead() {
        return this.fsm ? this.fsm.is('die') : this.currentHP <= 0;
    },

    canPlayerMove() {
        return this.fsm ? this.fsm.can('moveTo') : false;
    },

    canPlayerShoot() {
        return this.fsm ? this.fsm.can('shootTo') : false;
    },

    canPlayerUseSkill() {
        return this.fsm ? this.fsm.can('useSkillTo') : false;
    },

    onDestroy() {
        if (this.fsm) {
            this.fsm = null;
        }
    },
});