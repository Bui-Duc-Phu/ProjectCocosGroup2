

cc.Class({
    extends: require('BulletItem'),

    properties: {
      
    },
    onCollisionEnter(other, self) {
        this.onCollide(other)
    },
    onMove(){
        this.tween = cc.tween(this.node)
        this.tween.by(this.durationMove, { x: 3000 })
            .call(() => {
                
            })
            .start();
    },
    onCollide(target){
        this.target.push(target)
        this.onClear()
    },
    onClear(){

    },
    
   
  
  

});
