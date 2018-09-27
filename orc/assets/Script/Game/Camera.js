const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        // 设置一个目标为摄像机的中心点
        target: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    update (dt) {
        // 监测目标设为中心点
        if (this.target.x >= 0 && this.node.x < this.target.x) {
            this.node.x = this.target.x;
            // this.node.getChildByName('floor').x = this.target.x;
        }
    },
});
