const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    nodeMove() {
        if (this.node.name == 'orc') {
            if (this.node.x > this.node.parent.width) {
                this.node.x = -this.node.width;
            }
        } else {
            if (this.node.x > this.node.parent.width) {
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
        this.node.x += this.node.moveSpeed;
        this.nodeMove();
    },
});
