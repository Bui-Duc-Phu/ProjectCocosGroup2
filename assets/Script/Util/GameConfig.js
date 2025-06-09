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
                NAME: "DOG",
                COEFFICIENT_HP: 1,
                COEFFICIENT_DAMAGE: 1,
                DURATION_MOVE: 10,
                COEFFICIENT_GOLD: 1,
            },
            INFERNO_DOG:{
                NAME: "INFERNO_DOG",
                COEFFICIENT_HP: 2,
                COEFFICIENT_DAMAGE: 1.5,
                DURATION_MOVE: 8,
                COEFFICIENT_GOLD: 3,
            },
            DRAGON:{
                NAME: "DRAGON",
                COEFFICIENT_HP: 3,
                COEFFICIENT_DAMAGE: 2,
                DURATION_MOVE: 8,
                COEFFICIENT_GOLD: 6,
            },
            BOSS:{
                NAME: "BOSS",
                COEFFICIENT_HP: 10,
                COEFFICIENT_DAMAGE: 4,
                DURATION_MOVE: 10,
                COEFFICIENT_GOLD: 30,
            },
        }
    },
    BULLET:{
        DAMAGE_BASE:50,
        TYPE:{
            NOMAL:{
                NAME:"NOMAL",
                COEFFICIENT_DAMAGE:1,
                DURATION_MOVE:1.5,
                COUNT_TARGET:1,
                MOVE_BY_X:3000,
            },
            ULTIMATE:{
                NAME:"ULTIMATE",    
                COEFFICIENT_DAMAGE:2,
                DURATION_MOVE:1.5,
                COUNT_TARGET:5,
                MOVE_BY_X:3000,
            },
        }
    },
    SHOP:{
        ITEM:{
            BOMB:{
                NAME:"BOMB",
                COST:200,
                COUNT:1000,
                COEFFICIENT_DAMAGE:1.25,
                COUNT_TARGET:1000,
                DURATION_MOVE:1.5,
                MOVE_BY_X:1000,
                POSITION:{
                    INIT:{
                        X:600,
                        Y:713,
                    },
                    MOVE_TO:{
                        X:800,
                        Y:337,
                    }
                }
            }
        }
    }   
}
module.exports = GameConfig;
