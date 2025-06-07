const GameConfig = {
    MONSTER:{
        INIT_LOCATION :{
            X:1560,
            Y:[200,400,600],
        },
        HP_BASE:100,
        DAMAGE_BASE:25,
        GOLD_BASE:5,
        TYPE:{
            DOG:{
                TYPE: "DOG",
                COEFFICIENT_HP: 1,
                COEFFICIENT_DAMAGE: 1,
                DURATION_MOVE: 10,
                COEFFICIENT_GOLD: 1,
            },
            INFERNO_DOG:{
                TYPE: "INFERNO_DOG",
                COEFFICIENT_HP: 2,
                COEFFICIENT_DAMAGE: 1.5,
                DURATION_MOVE: 8,
                COEFFICIENT_GOLD: 3,
            },
            DRAGON:{
                TYPE: "DRAGON",
                COEFFICIENT_HP: 3,
                COEFFICIENT_DAMAGE: 2,
                DURATION_MOVE: 8,
                COEFFICIENT_GOLD: 6,
            },
            BOSS:{
                TYPE: "BOSS",
                COEFFICIENT_HP: 10,
                COEFFICIENT_DAMAGE: 4,
                DURATION_MOVE: 10,
                COEFFICIENT_GOLD: 30,
            },
        }
    }
}
module.exports = GameConfig;
