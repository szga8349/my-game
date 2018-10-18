const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // 重置参数
    restBox() {
        this.cuted = false;
        this.node.rotation = 0;

        // 设置旋转
        this.rotationVal = parseInt(4 * Math.random());

        // 设置Y
        this.node.y = -(667 + this.node.height / 2);
        this.bounce = parseInt(6 * Math.random()) + 45;

        // 设置 X 随机移动位置
        let num = parseInt(5 * Math.random());
        let w = Global.game.map.width / 2;
        switch (num) {
            case 0:
                this.node.x = -w;
                this.deviation = parseInt(5 * Math.random()) + 3.5;
                break;
            case 1:
                this.node.x = -(w / 2);
                this.deviation = 3.75;
                break;
            case 2:
                this.node.x = 0;
                let d = parseInt(5 * Math.random());
                if (parseInt(2 * Math.random()) && d != 0) {
                    d = -d;
                    this.rotationVal = -this.rotationVal;
                }
                this.deviation = d;
                break;
            case 3:
                this.node.x = w / 2;
                this.deviation = -3.75;
                this.rotationVal = -this.rotationVal;
                break;
            case 4:
                this.node.x = w;
                this.deviation = -(parseInt(5 * Math.random()) + 3.5);
                this.rotationVal = -this.rotationVal;
                break;
        }
        
    },
    cutHandle() {
        let blast = null;
        switch (this.node.name) {
            case 'box-clock':
                blast = cc.instantiate(Global.game.propList[0]);
                Global.game.decelerate();
                break;
            case 'box-skill':
                blast = cc.instantiate(Global.game.propList[1]);
                Global.game.openLine();
                break;
        }
        blast.setPosition(this.node.x, this.node.y);
        blast.parent = this.node.parent;
        this.node.destroy();
    },

    // 判断是否切中
    isCut() {
        let h = this.node.height / 2;
        // 上方切割线
        if (this.node.y < h + 100 && this.node.y > h && Global.gameInfo.triple) {
            this.cutHandle('top');
        }
        // 中间切割线
        if (this.node.y < h && this.node.y > -h) {
            this.cutHandle('center');
        }
        // 下方切割线
        if (this.node.y < -h && this.node.y > -(h + 100) && Global.gameInfo.triple) {
            this.cutHandle('bottom');
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.range = parseInt(this.node.parent.height / 1.5);
    },

    // start () {},

    update (dt) {
        // 上下移动
        this.bounce -= Global.gameInfo.speed;
        this.node.y += this.bounce * Global.gameInfo.speed;
        this.node.x += this.deviation * Global.gameInfo.speed;

        // 旋转
        this.node.rotation += this.rotationVal * Global.gameInfo.speed;
        if (this.node.rotation >= 360) this.node.rotation = 0;

        // 判断节点回收
        if (this.node.y <= -this.range) {
            this.node.destroy();
        }
        // 判断是否切割
        if (Global.gameInfo.click && !this.cuted) this.isCut();
    },
});
