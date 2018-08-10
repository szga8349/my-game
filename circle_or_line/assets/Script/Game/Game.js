const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        circleLeft: {
            default: null,
            type: cc.Node
        },
        circleRight: {
            default: null,
            type: cc.Node
        },
        // 遮住层
        cover: {
            default: null,
            type: cc.Node
        },
        // 得分
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        state: true,
    },
    btn() {
        if (this.state) {
            cc.director.pause();
        } else {
            cc.director.resume();
        }
        this.state = !this.state
    },
    // 游戏得分
    sendScore() {
        Global.gameInfo.score += 1;
        this.scoreLabel.string = '得分：' + Global.gameInfo.score;
    },
    // 游戏结束
    gameEnd() {
        this.circleLeft.getComponent(cc.RigidBody).gravityScale = 0;
        this.circleRight.getComponent(cc.RigidBody).gravityScale = 0;
        this.circleLeft.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.circleRight.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.gameover = true;
        this.scheduleOnce(() => {
            cc.director.loadScene('Rank');
        }, 1);
        cc.log('游戏结束了');
    },
    // 圆圈点击移动
    circleMove() {
        if (this.gameover) {
            if (this.init) return;
            this.init = true;
            this.cover.active = false;
            Global.game.circleLeft.getComponent(cc.RigidBody).gravityScale = 1;
            Global.game.circleRight.getComponent(cc.RigidBody).gravityScale = 1;
            this.gameover = false;
        } else {
            this.circleLeft.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 300);
            this.circleRight.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 300);
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.gameover = true;
        this.init = false;
        Global.gameInfo.score = 0;
        Global.game = this;
        Global.gameInfo.location = { x: 0, y: 0 };
        // 开启物理系统
        cc.director.getPhysicsManager().enabled = true;
        // 设置引力
        cc.director.getPhysicsManager().gravity = cc.v2(0, -700);
        // 开启碰撞系统
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // 开启碰撞系统的调试线框绘制
        manager.enabledDebugDraw = true;
    },

    start () {
        this.node.on('touchstart', this.circleMove, this);
    },

    // update (dt) {},
});
