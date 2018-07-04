"use strict";
cc._RF.push(module, 'c3374eoZUdLNrPr1a2pkYwq', 'bullet');
// Script/game/bullet.js

"use strict";

var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {},
    becomeLarger: function becomeLarger() {},

    // 子弹移动
    bulletMove: function bulletMove() {
        var size = Global.gameData.pack == 'forceful' ? 48 : 22;
        this.node.width = this.node.height = size;

        this.node.y += 25;

        if (this.node.datakey == 1) {
            this.node.x += -3;
        } else if (this.node.datakey == 3) {
            this.node.x += 3;
        } else if (this.node.datakey == 4) {
            this.node.x += -6;
        } else if (this.node.datakey == 5) {
            this.node.x += 6;
        }

        if (this.node.y >= this.node.parent.height / 2) {
            Global.gameData.bulletPool.put(this.node);
            // cc.log('超出距离回收子弹')
        }
    },

    // 碰撞检测
    onCollisionEnter: function onCollisionEnter(other, self) {
        Global.gameData.bulletPool.put(this.node);
        Global.game.getScore();
        // cc.log('击中方块得分！')
    },


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        // cc.log(this.node.datakey)
    },
    update: function update(dt) {
        this.bulletMove();
    }
});

cc._RF.pop();