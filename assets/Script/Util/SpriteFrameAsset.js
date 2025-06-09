const GameConfig = require("GameConfig");
cc.Class({
    extends: cc.Component,

    properties: {
        dogSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        infernoDogSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        dragonSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
        bossSpriteFrame:{
            default:null,
            type:cc.SpriteFrame
        },
    },
    getSpriteFramByType(type){
        switch(type){
            case GameConfig.MONSTER.TYPE.DOG.TYPE:
                return this.dogSpriteFrame;
            case GameConfig.MONSTER.TYPE.INFERNO_DOG.TYPE:
                return this.infernoDogSpriteFrame;
            case GameConfig.MONSTER.TYPE.DRAGON.TYPE:
                return this.dragonSpriteFrame;
            case GameConfig.MONSTER.TYPE.BOSS.TYPE:
                return this.bossSpriteFrame;
        }
    }

});
