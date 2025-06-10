const ButtonName = require('ButtonName');
cc.Class({
    extends: require('PopupItem'),

    properties: {
        activeSpriteFrame:{
            type:cc.SpriteFrame,
            default:null
        },
        unActiveSpriteFrame:{
            type:cc.SpriteFrame,
            default:null
        },
        statsButton: {
            type:cc.Node,
            default:null
        },
        skillButton: {
            type:cc.Node,
            default:null
        },
        stats: {
            type:cc.Node,
            default:null
        },
        skill:{
            type:cc.Node,
            default:null
        }
    },
    onLoad(){
        this.init();
    },
    init(){
        
        this.stats.active = false;
        this.skill.active = false;
        this.activeNode(ButtonName.STATS);
    },
    onButtonClick(event,data){
        this.activeNode(data);
    },
    activeNode(name){
        this.stats.opacity = 0;
        this.skill.opacity = 0;
        if(name===ButtonName.STATS && !this.stats.active){
            cc.tween(this.stats)
            .call(()=>{
                this.skill.active = false;
                this.stats.active = true;
            })
            .to(0.1, { opacity: 255 }) 
            .start();
        }
        if(name===ButtonName.SKILL && !this.skill.active){
            cc.tween(this.skill)
            .call(()=>{
                this.stats.active = false
                this.skill.active = true;
            })
            .to(0.1, { opacity: 255 }) 
            .start();
        }
    },
    activeButton(name){
        if (name === ButtonName.STATS && !this.stats.active) {
            let label = this.start.getComponent(cc.Label);
            label.sp
        }
    }
});
