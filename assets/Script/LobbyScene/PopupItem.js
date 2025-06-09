
cc.Class({
    extends: cc.Component,
    properties:{
        overlay: {
            type:cc.Node,
            default: null
        }
    },
    show() {
        this.node.opacity = 0;
        cc.tween(this.node)
            .call(()=>{
                this.node.active = true;
            })
            .to(0.1, { opacity: 255 }) 
            .start();
    },
    hide() {
        cc.tween(this.node)
            .to(0.1, { opacity: 0 }) 
            .call(() => {
                this.overlay.active = false;
                this.node.active = false;  
            })
            .start();
    }
});
