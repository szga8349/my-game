const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 主角
        player: {
            default: null,
            type: cc.Node
        },
        // 开始遮罩层
        coverStart: {
            default: null,
            type: cc.Node
        },
    },
    // 再次游戏
    playeAgain() {
        cc.director.loadScene('Game');
    },
    // 开始游戏
    startGame() {
        this.coverStart.active = false;
        this.node.getChildByName('camera').getComponent('Camera').ismove = true;
    },
    // 点击跳跃
    jump() {
        if (this.gameover || this.clickNum == 2) return;
        this.clickNum += 1;
        // 开始播放骨骼跳跃动画
        this.player.getComponent(dragonBones.ArmatureDisplay).playAnimation('jump', 1);
        // 设置重力
        // this.player.getComponent(cc.RigidBody).gravityScale = 1;
        if (this.clickNum == 1) {
            this.player.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 1000);
        } else if (this.clickNum == 2) {
            this.player.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 850);
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameover = true;
        Global.game = this;
        Global.gameInfo.score = 0;
        Global.gameInfo.maxSpeed = 5;
        // 点击次数记录
        this.clickNum = 0;
        // 开启物理系统
        cc.director.getPhysicsManager().enabled = true;
        // 设置引力
        cc.director.getPhysicsManager().gravity = cc.v2(0, -2600);
        // 开启碰撞系统
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // 开启调试框
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
    },

    start () {
        this.node.on('touchstart', this.jump, this);
        if (window.wx) {
            // 显示分享按钮
            wx.showShareMenu();
            // 设置转发分内容
            wx.onShareAppMessage(res => {
                // console.log('监听分享内容', res);
                return {
                    title: Global.shareInfo.title,
                    imageUrl: Global.shareInfo.url,
                }
            });
        }
    },

    // update (dt) {},
});
