(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/game/game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2b3bf+No+hJc6lvPTbQbvC6', 'game', __filename);
// Script/game/game.js

'use strict';

var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        // 开始按钮
        startBtn: {
            default: null,
            type: cc.Node
        },
        // 暂停
        puaseBtn: {
            default: null,
            type: cc.Node
        },
        // 游戏开始遮罩层(这里我设成了一个全屏按钮，这样就不用初始化添加事件柄了)
        coverBox: {
            default: null,
            type: cc.Node
        },
        // 飞机
        player: {
            default: null,
            type: cc.Node
        },
        // 分数label
        scoreText: {
            default: null,
            type: cc.Label
        },
        // 方块的容器
        blockBox: {
            default: null,
            type: cc.Node
        },
        // 方块列表资源
        blockListPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 生成的方块资源
        blockPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 道具包资源（散弹）
        propPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 道具包资源（强力弹）
        forcefulPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 生成的粒子资源
        blastPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // Method:

    initGame: function initGame() {
        var _this = this;

        this.coverBox.active = false;
        // 添加触摸事件
        this.onDrag();
        Global.gameData.over = false;
        // 方块列表生成
        for (var i = 0; i < 3; i++) {
            this.createBlockList(i);
        }
        // 开始发射子弹
        this.player.getComponent('player').shooting();
        // 道具定时派出
        this.schedule(function () {
            _this.createProp();
        }, 16);
    },

    // 开始游戏
    startGame: function startGame() {
        cc.director.resume();
        this.puaseBtn.active = true;
        this.startBtn.active = false;
        this.onDrag();
    },

    // 暂停游戏
    pauseGame: function pauseGame() {
        if (Global.gameData.over) return;
        cc.director.pause();
        this.startBtn.active = true;
        this.puaseBtn.active = false;
        this.offDrag();
    },

    // 游戏结束
    gameEnd: function gameEnd() {
        console.log('游戏结束~');
        cc.director.pause();
        this.offDrag();
        Global.gameData.over = true;
        setTimeout(function () {
            cc.director.loadScene('rank', function () {
                console.log('重置游戏了~');
                cc.director.resume();
            });
        }, 1000);
    },

    // 游戏得分
    getScore: function getScore() {
        if (Global.gameData.pack == 'forceful') {
            Global.gameData.score += Global.gameData.forceful;
        } else {
            Global.gameData.score += 1;
        }
        this.scoreText.string = Global.gameData.score;
    },

    // 添加拖动监听
    onDrag: function onDrag() {
        this.player.on('touchmove', this.dragMove, this);
    },

    // 清除拖动监听
    offDrag: function offDrag() {
        this.player.off('touchmove', this.dragMove, this);
    },

    // 设置飞机拖拽
    dragMove: function dragMove(event) {
        if (Global.gameData.over) return;
        var locationv = event.getLocation();
        var location = this.node.convertToNodeSpaceAR(locationv);
        // 飞机不移出屏幕
        var minX = -this.node.width / 2 + this.player.width / 6,
            maxX = -minX,
            minY = -this.node.height / 2 + this.player.height / 6,
            maxY = -minY;
        if (location.x < minX) location.x = minX;
        if (location.x > maxX) location.x = maxX;
        if (location.y < minY) location.y = minY;
        if (location.y > maxY) location.y = maxY;
        this.player.setPosition(location);
    },

    // 创建道具包
    createProp: function createProp() {
        var type = parseInt(2 * Math.random()) + 1;
        // 随机派送一个道具
        var newProp = type == 1 ? cc.instantiate(this.propPrefab) : cc.instantiate(this.forcefulPrefab);
        var _x = parseInt((this.blockBox.width - newProp.width) * Math.random()) + 1 + newProp.width,
            _y = this.blockBox.height + newProp.height;
        newProp.setPosition(_x, _y);
        this.blockBox.addChild(newProp);
    },

    // 创建方块列表
    createBlockList: function createBlockList(num) {
        var list = cc.instantiate(this.blockListPrefab);
        list.width = this.node.width;
        list.height = 210;
        list.parent = this.blockBox;
        list.setPosition(0, Global.gameData.listSpacing * num + this.node.height);
    },

    // 创建粒子对象池
    blastObjGroup: function blastObjGroup() {
        Global.gameData.blastPool = new cc.NodePool();
        for (var i = 0; i < 20; ++i) {
            var blast = cc.instantiate(this.blastPrefab);
            blast.getComponent(cc.ParticleSystem).stopSystem();
            Global.gameData.blastPool.put(blast);
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // 储存游戏 & 重置全局数据
        Global.game = this;
        Global.gameData.over = true;
        Global.gameData.score = 0;
        Global.gameData.level = 1;
        Global.gameData.pack = '';

        // 开启碰撞系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // 开启物理系统(不需要)
        // cc.director.getPhysicsManager().enabled = true;
        // 开启碰撞系统的调试线框绘制
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        this.blastObjGroup();

        if (window.wx) {
            console.log('宽度：', this.node.width, wx.getSystemInfoSync().windowWidth);
        }
    },
    start: function start() {
        if (window.wx) {
            // 显示分享按钮
            wx.showShareMenu();

            // 设置转发分内容
            wx.onShareAppMessage(function (res) {
                // console.log('监听分享内容', res);
                return {
                    title: Global.shareInfo.title,
                    imageUrl: Global.shareInfo.url
                };
            });
        }
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
        //# sourceMappingURL=game.js.map
        