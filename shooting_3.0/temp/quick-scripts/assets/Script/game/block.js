(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/game/block.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e7d0974x19JXpWRfDc9wC/w', 'block', __filename);
// Script/game/block.js

'use strict';

var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        // 生成的粒子资源
        blastPrefab: {
            default: null,
            type: cc.Prefab
        }
    },
    // 粒子爆炸
    explode: function explode() {
        var blast = null,
            _x = this.node.x + this.node.width / 2,
            _y = this.node.y - this.node.height / 2;
        if (Global.gameData.blastPool.size() > 0) {
            blast = Global.gameData.blastPool.get();
        } else {
            cc.log('重新创建粒子');
            blast = cc.instantiate(this.blastPrefab);
            // blast.getComponent(cc.ParticleSystem).stopSystem();
        }
        blast.setPosition(_x, _y);
        blast.parent = this.node.parent;
        blast.getComponent(cc.ParticleSystem).resetSystem();
        this.scheduleOnce(function () {
            Global.gameData.blastPool.put(blast);
        }, 0.1);
    },

    // 碰撞检测
    onCollisionEnter: function onCollisionEnter(other, self) {
        // 子弹碰撞
        if (other.node.name == 'bullet') {
            var label = this.node.getChildByName('boxtext').getComponent(cc.Label);
            var type = this.node.datatype;
            if (label.string == 1) {
                /**
                 * 粒子爆炸一
                 * Auto Remove On 勾上
                 * Play On Load 勾上
                */

                // let blast = cc.instantiate(this.blastPrefab);
                // blast.setPosition(this.node.x + this.node.width / 2, this.node.y - this.node.height / 2);
                // blast.parent = this.node.parent;

                // 粒子爆炸二
                this.explode();
                // 方块消失
                this.node.active = false;
            } else {
                if (Global.gameData.pack == 'forceful') {
                    label.string = Number(label.string) - Global.gameData.forceful;
                    if (label.string <= 0) {
                        this.explode();
                        this.node.active = false;
                    }
                } else {
                    label.string = Number(label.string) - 1;
                }
                // 改变颜色
                this.node.color = new cc.Color(Global.randomColor(label.string, type));
            }
        }
        // 碰撞到墙，反弹（废弃）
        if (other.node.name == 'wall') {
            this.node.dataxspeed = -this.node.dataxspeed;
        }
    }
}
// LIFE-CYCLE CALLBACKS:

// onLoad () {},

// start () {},

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
        //# sourceMappingURL=block.js.map
        