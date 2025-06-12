const GameConfig = require('GameConfig');
cc.Class({
    extends: cc.Component,
    properties: {
        price: {
            type: cc.Label,
            default: null
        }
    },
    onLoad() {
        this.init();
    },
    init() {
        this.price.string = GameConfig.SHOP.ITEM.BOMB.COST.toString();
        console.log(this.price);
    }
});