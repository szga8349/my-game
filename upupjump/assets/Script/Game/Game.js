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
        },
        // 能量条
        progress: {
            default: null,
            type: cc.Node
        },
        // 进度提示
        progressPrompt: {
            default: null,
            type: cc.Node
        },
        // 拖拽箭头提示
        upper: {
            default: null,
            type: cc.Node
        },
        giaogiao: {
            default: null,
            type: cc.AudioClip
        }
    },
    // 进度条更新
    checkProgress(num = 0) {
        let val = this.progress.getChildByName('val').getComponent(cc.Label);
        let line = this.progress.getChildByName('line');
        Global.gameInfo.progressVal += Number(num);
        line.height = 50 * Global.gameInfo.progressVal < 500 ? 50 * Global.gameInfo.progressVal : 500;
        val.string = parseInt(Global.gameInfo.progressVal / 10);
        // 满加速提示
        if (Global.gameInfo.progressVal == 10) {
            this.touchNum = 0;
            // 提示文字
            let action = cc.sequence(
                cc.fadeIn(0.2), 
                cc.scaleTo(0.2, 1.5), 
                cc.scaleTo(0.2, 1), 
                cc.scaleTo(0.2, 1.5), 
                cc.scaleTo(0.2, 1), 
                cc.scaleTo(0.2, 1.5), 
                cc.scaleTo(0.2, 1), 
                cc.fadeOut(0.2));
            this.progressPrompt.runAction(action);
            // 上滑箭头
            let top = cc.spawn(cc.moveBy(0.5, 0, 300), cc.scaleTo(0.5, 1, 1.5), cc.fadeIn(0.5)); 
            let down = cc.spawn(cc.moveBy(0.1, 0, -300), cc.scaleTo(0.1, 1, 1), cc.fadeOut(0.1));
            let seq = cc.sequence(top, down);
            let rep = cc.repeat(seq, 3);
            this.upper.runAction(rep);
        }
    },
    // 重玩
    playAgain() {
        // 重置所有参数
        Global.gameInfo.level = 1;
        Global.gameInfo.spaceScore = 0;
        Global.gameInfo.progressVal = 0;
        Global.gameInfo.state = null;
        cc.director.loadScene('Game');
    },
    // 开始游戏
    startGmae() {
        // 向上弹跳力
        this.bounce = Global.gameInfo.distance / 2;
        Global.gameInfo.over = false;
        this.coverStart.destroy();
        let playerjs = this.player.getComponent('Player');
        if (Global.gameInfo.first) {
            Global.gameInfo.first = false;
            playerjs.creatBlackHole(2);
        }
        playerjs.creatDragonfly();
        // 每1分钟出现一次黑洞
        this.schedule(() => {
            cc.log('每1分钟出现一次黑洞');
            if (!this.node.getChildByName('map').getChildByName('black_hole')) playerjs.creatBlackHole();
        }, 60);
        // 每30秒出现一次黑洞
        this.schedule(() => {
            if (!this.node.getChildByName('map').getChildByName('dragonfly')) playerjs.creatDragonfly();
        }, 30);
        
    },
    // 拖拽移动
    dragMove(event) {
        if (Global.gameInfo.over) return;
        let padding = this.player.width / 2;
        let _width = this.node.width / 2;
        // 左右拖拽
        let delta = event.touch.getDelta();
        this.player.x += delta.x;
        if (this.player.x >= _width - padding) this.player.x = _width - padding;
        if (this.player.x < -(_width - padding)) this.player.x = -(_width - padding);

        // 上滑处理
        this.touchNum += delta.y;
        let playerjs = this.player.getComponent('Player');
        if (this.touchNum > 200 && Global.gameInfo.progressVal >= 10 && !playerjs.actionMove) {
            // 设备震动
            if (window.wx) wx.vibrateShort(); cc.log('上滑');
            cc.audioEngine.play(this.giaogiao, false);
            // 动画加速
            playerjs.actionMove = true;
            Global.game.bounce = 60;
            Global.gameInfo.progressVal -= 10;
            this.checkProgress();
            // 左右两边动画
            let left = this.player.getChildByName('left'),
                right = this.player.getChildByName('right');
            let spawnToLeft = cc.spawn(cc.moveBy(0.3, -100, 0), cc.fadeIn(0.3));
            let spawnToRight = cc.spawn(cc.moveBy(0.3, 100, 0), cc.fadeIn(0.3));
            left.runAction(spawnToRight);
            right.runAction(spawnToLeft);

            // 设置上升动画
            let upMove = cc.moveBy(14, 0, 10000);
            upMove.easing(cc.easeExponentialOut());

            // 整个屏幕震动
            let action = cc.sequence(
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30),
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30),
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30),
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30),
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30),
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30),
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30),
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30),
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30),
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30),
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30),
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30),
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30),
                cc.moveBy(0.1, 30, 30),
                cc.moveBy(0.1, -30, -30)
                );
            this.node.runAction(action);
                
            this.scheduleOnce(() => {
                // 左右两边动画结束
                let spawnToLeft2 = cc.spawn(cc.moveBy(0.3, -100, 0), cc.fadeOut(0.3));
                let spawnToRight2 = cc.spawn(cc.moveBy(0.3, 100, 0), cc.fadeOut(0.3));
                left.runAction(spawnToLeft2);
                right.runAction(spawnToRight2);
                // 重置参数
                Global.game.bounce = 0;
                this.player.stopAction(upMove);
                playerjs.actionMove = false;
            }, 3);
            this.player.runAction(upMove);
        }
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
        // 重置分数
        Global.gameInfo.topScore = 0;
        console.log('跳板的起始高度', Global.gameInfo.plateMinHeight);
        
        // 输出跳板
        this.player.getComponent('Player').creatPlate(true);
        // 第一次玩的话给他8个道具充能
        if (Global.gameInfo.first) this.checkProgress(8);
        // 狂热模式回来的处理
        if (Global.gameInfo.state == 'space') {
            this.checkProgress();
            this.player.getComponent('Player').setScore();
            this.coverStart.getChildByName('text').getComponent(cc.Label).string = '点击屏幕继续giao起来！';
        }
        
    },

    start () {
        // 添加触摸事件
        this.node.on('touchstart', () => {
            this.touchNum = 0;
        }, this);
        this.node.on('touchmove', this.dragMove, this);
    },

    update (dt) {

    },
});
