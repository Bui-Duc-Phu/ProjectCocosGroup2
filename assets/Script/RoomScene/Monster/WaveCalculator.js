const GameConfig = require("GameConfig");

cc.Class({
    statics: {
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
            
            // Calculate initial distribution
            for (const [type, probability] of Object.entries(probabilities)) {
                monsterTypeCounts[type] = Math.round(totalMonsters * probability);
            }

            // Adjust for rounding errors
            const total = Object.values(monsterTypeCounts).reduce((sum, count) => sum + count, 0);
            if (total !== totalMonsters) {
                const diff = totalMonsters - total;
                const mostCommonType = Object.entries(probabilities).reduce((a, b) => a[1] > b[1] ? a : b)[0];
                monsterTypeCounts[mostCommonType] += diff;
            }

            return monsterTypeCounts;
        }
    }
});