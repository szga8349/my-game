(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/game/bullet.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c3374eoZUdLNrPr1a2pkYwq', 'bullet', __filename);
// Script/game/bullet.js

"use strict";

var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {},

    // 子弹移动
    bulletMove: function bulletMove() {
        this.node.y += 20;

        if (this.node.datakey == 1) {
            this.node.x += -3;
        } else if (this.node.datakey == 3) {
            this.node.x += 3;
        } else if (this.node.datakey == 4) {
            this.node.x += -6;
        } else if (this.node.datakey == 5) {
            this.node.x += 6;
        }

        if (this.node.y > this.node.parent.height) {
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
        //# sourceMappingURL=bullet.js.map
        