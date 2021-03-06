const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 遮罩层
        coverBox: {
            default: null,
            type: cc.Node
        },
        // 主角
        player: {
            default: null,
            type: cc.Node
        },
        // 游戏进行状态
        gameover: true,
        // 背景容器
        bgBox: {
            default: null,
            type: cc.Node
        }
    },
    openGame() {
        cc.director.loadScene('Game');
    },
    openRank() {
        cc.director.loadScene('Rank');
    },
    openHome() {
        cc.director.loadScene('Home');
    },
    // 随机更换背景
    switchBg () {
        let num = parseInt(4 * Math.random());
        this.bgBox.getChildByName(`bg-${num + 1}`).active = true;
    },
    // 初始化游戏（开始）
    initGame() {
        this.coverBox.active = false;
        let action = cc.moveTo(0.5, cc.p(0, 0));
        this.player.runAction(action);
        this.scheduleOnce(() => {
            Global.game.gameover = false;
            // 检测关卡是否需要随机旋转
            if (Global.levels[Global.gameInfo.level].random === true) {
                this.node.getChildByName('camera').getComponent('Camera').randomRotate();
            }
        }, 1);
    },
    // 选择方向
    tapDirection() {
        if (Global.game.gameover) return;
        // direction => 要移动的方向 move_direction => 转弯的方向
        if (this.direction != this.move_direction) this.direction = this.move_direction;
        // 执行摄像机点击旋转
        if (Global.gameInfo.rotate) this.node.getChildByName('camera').getComponent('Camera').clickRotate();
        // 执行方向旋转
        let action = null;
        switch (this.direction) {
            case 'left':
                action = cc.rotateTo(0.2, -90);
                break;
            case 'right':
                action = cc.rotateTo(0.2, 90);
                break;
            case 'top':
                action = cc.rotateTo(0.2, 0);
                break;
            case 'down':
                action = cc.rotateTo(0.2, 180);
                break;
        }
        this.player.runAction(action);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.game = this;
        // 开启碰撞系统
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // 开启碰撞系统的调试线框绘制 （摄像机模式下线框会跟随移动，但碰撞实体位置不变）
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
        this.switchBg();
    },

    start() {
        // 添加点击事件
        this.node.on('touchstart', this.tapDirection, this);
        // 添加键盘事件（地图生成测试用）
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, e => {
            switch (e.keyCode) {
                case cc.KEY.b:
                    this.node.getChildByName('camera').getComponent('Camera').camera.zoomRatio -= 0.1;
                    break;
                case cc.KEY.v:
                    this.node.getChildByName('camera').getComponent('Camera').camera.zoomRatio += 0.1;
                    break;
                case cc.KEY.g:
                    if (Global.game.gameover) break;
                    this.node.getChildByName('camera').getComponent('Camera').stateSwitch();
                    break;
            }
            
        }, this)
    },

    // update (dt) {},
});
