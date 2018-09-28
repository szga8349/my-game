(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Game/Ball.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cb8acBJ2t5H26YyJTwSNrq5', 'Ball', __filename);
// Script/Game/Ball.js

'use strict';

var Global = require('Global');
var colors = [{
    mountain: '#7D2C1B',
    tree: '#491D12',
    floor: '#75280C',
    ground: '#3D1805'
}, {
    mountain: '#81b68c',
    tree: '#65977a',
    floor: '#e5c282',
    ground: '#2b5748'
}];
cc.Class({
    extends: cc.Component,

    properties: {
        // 风景移动容器
        moveBox: {
            default: null,
            type: cc.Node
        },
        // 背景容器
        // background: {
        //     default: null,
        //     type: cc.Node
        // },
        bg2: {
            default: null,
            type: cc.Node
        },
        // 音效
        audioFloor: {
            default: null,
            type: cc.AudioClip
        },
        audioDeath: {
            default: null,
            type: cc.AudioClip
        },
        audioBox: {
            default: null,
            type: cc.AudioClip
        },
        audioBoom: {
            default: null,
            type: cc.AudioClip
        },
        audioBoard: {
            default: null,
            type: cc.AudioClip
        },
        // 分数
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        // 金币
        moneyLabel: {
            default: null,
            type: cc.Label
        }
    },

    // 视觉缩放
    viewScale: function viewScale() {
        // console.log(Global.game.wrap.scale);
        if (this.node.y < 500) return;
        Global.game.wrap.scale = (1110 - 600) / this.node.y;
    },


    // 颜色过渡切换
    colorSwitch: function colorSwitch(mountain, tree, floor, ground, num) {
        function transform(node, key) {
            var seq = cc.sequence(cc.fadeOut(0.3), cc.callFunc(function () {
                node.color = cc.hexToColor(colors[num][key]);
            }), cc.fadeIn(0.3));
            node.runAction(seq);
        }
        transform(mountain, 'mountain');
        transform(tree, 'tree');
        transform(floor, 'floor');
        transform(ground, 'ground');

        // mountain.color = cc.hexToColor(colors[num].mountain);
        // tree.color = cc.hexToColor(colors[num].tree);
        // floor.color = cc.hexToColor(colors[num].floor);
        // ground.color = cc.hexToColor(colors[num].ground);
    },


    // 背景移动
    bgMove: function bgMove() {
        var _w = this.moveBox.width;
        var sun = this.moveBox.getChildByName('sun'),
            tree = this.moveBox.getChildByName('tree'),
            mountain = this.moveBox.getChildByName('mountain'),
            floor = this.moveBox.getChildByName('floor'),
            ground = this.moveBox.getChildByName('ground'),
            cloud = this.moveBox.getChildByName('cloud');
        // 太阳 移动 
        sun.x -= this.bg_speed / 8;
        if (sun.x <= -sun.width) {
            sun.x = _w;

            // 难度增加
            Global.gameInfo.level = Global.gameInfo.countToatal == Global.gameInfo.minNumber ? Global.gameInfo.level : Global.gameInfo.level + 1;
            console.log('难度增加======>', Global.gameInfo.level);

            // 判断切换背景颜色
            // console.log('========> 切换背景颜色');
            if (sun.opacity == 255) {
                this.colorSwitch(mountain, tree, floor, ground, 1);
                this.bg2.runAction(cc.fadeIn(0.3));
                sun.runAction(cc.fadeOut(0.3));
                cloud.runAction(cc.fadeIn(0.3));
            } else {
                this.colorSwitch(mountain, tree, floor, ground, 0);
                this.bg2.runAction(cc.fadeOut(0.3));
                sun.runAction(cc.fadeIn(0.3));
                cloud.runAction(cc.fadeOut(0.3));
            }
        }

        // 分数
        this.score_count += this.bg_speed / 16 * this.value;
        if (this.score_count >= 2) {
            this.score_count = 0;
            Global.gameInfo.score += 1;
            this.scoreLabel.string = Global.gameInfo.score + 'm';
        }

        // 云移动
        cloud.x -= this.bg_speed / 8;
        if (cloud.x <= -cloud.width) cloud.x = _w;

        // 山丘移动
        mountain.x -= this.bg_speed / 3;
        if (mountain.x <= -_w) mountain.x = 0;

        // 树木移动
        tree.x -= this.bg_speed / 2;
        if (tree.x <= -_w) tree.x = 0;

        // gound移动
        ground.x -= this.bg_speed / 1.5;
        if (ground.x <= -_w) ground.x = 0;
    },


    // 重置下参数
    restData: function restData() {
        var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var bone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        // 砸地板计数
        this.floorNum = num;
        // 背景移动速度
        if (!bone) this.bg_speed = 16;
        // 衰减值
        this.value = 0.5;
        if (bone) {
            this.node.getChildByName('bone').getComponent(dragonBones.ArmatureDisplay).timeScale = 0.5;
        } else {
            this.node.getChildByName('bone').getComponent(dragonBones.ArmatureDisplay).timeScale = 1;
        }
    },


    // 撞到地板
    collisionFloor: function collisionFloor() {
        this.floorNum += 5;
        if (this.floorNum >= 25) {
            Global.gameInfo.state = 'over';
            this.node.y = this.node.height / 2;
            this.bounce = 0;
            cc.log('游戏结束');
            this.node.getChildByName('bone').getComponent(dragonBones.ArmatureDisplay).playAnimation('rockStop', 1);
            this.node.getChildByName('particle').getComponent(cc.ParticleSystem).stopSystem();
            Global.game.gameOver();
        } else {
            this.bounce = 25 - this.floorNum;
        }

        this.bg_speed = this.bg_speed / 2;

        cc.log('撞到地面', this.floorNum);

        this.restData(this.floorNum, true);
        cc.audioEngine.play(this.audioFloor, false);
    },


    // 撞到兽人
    collisionOrc: function collisionOrc(node) {
        var _this = this;

        if (Global.gameInfo.state == 'over' || this.value <= 1 || this.isBoard) return;
        // console.log('衰减值=======>', this.value);
        if (this.bounce < 20 && !this.isBoard) this.bounce = 20; // 上升高度

        // 播放溅血粒子
        Global.game.explode(node);
        // 回收兽人
        Global.game.orcPool.put(node);

        // 做难度判断是否生成兽人
        if (Global.gameInfo.total - Global.gameInfo.level >= Global.gameInfo.countToatal) {
            Global.game.creatOrc();
        } else {
            console.log('减少一个兽人============>');
            Global.gameInfo.countToatal = Global.gameInfo.countToatal <= Global.gameInfo.minNumber ? Global.gameInfo.minNumber : Global.gameInfo.countToatal - 1;
        }

        this.scheduleOnce(function () {
            if (!_this.isBoard) _this.restData();
        }, 0.01);

        cc.audioEngine.play(this.audioDeath, false);
    },


    // 撞到宝箱
    collisionStorehouse: function collisionStorehouse(node) {
        var _this2 = this;

        if (Global.gameInfo.state == 'over' || this.value <= 1) return;
        if (this.bounce < 25) this.bounce = 25; // 上升高度
        node.destroy();

        // 金币更新
        var num = parseInt(10 * Math.random()) + 10;
        Global.gameInfo.money += num;
        this.moneyLabel.string = Global.gameInfo.money;

        this.scheduleOnce(function () {
            _this2.restData();
        }, 0.01);
        cc.audioEngine.play(this.audioBox, false);
    },


    // 撞到炸弹
    collisionBomb: function collisionBomb(node) {
        var _this3 = this;

        if (Global.gameInfo.state == 'over' || this.value <= 1) return;
        this.bounce = 30; // 上升高度
        node.destroy();
        this.scheduleOnce(function () {
            _this3.restData();
        }, 0.01);
        cc.audioEngine.play(this.audioBoom, false);
    },


    // 撞到木板
    collisionBoard: function collisionBoard(node) {
        var _this4 = this;

        if (Global.gameInfo.state == 'over' || this.value <= 1) return;
        this.bounce = 15; // 上升高度
        this.floorNum = 10;
        node.destroy();
        this.isBoard = true; // 碰到木板
        this.scheduleOnce(function () {
            _this4.restData(_this4.floorNum);
            _this4.isBoard = false;
            console.log('floorNum', _this4.floorNum);
        }, 0.01);
        cc.audioEngine.play(this.audioBoard, false);
    },


    // 碰撞回调
    onCollisionEnter: function onCollisionEnter(other, self) {
        // console.log(other.node.name);

        switch (other.node.name) {
            case 'floor':
                this.collisionFloor();
                break;
            case 'orc':
                this.collisionOrc(other.node);
                break;
            case 'storehouse':
                this.collisionStorehouse(other.node);
                break;
            case 'bomb':
                this.collisionBomb(other.node);
                break;
            case 'board':
                this.collisionBoard(other.node);
                break;
            default:
                break;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // 弹力值
        this.bounce = 0;
        this.restData();
        // 分数计数（模拟距离）
        this.score_count = 0;
    },
    start: function start() {},
    update: function update(dt) {
        if (Global.gameInfo.state == 'running') {
            // 背景移动
            this.bgMove();

            // 视觉缩放监听
            this.viewScale();

            // 第一种
            this.bounce -= 1 * this.value;
            this.node.y += this.bounce;
            // console.log(this.bounce * this.value);

            // 防止掉落
            if (this.node.y < 0) this.node.y = this.node.width / 2 + 1;
        }
    }
});

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
        //# sourceMappingURL=Ball.js.map
        