const Emitter = require('Emitter');
const GameConfig = require('GameConfig');
const SpineAnimation = require('SpineAnimation');

cc.Class({
    extends: cc.Component,
    properties: {
        maxHP: {
            default: 1500,
            type: cc.Integer,
        },
        currentHP: {
            default: 1500,
            type: cc.Integer,
            visible: false,
        },
    },
});