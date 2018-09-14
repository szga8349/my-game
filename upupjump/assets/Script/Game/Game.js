const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },
        // 一开始的遮罩
        coverStart: {
            default: null,
            type: cc.Node
        },
        // 结束遮罩
        coverOver: {
            default: null,
            type: cc.Node
        }
    },
    playAgain() {
        // 重置所有参数
        Global.gameInfo.level = 1;
        Global.gameInfo.plateMinHeight = 0;
        Global.gameInfo.topScore = 0;
        Global.gameInfo.state = null;
        cc.director.loadScene('Game');
    },
    // 开始游戏
    startGmae() {
        // 向上弹跳力
        // this.bounce = Global.gameInfo.distance * Global.gameInfo.baseVal / 2;

        this.bounce = Global.gameInfo.distance / 2;

        Global.gameInfo.over = false;
        this.coverStart.destroy();
    },
    // 拖拽移动
    dragMove(event) {
        if (Global.gameInfo.over) return;
        let padding = this.player.width / 2;
        let _width = this.node.width / 2;
        // 第一种拖拽
        let delta = event.touch.getDelta();
        this.player.x += delta.x;
        if (this.player.x >= _width - padding) this.player.x = _width - padding;
        if (this.player.x < -(_width - padding)) this.player.x = -(_width - padding);
        
        // 第二种拖拽
        // let locationv = event.getLocation();
        // let location = this.node.convertToNodeSpaceAR(locationv);
        // // 不移出屏幕
        // let minX = -_width + padding,
        //     maxX = -minX;
        // if (location.x < minX) location.x = minX;
        // if (location.x > maxX) location.x = maxX;
        // this.player.setPosition(location.x, this.player.y);
    },
    // 游戏结束
    gameOver(num = 0) {
        Global.gameInfo.over = true;
        this.coverOver.active = true;
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.game = this;
        //碰撞系统
        const managerCollis = cc.director.getCollisionManager();
        managerCollis.enabled = true;
        // 开启碰撞系统的调试线框绘制
        // managerCollis.enabledDebugDraw = true;
        // managerCollis.enabledDrawBoundingBox = true;
        
        // 跳板的起始高度
        Global.gameInfo.plateMinHeight = Math.abs(this.player.y) - 40;
        this.player.getComponent('Player').creatPlate(1);
        console.log('执行');
        
    },

    start () {
        // 添加触摸事件
        this.node.on('touchmove', this.dragMove, this);
        
    },

    update (dt) {

    },
});
