const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    nodeMove() {
        if (this.node.name == 'orc') {
            if (this.node.x < -this.node.width) {
                this.node.x = this.node.parent.width;
            }
        } else {
            if (this.node.x < -this.node.width) {
                this.node.destroy();
            }
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
        
    // },

    // start () {

    // },

    update (dt) {
        if (Global.gameInfo.state == 'over') {
            if (this.node.x <= this.node.parent.width) {
                // this.node.getChildByName('node').getComponent(dragonBones.ArmatureDisplay).timeScale = 1;
                this.node.x += this.node.moveSpeed;
            }
        } else {
            // console.log(Global.game.balljs.accelerate, '执行');
            if (Global.game.balljs.accelerate) {
                this.node.x -= this.node.moveSpeed;
            } else {
                this.node.x -= this.node.moveSpeed * 2;
            }
            this.nodeMove();
        }
    },
});
