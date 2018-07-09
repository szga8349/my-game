"use strict";
cc._RF.push(module, '9d57fkR7DFDnKwtfXv6lp4C', 'player');
// Script/game/player.js

'use strict';

var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        // 子弹资源
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        count: 0
    },

    // 碰撞检测
    onCollisionEnter: function onCollisionEnter(other, self) {
        var that = this;
        // 清除撞到的道具
        function resetFn(text) {
            if (other.node.name == text) other.node.parent.removeChild(other.node);
            that.scheduleOnce(function () {
                return Global.gameData.pack = '';
            }, 5);
        }
        console.log('飞机撞到的物体：', other.node.name);
        if (other.node.name == 'prop') {
            Global.gameData.pack = 'three';
            resetFn('prop');
        } else if (other.node.name == 'forceful') {
            Global.gameData.pack = 'forceful';
            resetFn('forceful');
        } else {
            Global.game.gameEnd();
        }
    },

    // 子弹对象池
    bulletObjGroup: function bulletObjGroup() {
        // 储存到 Global 里面
        Global.gameData.bulletPool = new cc.NodePool();
        for (var i = 0; i < 50; ++i) {
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
    shooting: function shooting() {
        if (Global.gameData.over) return;
        this.count += 1;
        if (this.count % parseInt(60 / Global.gameData.bulletNum) === 0) {
            // 检查获取道具包
            if (Global.gameData.pack === 'three') {
                for (var i = 1; i <= 3; i++) {
                    this.createBullet(Global.game.node, i);
                }
            } else {
                this.createBullet(Global.game.node);
            }
        }
        if (this.count >= 600) this.count = 0;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // 创建子弹对象池
        this.bulletObjGroup();
    },
    start: function start() {
        // this.getComponent('player')
    },
    update: function update(dt) {
        this.shooting();
    }
});

cc._RF.pop();