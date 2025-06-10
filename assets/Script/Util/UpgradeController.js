const LocalStorageKey = require('LocalStorageKey');

class UpgradeController {

    getLeverNomalAttack() {
        let lever = cc.sys.localStorage.getItem(LocalStorageKey.PLAYER.NORMAL_ATTACK_LEVEL);
        if (!lever) {
            cc.sys.localStorage.setItem(LocalStorageKey.PLAYER.NORMAL_ATTACK_LEVEL, '1');
            return 0;
        }
        lever = parseInt(lever, 10);
        return lever;
    }
    getLeverUltimate() {
        let lever = cc.sys.localStorage.getItem(LocalStorageKey.PLAYER.ULTIMATE_LEVEL);
        if (!lever) {
            cc.sys.localStorage.setItem(LocalStorageKey.PLAYER.ULTIMATE_LEVEL, '1');
            return 0;
        }
        lever = parseInt(lever, 10);
        return lever;
    }
    upgradeLeverNomalAttack() {
        let currentLever = this.getLeverNomalAttack();
        if (currentLever >= 10) {
            return false;
        }
        currentLever += 1;
        cc.sys.localStorage.setItem(LocalStorageKey.PLAYER.NORMAL_ATTACK_LEVEL, currentLever.toString());
        return true;
    }
    upgradeLeverUltimate() {
        let currentLever = this.getLeverUltimate();
        if (currentLever >= 10) {
            return false;
        }
        currentLever += 1;
        cc.sys.localStorage.setItem(LocalStorageKey.PLAYER.ULTIMATE_LEVEL, currentLever.toString());
        return true;
    }
};

const instance = new UpgradeController();

module.exports = instance;