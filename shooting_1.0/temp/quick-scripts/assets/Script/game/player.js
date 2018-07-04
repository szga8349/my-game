(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/game/player.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9d57fkR7DFDnKwtfXv6lp4C', 'player', __filename);
// Script/game/player.js

'use strict';

var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        // 子弹帧数计数
        count: 0,
        // 子弹资源
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 生成的粒子资源
        blastPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // 碰撞检测
    onCollisionEnter: function onCollisionEnter(other, self) {
        console.log('飞机撞到的物体：', other.node.name);
        if (other.node.name == 'prop') {
            Global.gameData.pack = true;
            other.node.parent.removeChild(other.node);
            this.schedule(function () {
                Global.gameData.pack = false;
            }, 5, 0);
        } else {
            Global.game.gameEnd();
        }
    },

    // 子弹对象池
    bulletObjGroup: function bulletObjGroup() {
        // 储存到 Global 里面
        Global.gameData.bulletPool = new cc.NodePool();
        var initCount = 20;
        for (var i = 0; i < initCount; ++i) {
            // 创建节点
            var bullet = cc.instantiate(this.bulletPrefab);
            // 通过 putInPool 接口放入对象池
            Global.gameData.bulletPool.put(bullet);
        }
    },

    /** 
     * 创建子弹
     * key: 2 为直线射击 1 & 3 则左右两边倾斜射击
    */
    createBullet: function createBullet(parentNode) {
        var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

        var bullet = null,
            _x = this.node.getPosition().x,
            _y = this.node.getPosition().y + this.node.height / 4;
        // 通过 size 接口判断对象池中是否有空闲的对象
        if (Global.gameData.bulletPool.size() > 0) {
            bullet = Global.gameData.bulletPool.get();
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bullet = cc.instantiate(this.bulletPrefab);
        }
        bullet.setPosition(_x, _y);
        // 将生成的敌人加入节点树
        bullet.parent = parentNode;
        // 设置key标记
        bullet.datakey = key;
        // cc.log(bullet.datakey)
    },

    // 创建粒子对象池
    blastObjGroup: function blastObjGroup() {
        Global.gameData.blastPool = new cc.NodePool();
        var initCount = 50;
        for (var i = 0; i < initCount; ++i) {
            var block = cc.instantiate(this.blastPrefab);
            Global.gameData.blastPool.put(block);
        }
        // cc.log('执行粒子创建')
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // 创建子弹对象池
        this.bulletObjGroup();
        // 创建粒子对象池
        // this.blastObjGroup();
    },
    start: function start() {
        // this.getComponent('player')
    },
    update: function update(dt) {
        if (Global.gameData.over) return;
        this.count += 1;
        if (this.count % 10 == 0) {
            // 检查获取道具包
            if (Global.gameData.pack) {
                for (var i = 1; i <= 3; i++) {
                    this.createBullet(Global.game.node, i);
                }
            } else {
                this.createBullet(Global.game.node);
            }
            // 难度叠加
            if (this.count >= 1000) {
                this.count = 0;
                Global.gameData.level = Global.gameData.level == 3 ? 3 : Global.gameData.level += 1;
                console.log('难度系数：', Global.gameData.level);
            }
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
        //# sourceMappingURL=player.js.map
        