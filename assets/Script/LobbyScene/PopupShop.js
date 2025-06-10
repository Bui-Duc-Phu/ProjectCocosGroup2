const ItemName = require('ItemName');
const GoldController = require('GoldController');
const Emitter = require('Emitter');
const EventKey = require('EventKey');
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
        iconItemDetail:{
            type: cc.Node,
            default: null
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
        console.log(this.itemList);
        this.itemList.forEach(item => {
            let priceItem = Number(item.getComponent("Item").price.string);
            let priceColor = item.getComponent("Item").price.node.color;
            if(!this.isGoldEnough(priceItem)){
                console.log(this.isGoldEnough(priceItem));
                priceColor = cc.Color.RED;
            }else{
                priceColor = cc.Color.WHITE;
            }
        });

    },
    isGoldEnough(priceItem){
        return this.currentGold >= priceItem;
    },

    onClickItem(event, typeItem) {
        const item = event.target;
        this.priceItem = Number(item.getComponent("Item").price.string);
        console.log(this.priceItem);
        const spriteFrame = item.getChildByName("Icon").getComponent(cc.Sprite).spriteFrame;
        this.initItemDetail(spriteFrame);
    },

    initItemDetail(spriteFrame) {
        this.itemDetail.active = true;
        this.iconItemDetail.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },
    onClickBuy(){
        if(this.currentGold<this.priceItem){
            return
        }else{
            GoldController.subtractGold(this.priceItem);
            Emitter.emit(EventKey.GOLD.CHANGE_GOLD);
        }
    }
});
