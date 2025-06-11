const GameConfig = {
    PLAYER:{
        HP_BASE: 150,
        POSITION:{
            
            INIT:{
                X:-450,
                Y:-100,
            }

        }
    },
    MONSTER:{
        INIT_LOCATION :{
            X:1560,
            Y:[100,300,500],
        },
        WAVE_COUNT: 10,
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
                COOLDOWN:0.5,
                UPGRADE:{
                    PERCENT_DAMAGE_ADD:0.1,
                    COST_BASE:300,
                    LEVER:{
                        '1': 1,
                        '2': 1.5,
                        '3': 2,
                        '4': 3,
                        '5': 5,
                        '6': 7,
                        '7': 8,
                        '8': 10,
                        '9': 12,
                        '10': 15,
                    }
                } 
            },
            ULTIMATE:{
                NAME:"ULTIMATE",    
                COEFFICIENT_DAMAGE:3,
                DURATION_MOVE:1.5,
                COUNT_TARGET:5,
                MOVE_BY_X:3000,
                COOLDOWN:5,
                UPGRADE:{
                    PERCENT_DAMAGE_ADD:0.1,
                    COST_BASE:500,
                    LEVER:{
                        '1': 1,
                        '2': 1.5,
                        '3': 2,
                        '4': 3,
                        '5': 5,
                        '6': 7,
                        '7': 8,
                        '8': 10,
                        '9': 12,
                        '10': 15,
                    }
                }
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
                COOLDOWN:1,
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
    },
    ROOM:{
        TIME_START_GAME: 4,
        TIME_NEXT_WAVE: 3,
        WORD_POS:{
            X:792,
            Y:478,
        },
        SUMMARY_GAME:{
            SCORE_ONE_KILL: 10,
            SCORE_ONE_WAVE: 50,
        }
    }   
}
module.exports = GameConfig;