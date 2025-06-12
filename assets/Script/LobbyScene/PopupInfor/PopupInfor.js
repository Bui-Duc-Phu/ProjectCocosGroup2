const LocalStorageKey = require('LocalStorageKey');
const ScoreController = require('ScoreController');

cc.Class({
    extends: require('PopupItem'),
    properties: {
        username: {
            type: cc.Label,
            default: null
        },
        highScore: {
            type: cc.Label,
            default: null
        }
    },
    onLoad() {
        this.init()
    },
    init() {
        let username = cc.sys.localStorage.getItem(LocalStorageKey.PLAYER.NAME);
        this.username.string = username;
        this.highScore.string = ScoreController.getScoreValue();
    },
});
