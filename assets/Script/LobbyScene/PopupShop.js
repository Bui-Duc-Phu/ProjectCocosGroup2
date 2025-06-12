const ItemName = require('ItemName');
const GoldController = require('GoldController');
const Emitter = require('Emitter');
const EventKey = require('EventKey');
const AudioName = require('AudioName')
cc.Class({
    extends: require('PopupItem'),

    properties: {
        shopItem: {
            type: cc.Node,
            default: null
        },
        itemDetail: {
            type: cc.Node,
            default: null
        },
        iconItemDetail: {
            type: cc.Node,
            default: null
        },
        spriteBackgroundBuy: {
            type: cc.Sprite,
            default: null
        },
        enoughGoldSpriteFrame: {
            type: cc.SpriteFrame,
            default: null
        },
        notEnoughGoldSpriteFrame: {
            type: cc.SpriteFrame,
            default: null
        },
        amount:{
            type:cc.Label,
            default:null
        }
    },

    onLoad() {
        this.init();
    },

    init() {
        this.priceItem = 0;
        this.currentGold = GoldController.getGoldValue();
        this.itemDetail.active = false;
        this.itemList = this.shopItem.children;
        this.initItem();

    },
    isGoldEnough(priceItem) {
        return this.currentGold >= priceItem;
    },

    onClickItem(event, ItemName) {
        const item = event.target;
        this.itemName = ItemName;
        this.priceItem = Number(item.getComponent("Item").price.string);
        console.log(this.priceItem);
        this.spriteFrame = item.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame;
        this.amountItem = cc.sys.localStorage.getItem(ItemName);
        console.log(this.amountItem)
        
        this.initItemDetail();
    },
    initItem() {
        this.itemList.forEach(item => {
            let priceItem = Number(item.getComponent("Item")?.price?.string);
            if (!this.isGoldEnough(priceItem)) {           
                item.getComponent("Item").price.node.color = cc.Color.RED;
            } else {
                item.getComponent("Item").price.node.color = cc.Color.WHITE;
            }
        });
    },

    initItemDetail() {
        this.itemDetail.active = true;
        this.iconItemDetail.getComponent(cc.Sprite).spriteFrame = this.spriteFrame;
        this.spriteBackgroundBuy.spriteFrame = this.enoughGoldSpriteFrame;
        let buttonComponent = this.spriteBackgroundBuy.node.parent.getComponent(cc.Button)
        buttonComponent.transition = cc.Button.Transition.SCALE;
        if (!this.isGoldEnough(this.priceItem)) {
            console.log(this.isGoldEnough(this.priceItem));
            this.spriteBackgroundBuy.spriteFrame = this.notEnoughGoldSpriteFrame;
            buttonComponent.transition = cc.Button.Transition.NONE;
        }
        this.amount.string = this.amountItem.toString();
    },
    onClickBuy() {
        if (this.currentGold < this.priceItem) {
            return
        } else {
            GoldController.subtractGold(this.priceItem);
            Emitter.emit(EventKey.GOLD.CHANGE_GOLD);
            Emitter.emit(EventKey.SOUND.PLAY_SFX,AudioName.SFX.BUY_SUCCESS);
            this.amountItem = Number(this.amountItem) + 1;
            cc.sys.localStorage.setItem(this.itemName, this.amountItem);
        }
        this.currentGold = GoldController.getGoldValue();
        this.initItem();
        this.initItemDetail();
    },
    hide(){
        this._super();
        this.itemDetail.active = false;
    }
});
