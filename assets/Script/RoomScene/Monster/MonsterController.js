const GameConfig = require("GameConfig");
const Emitter = require("Emitter");
const EventKey = require("EventKey");

cc.Class({
    extends: cc.Component,

    properties: {
        prefabMonster: {
            default: null,
            type: cc.Prefab
        },
        listChar: {
            default: [],
            type: [require('MonsterItem')],
            visible: false,
        },
        isWinLevel: {
            default: true,
            type: cc.Boolean,
            visible: false,
        },
        currentLevel: {
            default: 1,
            type: cc.Integer,
            visible: false,
        },
        spawnedCount: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        totalMonstersThisWave: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        spawnInterval: {
            default: 1.5,
            type: cc.Float,
            tooltip: "Time between monster spawns in seconds"
        }
    },

    onLoad() {
        this.registerEvent();
        this.startWave();
    },
    update(dt) {
        if(this.listChar.length === 0){
            this. onNextWave()
        }
       
    },

    startWave() {
        this.spawnedCount = 0;
        this.totalMonstersThisWave = this.calculateMonstersForLevel(this.currentLevel);
        
        console.log(`Starting Wave ${this.currentLevel} with ${this.totalMonstersThisWave} monsters`);
        
        // Start spawning monsters with intervals
        this.spawnNextMonster();
    },

    spawnNextMonster() {
        if (this.spawnedCount >= this.totalMonstersThisWave) {
            console.log(`Wave ${this.currentLevel} spawn complete!`);
            return;
        }

        this.spawnMonster();
        this.spawnedCount++;

        if (this.spawnedCount < this.totalMonstersThisWave) {
            // Schedule next monster spawn
            this.scheduleOnce(() => {
                this.spawnNextMonster();
            }, this.spawnInterval);
        }
    },

    calculateMonstersForLevel(level) {
        // Formula: 5 + level, max 50
        return Math.min(5 + level, 50);
    },

    spawnMonster() {
        const monsterTypeConfig = this.selectMonsterType(this.currentLevel, this.spawnedCount);
        this.initMonsterByType(monsterTypeConfig);
    },

    selectMonsterType(level, spawnIndex) {
        // Check if this is a boss level (every 5th level)
        if (level % 5 === 0 && this.shouldSpawnBoss(spawnIndex)) {
            return GameConfig.MONSTER.TYPE.BOSS;
        }

        // Calculate probabilities for each monster type
        const probabilities = this.calculateTypeProbabilities(level);
        const rand = Math.random();
        let cumulative = 0;

        // Check each type based on cumulative probability
        for (const [type, probability] of Object.entries(probabilities)) {
            cumulative += probability;
            if (rand <= cumulative) {
                return GameConfig.MONSTER.TYPE[type];
            }
        }

        // Fallback to DOG if something goes wrong
        return GameConfig.MONSTER.TYPE.DOG;
    },

    shouldSpawnBoss(spawnIndex) {
        // Boss appears once per boss level, randomly positioned in the wave
        const totalMonsters = this.totalMonstersThisWave;
        const bossPosition = Math.floor(Math.random() * totalMonsters);
        return spawnIndex === bossPosition;
    },

    calculateTypeProbabilities(level) {
        const probabilities = {};
        
        // Base probabilities that change with level
        let dogProb = Math.max(0.4, 0.8 - (level * 0.008)); // 80% at level 1, decreases to 40% minimum
        let infernoDogProb = Math.min(0.4, 0.15 + (level * 0.005)); // 15% at level 1, increases to 40% maximum
        let dragonProb = 0;
        
        // Dragons only appear from level 10 onwards
        if (level >= 10) {
            dragonProb = Math.min(0.2, (level - 10) * 0.004 + 0.05); // Starts at 5% from level 10, max 20%
            
            // Adjust other probabilities to accommodate dragons
            const totalOthers = dogProb + infernoDogProb;
            const adjustment = dragonProb / totalOthers;
            dogProb *= (1 - adjustment);
            infernoDogProb *= (1 - adjustment);
        }

        // Normalize to ensure total is 1
        const total = dogProb + infernoDogProb + dragonProb;
        probabilities.DOG = dogProb / total;
        probabilities.INFERNO_DOG = infernoDogProb / total;
        if (level >= 10) {
            probabilities.DRAGON = dragonProb / total;
        }

        return probabilities;
    },

    initMonsterByType(type) {
        const position = this.genInitPosison();
        const id = this.genIDMonster();
        
        // Enhanced stats calculation based on level
        const baseStats = this.calculateBaseStats(this.currentLevel);
        const hp = baseStats.hp * type.COEFFICIENT_HP;
        const damage = baseStats.damage * type.COEFFICIENT_DAMAGE;
        const durationMove = this.calculateMoveDuration(type, this.currentLevel);
        const gold = baseStats.gold * type.COEFFICIENT_GOLD;

        const monster = cc.instantiate(this.prefabMonster);
        const monsterItem = monster.getComponent(require('Monster'));
        
        monsterItem.init({
            id, 
            type, 
            hp, 
            damage, 
            durationMove, 
            gold,
            level: this.currentLevel
        });
        
        this.node.addChild(monster);
        this.positionInit(monster, position);
        monsterItem.onMove();

        this.listChar.push(monsterItem);        
        console.log(`Spawned ${type.TYPE} - HP: ${Math.round(hp)}, Damage: ${Math.round(damage)}, Gold: ${Math.round(gold)}`);
    },

    calculateBaseStats(level) {
        const levelMultiplier = 1 + (level - 1) * 0.15 + Math.pow(level - 1, 1.2) * 0.02;       
        return {
            hp: GameConfig.MONSTER.HP_BASE * levelMultiplier,
            damage: GameConfig.MONSTER.DAMAGE_BASE * levelMultiplier,
            gold: GameConfig.MONSTER.GOLD_BASE * levelMultiplier
        };
    },

    calculateMoveDuration(type, level) {
        const speedBonus = Math.min(2, level * 0.05); 
        const adjustedDuration = Math.max(3, type.DURATION_MOVE - speedBonus);
        return adjustedDuration;
    },

    positionInit(monster, worldPos) {
        const localPos = this.node.convertToNodeSpaceAR(worldPos);
        monster.setPosition(localPos);
    },

    genInitPosison() {
        const x = GameConfig.MONSTER.INIT_LOCATION.X;
        const listY = GameConfig.MONSTER.INIT_LOCATION.Y;
        const y = listY[Math.floor(Math.random() * listY.length)];
        return new cc.Vec2(x, y);
    },

    genIDMonster() {
        return Date.now() + Math.random();
    },

    registerEvent() {
        Emitter.registerEvent(EventKey.MONSTER.ON_DIE, this.onMonsterDie.bind(this));
      
    },

    unregisterEvent() {
        Emitter.removeEvent(EventKey.MONSTER.ON_DIE, this.onMonsterDie.bind(this));
    },

    onMonsterDie(monster) {
        monster.onDie();
        const index = this.listChar.indexOf(monster);
        if (index !== -1) {
            this.listChar.splice(index, 1);
        }
        if (this.listChar.length === 0 && this.spawnedCount >= this.totalMonstersThisWave) {
            this.onWaveComplete();
        }
    },

    onWaveComplete() {
        console.log(`Wave ${this.currentLevel} completed!`);
        this.scheduleOnce(() => {
            this.onNextWave();
        }, 3);
    },

    onNextWave() {
        this.currentLevel++;
        console.log(`Advancing to Wave ${this.currentLevel}`);
        this.startWave();
    },

  
    getWaveStatus() {
        return {
            currentLevel: this.currentLevel,
            spawnedCount: this.spawnedCount,
            totalMonstersThisWave: this.totalMonstersThisWave,
            aliveMonsters: this.listChar.length,
            probabilities: this.calculateTypeProbabilities(this.currentLevel)
        };
    },

    
    startSpecificWave(level) {
        this.currentLevel = level;
        this.listChar.forEach(monster => {
            if (monster.node && cc.isValid(monster.node)) {
                monster.node.destroy();
            }
        });
        this.listChar = [];
        this.startWave();
    }
});