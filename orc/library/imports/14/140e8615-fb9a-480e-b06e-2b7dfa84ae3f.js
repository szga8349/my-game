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
        }
    },
    // 暂停
    stateSwitch: function stateSwitch() {
        var _this = this;

        if (this.pauseGame) {
            this.pauseGame = false;
            cc.director.resume();
            cc.loader.loadRes('pause', cc.SpriteFrame, function (err, res) {
                _this.pauseBtn.getComponent(cc.Sprite).spriteFrame = res;
            });
        } else {
            this.pauseGame = true;
            cc.director.pause();
            cc.loader.loadRes('play', cc.SpriteFrame, function (err, res) {
                _this.pauseBtn.getComponent(cc.Sprite).spriteFrame = res;
            });
        }
    },

    // 再来一次
    playAgain: function playAgain() {
        // 重置参数
        Global.gameInfo.score = 0;
        Global.gameInfo.reviveScore = 0;
        Global.gameInfo.total = 20;
        Global.gameInfo.level = 0;
        Global.gameInfo.orcBoom = 6;
        Global.gameInfo.orcBoard = 5;
        Global.gameInfo.orcMoney = 10;
        // 重新加载场景
        cc.director.loadScene('Game');
    },

    // 开始
    startGame: function startGame() {
        var _this2 = this;

        this.coverStart.destroy();
        Global.gameInfo.countToatal = Global.gameInfo.total;
        var seq = cc.sequence(cc.moveTo(1, this.wrap.width / 2, 500), cc.callFunc(function () {
            Global.gameInfo.state = 'running';
            // 金币箱兽人生成
            _this2.schedule(function () {
                return _this2.creatStorehouse();
            }, Global.gameInfo.orcMoney);
            // 炸弹箱子兽人生成
            _this2.schedule(function () {
                return _this2.creatBomb();
            }, Global.gameInfo.orcBoom);
            // 木板兽人生成
            _this2.schedule(function () {
                return _this2.creatBoard();
            }, Global.gameInfo.orcBoard);
        }));
        // seq.easing(cc.easeOut(3));
        this.ball.runAction(seq);
    },

    // 游戏结束
    gameOver: function gameOver() {
        this.coverOver.active = true;
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
        var _this3 = this;

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

        // 0.2秒后回收
        this.scheduleOnce(function () {
            return _this3.bloodPool.put(blood);
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
        var orc = null;
        if (this.orcPool.size() > 0) {
            orc = this.orcPool.get();
        } else {
            console.log('对象池不够用，重新创建');
            orc = cc.instantiate(this.orc);
        }
        orc.y = 0;
        orc.x = -orc.width;
        orc.parent = this.map;
        // orc.getComponent('Orc').init(); 
    },

    // 制造宝箱
    creatStorehouse: function creatStorehouse() {
        var orc = cc.instantiate(this.storehouse);
        orc.y = 0;
        orc.x = -orc.width;
        orc.parent = this.map;
    },

    // 制造炸弹
    creatBomb: function creatBomb() {
        var orc = cc.instantiate(this.bomb);
        orc.y = 0;
        orc.x = -orc.width;
        orc.parent = this.map;
    },

    // 制造木板
    creatBoard: function creatBoard() {
        var orc = cc.instantiate(this.board);
        orc.y = 0;
        orc.x = -orc.width;
        orc.parent = this.map;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
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
        for (var i = 0; i < Global.gameInfo.total; i++) {
            this.creatOrc();
        } // 使用粒子对象池
        this.creatBloodPool();

        cc.audioEngine.playMusic(this.audioBgm, true);
    },
    start: function start() {
        var _this4 = this;

        this.node.on('touchstart', function () {
            if (Global.gameInfo.state == 'over' || _this4.pauseGame) return;

            _this4.balljs.value = 3;
            // this.balljs.bg_speed *= 2;
            // if (this.balljs.bounce > 0) 
            _this4.balljs.bounce = -Math.abs(_this4.balljs.bounce);
        }, this);
    }
}

// update (dt) {},
);

cc._RF.pop();