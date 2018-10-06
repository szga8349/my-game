"use strict";
cc._RF.push(module, '140e8YV+5pIDrBuK336hK4/', 'Game');
// Script/Game/Game.js

'use strict';

var Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        // 整体容器（缩放用）
        wrap: {
            default: null,
            type: cc.Node
        },
        ball: {
            default: null,
            type: cc.Node
        },
        // 开始遮罩
        coverStart: {
            default: null,
            type: cc.Node
        },
        // 地图容器
        map: {
            default: null,
            type: cc.Node
        },
        // 兽人
        orc: {
            default: null,
            type: cc.Prefab
        },
        // 宝箱
        storehouse: {
            default: null,
            type: cc.Prefab
        },
        // 炸弹
        bomb: {
            default: null,
            type: cc.Prefab
        },
        // 木板
        board: {
            default: null,
            type: cc.Prefab
        },
        // 血液粒子
        blood: {
            default: null,
            type: cc.Prefab
        },
        // 开始遮罩
        coverOver: {
            default: null,
            type: cc.Node
        },
        // bgm
        audioBgm: {
            default: null,
            type: cc.AudioClip
        },
        audioFail: {
            default: null,
            type: cc.AudioClip
        },
        pauseBtn: {
            default: null,
            type: cc.Node
        },
        // 火焰闪屏
        blaze: {
            default: null,
            type: cc.Node
        },
        // 复活音效
        audioRevive: {
            default: null,
            type: cc.AudioClip
        }
    },
    openRank: function openRank() {
        Global.restData();
        cc.director.loadScene('Rank');
    },
    openShare: function openShare() {
        wx.shareAppMessage({
            title: Global.shareInfo.title,
            imageUrl: Global.shareInfo.url
        });
    },

    // 屏幕震动
    nodeShock: function nodeShock() {
        if (window.wx) wx.vibrateLong();
        this.wrap.stopAllActions();
        var seq = cc.sequence(cc.moveTo(0.1, 0, 30), cc.moveTo(0.1, 0, -30), cc.moveTo(0.1, 0, 30), cc.moveTo(0.1, 0, -30), cc.moveTo(0.1, 0, 0));
        this.wrap.runAction(seq);
    },

    // 火焰动画
    blazeMove: function blazeMove() {
        var _this = this;

        if (window.wx) wx.vibrateLong();
        var seq = cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.callFunc(function () {
            Global.gameInfo.startDash = 1;
            _this.blaze.destroy();
            console.log('冲刺结束');
        }));
        this.blaze.runAction(seq);
    },

    // 暂停
    stateSwitch: function stateSwitch() {
        var _this2 = this;

        if (this.pauseGame) {
            this.pauseGame = false;
            cc.director.resume();
            cc.loader.loadRes('pause', cc.SpriteFrame, function (err, res) {
                _this2.pauseBtn.getComponent(cc.Sprite).spriteFrame = res;
            });
        } else {
            this.pauseGame = true;
            cc.director.pause();
            cc.loader.loadRes('play', cc.SpriteFrame, function (err, res) {
                _this2.pauseBtn.getComponent(cc.Sprite).spriteFrame = res;
            });
        }
    },

    // 复活游戏
    reviveGame: function reviveGame() {
        var _this3 = this;

        cc.audioEngine.play(this.audioRevive, false);
        this.coverOver.getChildByName('revive').destroy();
        this.coverOver.active = false;
        var seq = cc.sequence(cc.moveBy(0.5, 0, 350), cc.callFunc(function () {
            _this3.ball.getChildByName('bone').getComponent(dragonBones.ArmatureDisplay).playAnimation('rock', 0);
            _this3.ball.getChildByName('particle').getComponent(cc.ParticleSystem).resetSystem();
            _this3.balljs.restData();
            _this3.balljs.bounce = 0;
            Global.gameInfo.state = 'running';
            Global.playBgm = true;
            cc.audioEngine.playMusic(_this3.audioBgm, true);
            _this3.revived = true;
        }));
        this.ball.runAction(seq);
    },

    // 再来一次
    playAgain: function playAgain() {
        Global.restData();
        cc.director.loadScene('Home');
    },

    // 开始
    startGame: function startGame() {
        var _this4 = this;

        this.coverStart.destroy();
        Global.gameInfo.countToatal = Global.gameInfo.total;
        var seq = cc.sequence(cc.moveTo(1, this.wrap.width / 2, 500), cc.callFunc(function () {
            Global.gameInfo.state = 'running';
            // 金币箱兽人生成
            _this4.schedule(function () {
                return _this4.creatPropOrc(_this4.storehouse);
            }, Global.gameInfo.orcMoney);
            // 炸弹箱子兽人生成
            _this4.schedule(function () {
                return _this4.creatPropOrc(_this4.bomb);
            }, Global.gameInfo.orcBoom);
            // 木板兽人生成
            _this4.schedule(function () {
                return _this4.creatPropOrc(_this4.board);
            }, Global.gameInfo.orcBoard);
            if (Global.gameInfo.startDash > 1) {
                _this4.blazeMove();
            } else {
                _this4.blaze.destroy();
            }
        }));
        this.ball.runAction(seq);
        // 针对全面屏手机做的地板拉长
        if (this.node.width >= 1500) {
            cc.find('move-box/floor', this.wrap).width = 3600;
            console.log('针对全面屏手机做的地板拉长');
        }
    },

    // 游戏结束
    gameOver: function gameOver() {
        Global.saveData();
        this.coverOver.active = true;
        if (!this.revived) {
            this.coverOver.getChildByName('revive').active = true;
            var seq = cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1.3, 1.2), cc.scaleTo(0.2, 1, 1)));
            this.coverOver.getChildByName('revive').runAction(seq);
        }
        Global.playBgm = false;
        cc.audioEngine.stopMusic();
        cc.audioEngine.play(this.audioFail, false);
    },

    // 血液粒子对象池
    creatBloodPool: function creatBloodPool() {
        this.bloodPool = new cc.NodePool();
        for (var i = 0; i < Global.gameInfo.total - 5; ++i) {
            var blood = cc.instantiate(this.blood);
            this.bloodPool.put(blood);
        }
    },

    // 血浆粒子爆炸
    explode: function explode(node) {
        var _this5 = this;

        var blood = null,
            _x = node.x + node.width / 2,
            _y = node.y + node.height / 2;
        if (this.bloodPool.size() > 0) {
            blood = this.bloodPool.get();
        } else {
            cc.log('重新创建粒子');
            blood = cc.instantiate(this.blood);
        }
        blood.setPosition(_x, _y);
        blood.parent = this.map;
        blood.getComponent(cc.ParticleSystem).resetSystem();

        // 0.5秒后回收
        this.scheduleOnce(function () {
            return _this5.bloodPool.put(blood);
        }, 0.5);
    },

    // 兽人对象池
    creatOrcPool: function creatOrcPool() {
        this.orcPool = new cc.NodePool();
        for (var i = 0; i < Global.gameInfo.total; ++i) {
            var orc = cc.instantiate(this.orc);
            this.orcPool.put(orc);
        }
    },

    // 制造兽人
    creatOrc: function creatOrc() {
        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        var orc = null;
        if (this.orcPool.size() > 0) {
            orc = this.orcPool.get();
        } else {
            console.log('对象池不够用，重新创建');
            orc = cc.instantiate(this.orc);
        }
        orc.y = 0;
        orc.x = -orc.width;
        // 赋值（兽人速度）
        if (index != null) {
            console.log('兽人速度赋值');
            orc.moveSpeed = 2 + 0.8 * Global.gameInfo.crazy * index;
            orc.getChildByName('node').getComponent(dragonBones.ArmatureDisplay).timeScale = 1 + index * 0.1;
        }
        orc.parent = this.map;
    },

    // 制造道具兽人
    creatPropOrc: function creatPropOrc(typeNode) {
        var orc = cc.instantiate(typeNode);
        orc.y = 0;
        orc.x = -orc.width;
        orc.moveSpeed = parseInt(5 * Math.random()) + 5 * Global.gameInfo.crazy;
        orc.getChildByName('node').getComponent(dragonBones.ArmatureDisplay).timeScale = 1 + orc.moveSpeed / 5 * 0.2;
        orc.parent = this.map;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        var _this6 = this;

        Global.game = this;

        //碰撞系统
        var managerCollis = cc.director.getCollisionManager();
        managerCollis.enabled = true;
        // 开启碰撞系统的调试线框绘制
        // managerCollis.enabledDebugDraw = true;
        // managerCollis.enabledDrawBoundingBox = true;

        // ball 脚本
        this.balljs = this.ball.getComponent('Ball');

        // 使用兽人对象池
        this.creatOrcPool();

        // 产出兽人

        var _loop = function _loop(i) {
            _this6.scheduleOnce(function () {
                _this6.creatOrc(i);
                // console.log(i);
            }, 0.2);
        };

        for (var i = Global.gameInfo.total; i > 0; i--) {
            _loop(i);
        }

        // 使用粒子对象池
        this.creatBloodPool();
    },
    start: function start() {
        var _this7 = this;

        this.node.on('touchstart', function () {
            if (Global.gameInfo.state == 'over' || _this7.pauseGame) return;

            _this7.balljs.value = 3;
            // this.balljs.bg_speed *= 2;
            // if (this.balljs.bounce > 0) 
            _this7.balljs.bounce = -Math.abs(_this7.balljs.bounce);
        }, this);
    }
}

// update (dt) {},
);

cc._RF.pop();