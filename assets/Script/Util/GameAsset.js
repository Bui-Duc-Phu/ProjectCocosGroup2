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
        nomalBulletPrefab:{
            default:null,
            type:cc.Prefab
        },
        ultiBulletPrefab:{
            default:null,
            type:cc.Prefab
        },
        bombBulletPrefab:{
            default:null,
            type:cc.Prefab
        },
    },
    getSpriteFramByType(type){
        switch(type){
            case GameConfig.MONSTER.TYPE.DOG.NAME:
                return this.dogSpriteFrame;
            case GameConfig.MONSTER.TYPE.INFERNO_DOG.NAME:
                return this.infernoDogSpriteFrame;
            case GameConfig.MONSTER.TYPE.DRAGON.NAME:
                return this.dragonSpriteFrame;
            case GameConfig.MONSTER.TYPE.BOSS.NAME:
                return this.bossSpriteFrame;
        }
    },
    getBulletPrefabByType(type){
        switch(type){
            case GameConfig.BULLET.TYPE.NOMAL.NAME:
                return this.nomalBulletPrefab;
            case GameConfig.BULLET.TYPE.ULTIMATE.NAME:
                return this.ultiBulletPrefab;
            case GameConfig.SHOP.ITEM.BOMB.NAME:
                return this.bombBulletPrefab;
        }
    }

});
