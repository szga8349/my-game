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
        // 生成的方块资源
        blockPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 道具包资源
        propPrefab: {
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
        // 方块定时生成
        this.createBlockList(5);
        this.schedule(function () {
            if (Global.gameData.level >= 3) {
                _this.createBlockList(5, true);
            } else {
                _this.createBlockList(5);
            }
        }, 6);
        // 道具定时派出
        // this.createProp()
        this.schedule(function () {
            _this.createProp();
        }, 18 / Global.gameData.level);
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
        Global.gameData.score += 1;
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
        var newProp = cc.instantiate(this.propPrefab);
        var _x = parseInt((this.blockBox.width - newProp.width) * Math.random()) + 1 + newProp.width,
            _y = this.blockBox.height + newProp.height;
        newProp.setPosition(_x, _y);
        this.blockBox.addChild(newProp);
    },

    // 方块对象池
    blockObjGroup: function blockObjGroup() {
        Global.gameData.blockPool = new cc.NodePool();
        var initCount = 50;
        for (var i = 0; i < initCount; ++i) {
            var block = cc.instantiate(this.blockPrefab);
            Global.gameData.blockPool.put(block);
        }
    },

    /**
     * 创建方块（单个）
     * num: 一列个数
     * parentNode：父节点
     * key：当前位置
     * x：x坐标
     * y：y坐标
     * score：当个方块的分数
     * needSpeed: 是否要左右偏移
    */
    createBlock: function createBlock(index) {
        var num = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
        var parentNode = arguments[2];
        var score = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var needSpeed = arguments[4];

        var spacing = 10;
        var block = null;
        var _w = (this.node.width - (num + 1) * spacing) / num;
        var _x = index * (_w + spacing) + spacing;
        var _y = this.node.height + _w;
        var colorKey = parseInt(score / 10) > 5 ? 5 : parseInt(score / 10);
        var type = parseInt(2 * Math.random());
        var xSpeed = 0;
        if (needSpeed) xSpeed = type == 0 ? parseInt(5 * Math.random()) : parseInt(-5 * Math.random());
        // 从对象池获取节点
        if (Global.gameData.blockPool.size() > 0) {
            block = Global.gameData.blockPool.get();
        } else {
            block = cc.instantiate(this.blockPrefab);
        }
        // 设置宽高
        block.width = block.height = _w;
        // 设置碰撞包围
        block.getComponent(cc.BoxCollider).size.width = block.getComponent(cc.BoxCollider).size.height = _w;
        block.getComponent(cc.BoxCollider).offset.x = _w / 2;
        block.getComponent(cc.BoxCollider).offset.y = -_w / 2;
        // 设置颜色
        block.color = new cc.Color(Global.gameData.colors[colorKey]);
        // 设置定位
        block.setPosition(_x, _y);
        // 子节点分数
        block.getChildByName('boxtext').getComponent(cc.Label).string = score;
        // 将生成的敌人加入节点树
        block.parent = parentNode;
        // 设置方块 X轴 速度
        block.dataxspeed = xSpeed;
    },

    // 生成一列方块
    createBlockList: function createBlockList(num, needSpeed) {
        var _w = this.node.width / num;
        for (var i = 0; i < num; i++) {
            var random = parseInt(10 * Global.gameData.level * Math.random()) + 10 * Global.gameData.level * 1.2;
            this.createBlock(i, num, this.blockBox, random, needSpeed);
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // 储存游戏 & 重置全局数据
        Global.game = this;
        Global.gameData.over = true;
        Global.gameData.score = 0;
        Global.gameData.level = 1;
        Global.gameData.pack = false;

        // 开启碰撞系统
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // 开启物理系统(不需要)
        // cc.director.getPhysicsManager().enabled = true;
        // 开启碰撞系统的调试线框绘制
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        // 创建方块对象池
        this.blockObjGroup();

        if (window.wx) {
            console.log('宽度：', this.node.width, wx.getSystemInfoSync().windowWidth);
        }
    },
    start: function start() {
        if (window.wx) {
            // 显示分享按钮
            wx.showShareMenu({
                withShareTicket: true,
                success: function success(res) {
                    console.log('打开分享成功');
                },
                fail: function fail(err) {
                    console.log('打开分享失败');
                }
            });

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
        