const Emitter = require("Emitter");
const EventKey = require("EventKey");

cc.Class({
    extends: cc.Component,

    properties: {
    
    },
    onLoad(){
        this.colisionManager();
       
    },
   
    colisionManager(){
        let manager = cc.director.getCollisionManager();
        manager.enabled = true
    },
    
});
