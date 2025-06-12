const ButtonName = require('ButtonName');
const SkillName = require('SkillName');
const GameConfig = require('GameConfig');
const GoldController = require('GoldController');
const UpgradeController = require('UpgradeController');
const Emitter = require('Emitter');
const EventKey = require('EventKey');
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
        priceUpgradeNomalAttack: {
            type: cc.Label,
            default: null
        },
        priceUpgradeUltimate: {
            type: cc.Label,
            default: null
        },
        progressbarNomalAttack: {
            type: cc.ProgressBar,
            default: null
        },
        progressbarUltimate: {
            type: cc.ProgressBar,
            default: null
        },
        upgradeButtons:{
            type:[cc.Node],
            default:[]
        },
        enoughGoldSpriteFrame: {
            type: cc.SpriteFrame,
            default: null
        },
        notEnoughGoldSpriteFrame: {
            type: cc.SpriteFrame,
            default: null
        }

    },
    onLoad() {
        this.init();
    },
    init() {
        this.stats.active = false;
        this.skill.active = false;
        this.currentGold = GoldController.getGoldValue();
        this.activeNode(ButtonName.STATS);
        this.initStats();
        this.initSkill();
        this.initButtonUpgrade();
    },
    initStats() {
        this.hpBase.string = GameConfig.PLAYER.HP_BASE.toString();
        this.damageBase.string = GameConfig.BULLET.DAMAGE_BASE.toString();
        this.attackSpeed.string = GameConfig.BULLET.TYPE.NOMAL.COOLDOWN.toString();

    },
    initSkill() {
        let currentLeverNomalAttack = UpgradeController.getLeverNomalAttack();
        let currentLeverUltimate = UpgradeController.getLeverUltimate();

        this.leverNomalAttack.string = currentLeverNomalAttack.toString();
        this.leverUltimate.string = currentLeverUltimate.toString();

        let dameBase = GameConfig.BULLET.DAMAGE_BASE;
        let coefficientNomalDame = GameConfig.BULLET.TYPE.NOMAL.COEFFICIENT_DAMAGE;
        let coefficientUltimateDame = GameConfig.BULLET.TYPE.ULTIMATE.COEFFICIENT_DAMAGE;
        let percentNomalDameAdd = GameConfig.BULLET.TYPE.NOMAL.UPGRADE.PERCENT_DAMAGE_ADD;
        let percentUltimateDameAdd = GameConfig.BULLET.TYPE.ULTIMATE.UPGRADE.PERCENT_DAMAGE_ADD;

        this.damageNomalAttack.string = Math.floor((dameBase * coefficientNomalDame * (1 + currentLeverNomalAttack * percentNomalDameAdd))).toString();
        this.damageUltimate.string = Math.floor((dameBase * coefficientUltimateDame * (1 + currentLeverUltimate * percentUltimateDameAdd))).toString();

        this.progressbarNomalAttack.progress = currentLeverNomalAttack * 0.1;
        this.progressbarUltimate.progress = currentLeverUltimate * 0.1;

        const priceBaseUpgradeNomal = GameConfig.BULLET.TYPE.NOMAL.UPGRADE.COST_BASE;
        const priceBaseUpgradeUltimate = GameConfig.BULLET.TYPE.ULTIMATE.UPGRADE.COST_BASE;
        const levelMultiplierNomal = GameConfig.BULLET.TYPE.NOMAL.UPGRADE.LEVER[currentLeverNomalAttack];
        const levelMultiplierUltimate = GameConfig.BULLET.TYPE.ULTIMATE.UPGRADE.LEVER[currentLeverUltimate];

        
        this.upgradeButtons.forEach(button => {
            let labelPriceUpgrade = button.getChildByName('Price').getComponent(cc.Label);
            if(button.parent.name === "Attack"){
                if(currentLeverNomalAttack === 10){
                    labelPriceUpgrade.string = "MAX";
                }else{
                    labelPriceUpgrade.string = Math.floor(priceBaseUpgradeNomal*levelMultiplierNomal).toString();
                    this.priceUpgradeNomal = Math.floor(priceBaseUpgradeNomal*levelMultiplierNomal);
                }
            }
            if(button.parent.name === "Ultimate"){
                if(currentLeverUltimate === 10){
                    labelPriceUpgrade.string = "MAX";
                }else{
                    labelPriceUpgrade.string = Math.floor(priceBaseUpgradeUltimate*levelMultiplierUltimate).toString();
                    this.priceUpgradeUltimate = Math.floor(priceBaseUpgradeUltimate*levelMultiplierUltimate);

                }
            }

        });

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
            const button = buttons[key];
            const label = button.getChildByName("Label");
            const sprite = button.getChildByName("Sprite").getComponent(cc.Sprite);

            const isActive = key === name;
            label.color = isActive ? cc.Color.WHITE : cc.Color.GRAY;
            sprite.spriteFrame = isActive ? this.activeSpriteFrame : this.unActiveSpriteFrame;
        }
    },
    isGoldEnough(priceUpgrade){
        console.log(priceUpgrade);
        return this.currentGold >= priceUpgrade;
    },
    initButtonUpgrade(){
        this.upgradeButtons.forEach(button => {
            let spriteBackgroundUpgrade = button.getChildByName('Background').getComponent(cc.Sprite);
            let labelPriceUpgrade = button.getChildByName('Price').getComponent(cc.Label);
            const priceUpgrade = Number(labelPriceUpgrade.string);
            let buttonComponent = button.getComponent(cc.Button);
            
            if(!this.isGoldEnough(priceUpgrade)){
                spriteBackgroundUpgrade.spriteFrame = this.notEnoughGoldSpriteFrame;
                labelPriceUpgrade.node.color = cc.Color.RED;
                buttonComponent.interactable = false;
            }else{
                spriteBackgroundUpgrade.spriteFrame = this.enoughGoldSpriteFrame;
                labelPriceUpgrade.node.color = cc.Color.WHITE;
                buttonComponent.interactable = true;
            }
        });
    },
    onUpgradeButtonClick(event, typeSkill) {
        if (typeSkill === SkillName.NOMAL) {
            UpgradeController.upgradeLeverNomalAttack()
            GoldController.subtractGold(this.priceUpgradeNomal);

        }
        if (typeSkill === SkillName.ULTIMATE) {
            UpgradeController.upgradeLeverUltimate();
            GoldController.subtractGold(this.priceUpgradeUltimate);

        }
        Emitter.emit(EventKey.SOUND.PLAY_SFX_UPGRADE, "name");
        Emitter.emit(EventKey.GOLD.CHANGE_GOLD);
        this.currentGold = GoldController.getGoldValue();
        this.initSkill();
        this.initButtonUpgrade();
    }
});
