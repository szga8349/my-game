(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Game/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '140e8YV+5pIDrBuK336hK4/', 'Game', __filename);
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
        cc.director.loadScene('Game');
    },

    // 开始
    startGame: function startGame() {
        var _this2 = this;

        this.coverStart.destroy();

        var seq = cc.sequence(cc.moveTo(1, this.wrap.width / 2, 500), cc.callFunc(function () {
            Global.gameInfo.state = 'running';
            _this2.schedule(function () {
                _this2.creatStorehouse();
            }, 5);

            _this2.schedule(function () {
                _this2.creatBomb();
            }, 10);

            _this2.schedule(function () {
                _this2.creatBoard();
            }, 8);
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

    // 制造兽人
    creatOrc: function creatOrc() {
        var orc = cc.instantiate(this.orc);
        orc.y = 0;
        orc.x = -orc.width;
        orc.parent = this.map;
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
        //碰撞系统（不需要）
        var managerCollis = cc.director.getCollisionManager();
        managerCollis.enabled = true;
        // 开启碰撞系统的调试线框绘制
        // managerCollis.enabledDebugDraw = true;
        // managerCollis.enabledDrawBoundingBox = true;

        // ball 脚本
        this.balljs = this.ball.getComponent('Ball');

        // 产出兽人
        for (var i = 0; i < 20; i++) {
            this.creatOrc();
        }cc.audioEngine.playMusic(this.audioBgm, true);
    },
    start: function start() {
        var _this3 = this;

        this.node.on('touchstart', function () {
            if (Global.gameInfo.state == 'over' || _this3.pauseGame) return;
            // 第一种
            _this3.balljs.value = 3;
            // this.balljs.bg_speed *= 2;
            // if (this.balljs.bounce > 0) 
            _this3.balljs.bounce = -Math.abs(_this3.balljs.bounce);
        }, this);
    }
}

// update (dt) {},
);

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Game.js.map
        