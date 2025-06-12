const GameConfig = require("GameConfig");

const WaveCalculator = {
    calculateMonsterCountForLevel(level) {
        const waveCount = GameConfig.MONSTER.WAVE_COUNT;
        return Math.min(waveCount + level, 50);
    },

    calculateMonsterTypeProbabilities(level) {
        const probabilities = {};
        let dogProb = Math.max(0.4, 0.8 - (level * 0.008));
        let infernoDogProb = Math.min(0.4, 0.15 + (level * 0.005));
        let dragonProb = 0;

        if (level >= 10) {
            dragonProb = Math.min(0.2, (level - 10) * 0.004 + 0.05);
            const totalOthers = dogProb + infernoDogProb;
            const adjustment = dragonProb / totalOthers;
            dogProb *= (1 - adjustment);
            infernoDogProb *= (1 - adjustment);
        }

        const total = dogProb + infernoDogProb + dragonProb;
        probabilities.DOG = dogProb / total;
        probabilities.INFERNO_DOG = infernoDogProb / total;
        if (level >= 10) {
            probabilities.DRAGON = dragonProb / total;
        }
        return probabilities;
    },

    calculateMonsterTypeCounts(level, totalMonsters) {
        const probabilities = this.calculateMonsterTypeProbabilities(level);
        const monsterTypeCounts = {};
        const sortedTypes = Object.entries(probabilities).sort((a, b) => b[1] - a[1]); 
        let assignedTotal = 0;

        for (let i = 0; i < sortedTypes.length - 1; i++) {
            const [type, prob] = sortedTypes[i];
            const count = Math.floor(totalMonsters * prob);
            monsterTypeCounts[type] = count;
            assignedTotal += count;
        }

        const [lastType] = sortedTypes[sortedTypes.length - 1];
        monsterTypeCounts[lastType] = totalMonsters - assignedTotal;
        return monsterTypeCounts;
    }
};

module.exports = WaveCalculator;