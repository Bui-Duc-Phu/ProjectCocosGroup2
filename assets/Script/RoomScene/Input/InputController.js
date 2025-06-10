const GameConfig = require('GameConfig');
const Emitter = require('Emitter');
const EventKey = require('EventKey');
const LocalStorageKey = require('LocalStorageKey');
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
        isMoveButtonEnabled: {
            default: true,
            visible: false,
        },
        bombAmount: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
    },
    onLoad() {
        this.init();
    },
    init() {
        this.getBombAmount();
        this.setCooldown();
        this.registerButtonEvents();
        this.registerKeyboardEvents();
    },
    getBombAmount() {
        let amount = cc.sys.localStorage.getItem(LocalStorageKey.PLAYER.BOMB_AMOUNT);
        if (amount === null) {
            amount = 0;
            cc.sys.localStorage.setItem(LocalStorageKey.PLAYER.BOMB_AMOUNT, amount.toString());
        };
        this.bombAmount = parseInt(amount);
        this.bombAmountLabel = this.bombButton.node.getChildByName('BombAmount').getComponentInChildren(cc.Label);
        this.bombAmountLabel.string = this.bombAmount.toString();
        return this.bombAmount;
    },
    registerButtonEvents() {
        this.moveUpButton.node.on('click', this.onMoveUp, this);
        this.moveDownButton.node.on('click', this.onMoveDown, this);
        this.skillButton.node.on('click', this.onUseSkill, this);
        this.bombButton.node.on('click', this.onUseBomb, this);
        if (this.bombAmount <= 0) {
            this.bombButton.interactable = false;
        }
    },
    registerKeyboardEvents() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this.onMoveUp();
                break;
            case cc.macro.KEY.s:
            case cc.macro.KEY.down:
                this.onMoveDown();
                break;
            case cc.macro.KEY.space:
                this.onUseSkill();
                break;
            case cc.macro.KEY.f:
                this.onUseBomb();
                break;
        }
    },
    setCooldown() {
        this.skillCooldown = cc.instantiate(this.cooldownPrefab);
        this.skillCooldown.getComponent('CooldownController').durationSeconds = GameConfig.BULLET.TYPE.ULTIMATE.COOLDOWN;
        this.skillCooldown.parent = this.node.getChildByName('SkillInput');

        this.bombCooldown = cc.instantiate(this.cooldownPrefab);
        this.bombCooldown.getComponent('CooldownController').durationSeconds = GameConfig.SHOP.ITEM.BOMB.COOLDOWN;
        this.bombCooldown.parent = this.node.getChildByName('BombInput');
    },
    onMoveUp() {
        Emitter.emit(EventKey.INPUT.MOVE_UP);
    },
    onMoveDown() {
        Emitter.emit(EventKey.INPUT.MOVE_DOWN);
    },
    onUseSkill() {
        Emitter.emit(EventKey.INPUT.SHOOT_ULTIMATE);
        this.skillCooldown.active = true;
    },
    onUseBomb() {
        if (this.bombAmount > 0) {
            Emitter.emit(EventKey.INPUT.USE_BOMB);
            this.bombCooldown.active = true;
            this.bombAmount -= 1;
            cc.sys.localStorage.setItem(LocalStorageKey.PLAYER.BOMB_AMOUNT, this.bombAmount.toString()); 
            this.bombAmountLabel.string = this.bombAmount.toString();
        }
        if (this.bombAmount <= 0) {
            this.bombButton.interactable = false;
        }
    },
    onDestroy() {
        this.moveUpButton.node.off('click', this.onMoveUp, this);
        this.moveDownButton.node.off('click', this.onMoveDown, this);
        this.skillButton.node.off('click', this.onUseSkill, this);
        this.bombButton.node.off('click', this.onUseBomb, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
});