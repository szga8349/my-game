const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    restSize() {
        let top = parseInt(300 * Math.random());
        let scale = (parseInt(6 * Math.random()) + 8) * 0.1;
        this.value = (parseInt(5 * Math.random()) + 1) * 0.1;
        this.node.x = -(this.size.w + this.node.width / 2);
        this.node.y = this.size.h - top;
        this.node.scale = scale;
        // console.log('初始化坐标=========>', this.node.x, this.node.y, scale);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.size = {
            w: this.node.parent.width / 2,
            h: this.node.parent.height / 2,
        }
        this.restSize();
    },

    // start () {},

    update (dt) {
        this.node.x += 1 * this.value;
        this.node.y -= 1.2 * this.value;
        if (this.node.x - this.node.width > this.size.w) {
            this.restSize(); 
        }
    },
});
