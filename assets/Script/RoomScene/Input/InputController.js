const GameConfig = require('GameConfig');
const Emitter = require('Emitter');
const EventKey = require('EventKey');
cc.Class({
    extends: cc.Component,

    properties: {
        moveUpButton: {
            default: null,
            type: cc.Button,
        },
        moveDownButton: {
            default: null,
            type: cc.Button,
        },
        skillButton: {
            default: null,
            type: cc.Button,
        },
        bombButton: {
            default: null,
            type: cc.Button,
        },
        cooldownPrefab: {
            default: null,
            type: cc.Prefab,
        },
    },
    onLoad() {
        this.setCooldown();
        this.registerButtonEvents();
    },
    registerButtonEvents() {
        this.moveUpButton.node.on('click', this.onMoveUp, this);
        this.moveDownButton.node.on('click', this.onMoveDown, this);
        this.skillButton.node.on('click', this.onUseSkill, this);
        this.bombButton.node.on('click', this.onUseBomb, this);
    },
    setCooldown() {
        this.skillCooldown = cc.instantiate(this.cooldownPrefab);
        skillCooldown.getComponent('CooldownController').durationSeconds = GameConfig.BULLET.TYPE.ULTIMATE.COOLDOWN;
        skillCooldown.parent = this.node.getChildByName('SkillInput');

        this.bombCooldown = cc.instantiate(this.cooldownPrefab);
        bombCooldown.getComponent('CooldownController').durationSeconds = GameConfig.SHOP.ITEM.BOMB.COOLDOWN;
        bombCooldown.parent = this.node.getChildByName('BombInput');    
    },
    onMoveUp() {
        Emitter.emit(EventKey.INPUT.MOVE_UP);
    },
    onMoveDown() {
        Emitter.emit(EventKey.INPUT.MOVE_DOWN);
    },
    onUseSkill() {
        Emitter.emit(EventKey.INPUT.SHOOT_ULTIMATE);
    },  
    onUseBomb() {
        Emitter.emit(EventKey.INPUT.USE_BOMB);
    },
    onDestroy() {
        this.moveUpButton.node.off('click', this.onMoveUp, this);
        this.moveDownButton.node.off('click', this.onMoveDown, this);
        this.skillButton.node.off('click', this.onUseSkill, this);
        this.bombButton.node.off('click', this.onUseBomb, this);
    },
});