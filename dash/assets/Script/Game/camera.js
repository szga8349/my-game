const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        // 设置一个目标为摄像机的中心点
        target: {
            default: null,
            type: cc.Node
        },
        // 画面移动速度
        speed: 0.2,
    },

    nodeMove() {
        if (this.node.x > this.target.x) {
            this.node.x -= (this.node.x - this.target.x) * this.speed;
            if (Math.round(this.node.x) == Math.round(this.target.x)) {
                this.node.x = this.target.x;
            }
        } else if (this.node.x < this.target.x) {
            this.node.x += (this.target.x - this.node.x) * this.speed;
            // console.log('执行x2', this.node.x);
            if (Math.round(this.node.x) == Math.round(this.target.x)) {
                this.node.x = this.target.x;
            }
        }
        
        if (this.node.y < this.target.y + 246) {
            this.node.y += (this.target.y + 246 - this.node.y) * this.speed;
            if (Math.round(this.node.y) == Math.round(this.target.y + 246)) {
                this.node.y = this.target.y + 246;
            }
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    update (dt) {
        if (Global.game.DieFly) {
            this.nodeMove();
        }
        if (Global.gameInfo.state != 'over') {
            this.nodeMove();
        }
    },
});
