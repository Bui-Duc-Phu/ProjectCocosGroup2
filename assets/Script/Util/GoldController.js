const LocalStorageKey = require('LocalStorageKey');

class GoldController {
    constructor() {
        this.getGoldValue();
    }
    getGoldValue() {
        const goldString = cc.sys.localStorage.getItem(LocalStorageKey.PLAYER.GOLD);
        if (!goldString) {
            cc.sys.localStorage.setItem(LocalStorageKey.PLAYER.GOLD, '0');
            return 0;
        }
        const goldValue = parseInt(goldString, 10);
        return goldValue;
    }

    addGold(amount) {
        if (typeof amount !== 'number' || amount <= 0 || isNaN(amount)) {
            return false;
        }
        let currentGold = this.getGoldValue();
        currentGold += Math.floor(amount);
        cc.sys.localStorage.setItem(LocalStorageKey.PLAYER.GOLD, currentGold.toString());
        return true;
    }

    subtractGold(amount) {
        if (typeof amount !== 'number' || amount <= 0 || isNaN(amount)) {
            return false;
        }
        let currentGold = this.getGoldValue();
        if (currentGold < amount) {
            return false;
        }
        currentGold -= Math.floor(amount);
        cc.sys.localStorage.setItem(LocalStorageKey.PLAYER.GOLD, currentGold.toString());
        return true;
    }

    destroy() {
        GoldController.instance = null;
    }
};

const instance = new GoldController();

module.exports = instance;