const ButtonName = require('ButtonName');
const GameConfig = require('GameConfig');
const UpgradeController = require('UpgradeController');
cc.Class({
    extends: require('PopupItem'),

    properties: {
        activeSpriteFrame: {
            type: cc.SpriteFrame,
            default: null
        },
        unActiveSpriteFrame: {
            type: cc.SpriteFrame,
            default: null
        },
        statsButton: {
            type: cc.Node,
            default: null
        },
        skillButton: {
            type: cc.Node,
            default: null
        },
        stats: {
            type: cc.Node,
            default: null
        },
        skill: {
            type: cc.Node,
            default: null
        },
        hpBase: {
            type: cc.Label,
            default: null
        },
        damageBase: {
            type: cc.Label,
            default: null
        },
        attackSpeed: {
            type: cc.Label,
            default: null
        },
        leverNomalAttack: {
            type: cc.Label,
            default: null
        },
        leverUltimate: {
            type: cc.Label,
            default: null
        },
        damageNomalAttack: {
            type: cc.Label,
            default: null
        },
        damageUltimate: {
            type: cc.Label,
            default: null
        },
        priceUpgradeNomalAttack:{
            type: cc.Label,
            default: null
        },
        priceUpgradeUltimate:{
            type: cc.Label,
            default: null
        },

    },
    onLoad() {
        this.init();
    },
    init() {
        this.stats.active = false;
        this.skill.active = false;
        this.activeNode(ButtonName.STATS);

        this.hpBase.string = GameConfig.PLAYER.HP_BASE.toString();
        this.damageBase.string = GameConfig.BULLET.DAMAGE_BASE.toString();
        this.attackSpeed.string = GameConfig.BULLET.TYPE.NOMAL.COOLDOWN.toString();

        this.currentLeverNomalAttack = UpgradeController.getLeverNomalAttack();
        this.currentLeverUltimate = UpgradeController.getLeverUltimate();
        this.leverNomalAttack.string = this.currentLeverNomalAttack.toString();
        this.leverUltimate.string = this.currentLeverUltimate.toString();

        let dameBase = GameConfig.BULLET.DAMAGE_BASE;
        let coefficientNomalDame = GameConfig.BULLET.TYPE.NOMAL.COEFFICIENT_DAMAGE;
        let coefficientUltimateDame = GameConfig.BULLET.TYPE.ULTIMATE.COEFFICIENT_DAMAGE;
        let percentNomalDameAdd = GameConfig.BULLET.TYPE.NOMAL.UPGRADE.PERCENT_DAMAGE_ADD;
        let percentUltimateDameAdd = GameConfig.BULLET.TYPE.ULTIMATE.UPGRADE.PERCENT_DAMAGE_ADD;

        this.damageNomalAttack.string = Math.floor((dameBase*coefficientNomalDame*(1 + this.currentLeverNomalAttack*percentNomalDameAdd))).toString();
        this.damageUltimate.string = Math.floor((dameBase*coefficientUltimateDame*(1 + this.currentLeverUltimate*percentUltimateDameAdd))).toString();





    },
    onButtonClick(event, data) {
        this.activeNode(data);
        this.activeButton(data);
    },
    activeNode(name) {
        this.stats.opacity = 0;
        this.skill.opacity = 0;
        if (name === ButtonName.STATS && !this.stats.active) {
            cc.tween(this.stats)
                .call(() => {
                    this.skill.active = false;
                    this.stats.active = true;
                })
                .to(0.1, { opacity: 255 })
                .start();
        }
        if (name === ButtonName.SKILL && !this.skill.active) {
            cc.tween(this.skill)
                .call(() => {
                    this.stats.active = false
                    this.skill.active = true;
                })
                .to(0.1, { opacity: 255 })
                .start();
        }
    },
    activeButton(name) {
        const buttons = {
            [ButtonName.STATS]: this.statsButton,
            [ButtonName.SKILL]: this.skillButton
        };

        for (let key in buttons) {
            const btn = buttons[key];
            const label = btn.getChildByName("Label");
            const sprite = btn.getChildByName("Sprite").getComponent(cc.Sprite);

            const isActive = key === name;
            label.color = isActive ? cc.Color.WHITE : cc.Color.GRAY;
            sprite.spriteFrame = isActive ? this.activeSpriteFrame : this.unActiveSpriteFrame;
        }
    },

    onUpgradeButtonClick(event,typeSkill) {

    }
});
