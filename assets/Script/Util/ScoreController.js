const LocalStorageKey = require('LocalStorageKey');

class ScoreController {
    constructor() {
        this.getScoreValue();
    }
    getScoreValue() {
        let score = cc.sys.localStorage.getItem(LocalStorageKey.ROOM.RECORD_SCORE);
        if (!score) {
            cc.sys.localStorage.setItem(LocalStorageKey.ROOM.RECORD_SCORE, '0');
            return 0;
        }
        score = parseInt(score, 10);
        return score;
    }
    setScoreValue(score){
        cc.sys.localStorage.setItem(LocalStorageKey.ROOM.RECORD_SCORE, score);
    }
    getHighScore(newScore) {
        let score = this.getScoreValue();
        return newScore > score ? newScore : score;
    }
};

const instance = new ScoreController();

module.exports = instance;