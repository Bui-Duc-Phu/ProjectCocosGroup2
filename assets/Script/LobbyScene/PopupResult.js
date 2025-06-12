const ScoreController = require('ScoreController');
const Emitter = require('Emitter');
const EventKey = require('EventKey');
cc.Class({
    extends: require('PopupItem'),
    properties: {
        highScoreTextLabel: {
            type: cc.Label,
            default: null
        },
        highScoreValueLabel: {
            type: cc.Label,
            default: null
        },
        scoreValueLabel: {
            type: cc.Label,
            default: null
        },
        goldLabel: {
            type: cc.Label,
            default: null
        },
    },
    onLoad() {
        this.init();
    },
    updateResult(newScore, gold) {
        let highScore = ScoreController.getHighScore(newScore);
        if (newScore === highScore) {
            this.highScoreTextLabel.string = "New High Score:";
        }
        ScoreController.setScoreValue(highScore);
        this.highScoreValueLabel.string = highScore;
        this.scoreValueLabel.string = newScore;
        this.goldLabel.string = gold;
    },
    init() {
        this.highScoreTextLabel.string = "High Score:";
        this.highScoreValueLabel.string = ScoreController.getScoreValue();
    },
    onDisable() {
        this.highScoreTextLabel.string = "High Score:";
    },
    onBackButtonClick() {
        Emitter.emit(EventKey.ROOM.EXIT);
        this.hide();
    }
});
