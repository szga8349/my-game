const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 线条资源
        prefab: {
            default: null,
            type: cc.Prefab
        },
    },
    // 第一条
    first() {
        const line = cc.instantiate(this.prefab);
        // 给一个标记检测是否输出过坐标点
        line.outputLocation = true;
        line.width = parseInt(this.node.width);
        line.getComponent(cc.BoxCollider).size.width = line.width;
        line.getComponent(cc.BoxCollider).offset.x = line.width / 2;
        line.x = Global.gameInfo.location.x;
        line.y = Global.gameInfo.location.y; 
        // 输出到对应容器
        line.parent = this.node;
    },
    // 之后的线条生成
    single() {
        const line = cc.instantiate(this.prefab);
        let maxWidth = Global.gameInfo.length.max,
            minWidth = Global.gameInfo.length.min,
            rotate = parseInt(Math.random() * (Global.gameInfo.range.max - Global.gameInfo.range.min + 1) + Global.gameInfo.range.min),
            // 计算坐标超出范围
            winHeight = this.node.height / 2 - 200;
        // 给一个标记检测是否输出过坐标点
        line.outputLocation = true;
        // 随机一条长度
        line.width = parseInt(Math.random() * (maxWidth - minWidth + 1) + minWidth);
        line.getComponent(cc.BoxCollider).size.width = line.width;
        line.getComponent(cc.BoxCollider).offset.x = line.width / 2;
        line.x = Global.gameInfo.location.x;
        line.y = Global.gameInfo.location.y;
        // 判断旋转类型旋转
        if (this.plus === true && Global.gameInfo.location.y < winHeight) {
            rotate *= 1;
        } else if (this.plus === false && Global.gameInfo.location.y > -winHeight) {
            rotate *= -1 
        } else if (this.plus === true && Global.gameInfo.location.y >= winHeight) {
            // 当线条超出上半部分
            rotate = 45;
            line.width = parseInt(Math.sqrt(Global.gameInfo.location.y * Global.gameInfo.location.y * 2));
            line.getComponent(cc.BoxCollider).size.width = line.width;
            line.getComponent(cc.BoxCollider).offset.x = line.width / 2;
        } else if (this.plus === false && Global.gameInfo.location.y <= -winHeight) {
            // 当线条超出下半部分
            rotate = -45;
            line.width = parseInt(Math.sqrt(Global.gameInfo.location.y * Global.gameInfo.location.y * 2));
            line.getComponent(cc.BoxCollider).size.width = line.width;
            line.getComponent(cc.BoxCollider).offset.x = line.width / 2;
        } else {
            rotate = parseInt(Math.random() * 2) == 1 ? rotate *= 1 : rotate *= -1;
        }
        // 旋转
        line.rotation = rotate;
        // 更改下状态
        this.plus = rotate < 0 ? true : false;
        // 设置道具
        let prop = line.getChildByName('prop'),
            deviation = { x: 0, y: 0 },
            maxNum = line.width / 4;
        deviation.y = parseInt(Math.random() * 2) == 1 ? 100 : -100;
        deviation.x = parseInt(Math.random() * maxNum) + maxNum;
        prop.active = true;
        prop.y = deviation.y;
        prop.x = deviation.x;
        // 输出到对应容器
        line.parent = this.node;
        // cc.log('更改下状态', this.plus)
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 设置一个 旋转角度 正负状态
        this.plus = 0;
        this.first();
    },

    start () {

    },

    // update (dt) {},
});
