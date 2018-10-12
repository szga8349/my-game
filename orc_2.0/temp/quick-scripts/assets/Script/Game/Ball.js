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
        // 背景容器（canvas大小）
        bgColor: {
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
        // 个人最远距离
        maxLabel: {
            default: null,
            type: cc.Label
        },
        // 金币
        moneyLabel: {
            default: null,
            type: cc.Label
        },
        // 掉落金币提示
        moneyTip: {
            default: null,
            type: cc.Label
        },
        // 炸弹粒子
        explodeBoom: {
            default: null,
            type: cc.Prefab
        },
        // 金币粒子
        explodeGold: {
            default: null,
            type: cc.Prefab
        }
    },

    // 掉落金币提示动画
    moneyTipMove: function moneyTipMove(num) {
        Global.userInfo.money += num;
        this.moneyLabel.string = Global.userInfo.money;
        this.moneyTip.string = '金币 +' + num;
        var show = cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.3, 2, 2));
        var stop = cc.scaleTo(0.5, 1, 1);
        var hide = cc.spawn(cc.fadeOut(0.3), cc.scaleTo(0.3, 1, 1));
        var seq = cc.sequence(show, stop, hide);
        seq.easing(cc.easeOut(3.0));
        this.moneyTip.node.runAction(seq);
    },


    // 视觉缩放
    viewScale: function viewScale() {
        var val = 500; // 正常弹起高度
        if (this.node.y < val) return;

        // 第一种（性能更好）
        // Global.game.wrap.scale = val / this.node.y;

        /**
         * 第二种
         * 75：球的半径
         * 890：球弹起来的最大高度
         */
        var ss = 75 / (890 / this.node.y);
        Global.game.wrap.scale = (val - ss) / this.node.y;
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
        var speed = Global.gameInfo.speed;
        // console.log(speed);

        // 太阳 移动 
        sun.x -= speed;

        if (sun.x <= -sun.width) {
            sun.x = _w;

            // 难度增加
            Global.gameInfo.level = Global.gameInfo.countToatal == Global.gameInfo.minNumber ? Global.gameInfo.level : Global.gameInfo.level + 1;
            // console.log('难度增加======>', Global.gameInfo.level);

            // 判断切换背景颜色
            if (sun.opacity == 255) {
                this.colorSwitch(mountain, tree, floor, ground, 1);
                // this.bgColor.getChildByName('color-1').runAction(cc.fadeOut(0.3));
                this.bgColor.getChildByName('color-2').runAction(cc.fadeIn(0.3));
                sun.runAction(cc.fadeOut(0.3));
                cloud.runAction(cc.fadeIn(0.3));
            } else {
                this.colorSwitch(mountain, tree, floor, ground, 0);
                this.bgColor.getChildByName('color-2').runAction(cc.fadeOut(0.3));
                // this.bgColor.getChildByName('color-1').runAction(cc.fadeIn(0.3));
                sun.runAction(cc.fadeIn(0.3));
                cloud.runAction(cc.fadeOut(0.3));
            }
        }

        // 分数
        this.score_count += speed;
        if (this.score_count >= 5) {
            this.score_count = 0;
            Global.gameInfo.score += 1;
            this.scoreLabel.string = Global.gameInfo.score + 'm';
            if (Global.userInfo.maxScore > Global.gameInfo.score) {
                this.maxLabel.string = '\u8DDD\u79BB\u4E2A\u4EBA\u6700\u8FDC\u8DDD\u79BB\u8FD8\u5DEE ' + (Global.userInfo.maxScore - Global.gameInfo.score) + ' m';
            } else {
                this.maxLabel.string = '\u8D85\u8D8A\u4E2A\u4EBA\u6700\u8FDC\u8DDD\u79BB ' + (Global.gameInfo.score - Global.userInfo.maxScore) + ' m';
            }
        }

        // 云移动
        cloud.x -= 5 + speed;
        if (cloud.x <= -cloud.width) cloud.x = _w;

        // 山丘移动
        mountain.x -= 10 + speed * 2;
        if (mountain.x <= -_w) mountain.x = 0;

        // 树木移动
        tree.x -= 12.5 + speed * 2.5;
        if (tree.x <= -_w) tree.x = 0;

        // gound移动
        ground.x -= 17.5 + speed * 3.5;
        if (ground.x <= -_w) ground.x = 0;
    },


    // 撞到地板
    collisionFloor: function collisionFloor() {
        if (window.wx) wx.vibrateShort();

        if (Global.gameInfo.speed > Global.gameInfo.speedFixed) Global.gameInfo.speed = Global.gameInfo.speedFixed;
        // max => 20;
        this.bounce = 20 * (Global.gameInfo.speed / Global.gameInfo.speedFixed);

        if (!Global.gameInfo.startDash) {
            if (Global.gameInfo.speed > 1) {
                Global.gameInfo.speed = Math.ceil(Global.gameInfo.speed) - 1;
            } else {
                Global.gameInfo.speed -= 1;
            }
        }

        // console.log('撞到地板速度===>', Global.gameInfo.speed);

        Global.game.nodeShock();

        this.restData(true);
        cc.audioEngine.play(this.audioFloor, false);
    },


    // 撞到木板
    collisionBoard: function collisionBoard(node) {
        var _this = this;

        if (Global.gameInfo.state == 'over') return;
        if (window.wx) wx.vibrateShort();

        // 砸到木板
        this.isBoard = true;
        if (this.value >= 1) {
            this.bounce = 15;
        } else {
            this.bounce = 10;
        }

        if (!Global.gameInfo.startDash) {
            if (Global.gameInfo.speed > Global.gameInfo.speedFixed) {
                Global.gameInfo.speed = Global.gameInfo.speedFixed - 1;
            } else {
                Global.gameInfo.speed -= 0.5;
            }
        }

        this.scheduleOnce(function () {
            _this.restData(true);
            _this.isBoard = false;
        }, 0.01);

        cc.audioEngine.play(this.audioBoard, false);

        node.destroy();
    },


    // 撞到兽人
    collisionOrc: function collisionOrc(node) {
        var _this2 = this;

        if (Global.gameInfo.state == 'over' || this.isBoard) return;
        if (window.wx) wx.vibrateShort();

        if (this.value >= 1) {
            this.bounce = 20;
            Global.gameInfo.speed += 0.5;
            if (Global.gameInfo.speed > 8) Global.gameInfo.speed = 8;
        } else {
            var val = Global.gameInfo.speed;
            if (Global.gameInfo.speed > Global.gameInfo.speedFixed) val = Global.gameInfo.speedFixed;
            // max => 20;

            this.bounce = 18 * (val / Global.gameInfo.speedFixed);
            // if (this.bounce < 8) this.bounce = 8;

            if (!Global.gameInfo.startDash) Global.gameInfo.speed -= 0.5;

            // 高度 => 10 
            // this.bounce = 5 + Global.gameInfo.speed;
            // if (this.bounce > 10) this.bounce = 10;
            // console.log('执行自由落体');
        }

        this.scheduleOnce(function () {
            if (!_this2.isBoard) _this2.restData(false);
        }, 0.01);

        // console.log('speed', Global.gameInfo.speed);
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

        cc.audioEngine.play(this.audioDeath, false);
    },


    // 撞到宝箱
    collisionStorehouse: function collisionStorehouse(node) {
        var _this3 = this;

        if (Global.gameInfo.state == 'over') return;
        if (window.wx) wx.vibrateShort();

        if (this.value >= 1) {
            this.bounce = 25;
            Global.gameInfo.speed += 1;
            if (Global.gameInfo.speed > 8) Global.gameInfo.speed = 8;
        } else {
            this.bounce = 15;
            Global.gameInfo.speed += 0.5;
            if (Global.gameInfo.speed < 5) Global.gameInfo.speed = 3;
            if (Global.gameInfo.speed > 8) Global.gameInfo.speed = 8;
        }

        this.scheduleOnce(function () {
            _this3.restData(false);
        }, 0.01);

        node.destroy();

        // 播放粒子
        var boom = cc.instantiate(this.explodeGold);
        boom.setPosition(node.x + 50, node.y + 50);
        boom.parent = Global.game.map;

        // 金币更新
        var num = parseInt(50 * Math.random()) + 50;
        this.moneyTipMove(num);

        cc.audioEngine.play(this.audioBox, false);
    },


    // 撞到炸弹
    collisionBomb: function collisionBomb(node) {
        var _this4 = this;

        if (Global.gameInfo.state == 'over') return;
        if (window.wx) wx.vibrateLong();

        if (this.value >= 1) {
            this.bounce = 30;
            Global.gameInfo.speed += 2;
            if (Global.gameInfo.speed > 8) Global.gameInfo.speed = 8;
        } else {
            this.bounce = 20;
            Global.gameInfo.speed += 1;
            if (Global.gameInfo.speed < 5) Global.gameInfo.speed = 4;
            if (Global.gameInfo.speed > 8) Global.gameInfo.speed = 8;
        }

        this.scheduleOnce(function () {
            _this4.restData(false);
        }, 0.01);
        this.node.getChildByName('particle').getComponent(cc.ParticleSystem).resetSystem();
        Global.game.nodeShock();
        node.destroy();

        // 播放粒子
        var boom = cc.instantiate(this.explodeBoom);
        boom.setPosition(node.x + 50, node.y + 50);
        boom.parent = Global.game.map;

        cc.audioEngine.play(this.audioBoom, false);
    },


    // 碰撞回调
    onCollisionEnter: function onCollisionEnter(other, self) {
        if (Global.gameInfo.state == 'over') return;
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
        }
    },

    // 重置下参数
    restData: function restData() {
        var bone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        // 判断不是在高能陨石模式下才执行
        if (!Global.gameInfo.startDash) {
            // 判断加速框出现
            if (Global.gameInfo.speed == 8) {
                if (!this.isSprint) {
                    this.isSprint = true;
                    Global.game.speedBone.getComponent(dragonBones.ArmatureDisplay).playAnimation('move', 0);
                }
            } else {
                if (this.isSprint) {
                    this.isSprint = false;
                    Global.game.speedBone.getComponent(dragonBones.ArmatureDisplay).playAnimation('stop', 0);
                }
            }
            if (bone) {
                this.node.getChildByName('bone').getComponent(dragonBones.ArmatureDisplay).timeScale = 0.5;
            } else {
                this.node.getChildByName('bone').getComponent(dragonBones.ArmatureDisplay).timeScale = 1;
            }
        }
        // 衰减值
        this.value = 0.5;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // 弹力值
        this.bounce = 0;
        this.restData();
        // 分数计数（模拟距离）
        this.score_count = 0;
        // 是否正在加速
        this.isSprint = false;

        this.moneyLabel.string = Global.userInfo.money;
    },


    // start() {},

    update: function update(dt) {
        if (Global.gameInfo.state != 'over') {

            if (Global.gameInfo.speed <= 0) {
                Global.gameInfo.state = 'over';
                this.node.y = this.node.height / 2;
                this.bounce = 0;
                this.node.getChildByName('bone').getComponent(dragonBones.ArmatureDisplay).playAnimation('rockStop', 1);
                this.node.getChildByName('particle').getComponent(cc.ParticleSystem).stopSystem();
                Global.game.gameOver();
            }

            // 背景移动
            this.bgMove();

            // 视觉缩放监听
            this.viewScale();

            // 第一种
            this.bounce -= 1 * this.value;
            this.node.y += this.bounce;

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
        