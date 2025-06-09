
const ItemName = require('ItemName');
cc.Class({
    extends: require('PopupItem'),
    properties: {
       shopItem:{
        type:cc.Node,
        default: null
       },
       itemDetail:{
        type:cc.Node,
        default:null
       }
    },
    onLoad(){
        this.init();
    },
    init(){
        this.itemDetail.active = false;
        this.itemList = this.shopItem.children; 
    },
    onClickItem(event,typeItem){
        const item = event.target;
        const spiteFrame = item.getComponent(cc.Sprite).spiteFrame;
        this.initItemDentail
        
    },
    initItemDentail(spiteFrame){
        this.initItemDentail.active = true;
        this.itemDetail.getComponent(cc.spiteFrame).spiteFrame = spiteFrame;
    }

});
