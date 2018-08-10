const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    onCollisionEnter(other, self) {
        Global.game.gameEnd();
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update (dt) {
        if (Global.game.gameover) return;
        if (this.node.x > -(this.node.parent.width / 2 + this.node.width)) {
            this.node.x -= 4;
        } else {
            // cc.log('销毁节点');
            this.node.destroy();
        }
        // 已知 c 和 ∠sinC，求 对边a 和 邻边b
        let sin = Math.abs(this.node.rotation);
        let c = this.node.width;
        let a = parseInt(c * Math.sin(sin * Math.PI * 2 / 360) / Math.sin(90 * Math.PI * 2 / 360));
        let b = parseInt(Math.sqrt(c * c - a * a));
        // 判断需要生成线条进行尾部拼接
        if (this.node.x + b <= (this.node.parent.width / 2) && this.node.outputLocation === true) {
            this.node.outputLocation = false;
            if (this.node.rotation > 0) a *= -1;
            Global.gameInfo.location.y += a;
            // 抛出一个坐标
            Global.gameInfo.location.x = this.node.x + b - 5;
            this.node.parent.getComponent('Map').single();
            // console.log(Global.gameInfo.location);
        }
    },
});
