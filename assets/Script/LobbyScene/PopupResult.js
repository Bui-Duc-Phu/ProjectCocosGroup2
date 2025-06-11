const ItemName = require('ItemName');
const GoldController = require('GoldController');
const Emitter = require('Emitter');
const EventKey = require('EventKey');
const AudioName = require('AudioName')
cc.Class({
    extends: require('PopupItem'),

    properties: {
        labelScore: {
            default: null,
            type: cc.Label,
        },
        labelSumGold: {
            default: null,
            type: cc.Label,
        },
    },
    updateResult(score, sumGold) {
        this.labelScore.string = score;
        this.labelSumGold.string = sumGold;
    },

    





   
    
});
