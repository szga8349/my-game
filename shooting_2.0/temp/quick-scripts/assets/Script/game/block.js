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
    // 生成一个爆炸粒子
    createBlast: function createBlast() {
        var blast = null;
        if (Global.gameData.blastPool.size() > 0) {
            blast = Global.gameData.blastPool.get();
        } else {
            cc.log('创建新粒子');
            blast = cc.instantiate(this.blastPrefab);
        }
        // cc.log(this.node.x, this.node.y)
        blast.setPosition(this.node.x + this.node.width / 2, this.node.y - this.node.height / 2);
        blast.parent = Global.game.blockBox;
    },

    // 碰撞检测
    onCollisionEnter: function onCollisionEnter(other, self) {
        // 子弹碰撞
        if (other.node.name == 'bullet') {
            var score = Number(this.node.getChildByName('boxtext').getComponent(cc.Label).string);
            if (score == 1) {
                // this.createBlast()

                /**
                 * Auto Remove On 勾上
                 * Play On Load 勾上
                */
                var blast = cc.instantiate(this.blastPrefab);
                blast.setPosition(this.node.x + this.node.width / 2, this.node.y - this.node.height / 2);
                blast.parent = Global.game.blockBox;

                Global.gameData.blockPool.put(this.node);
            } else {
                this.node.getChildByName('boxtext').getComponent(cc.Label).string = score - 1;
                // 改变颜色
                var key = parseInt(score / 10) > 5 ? 5 : parseInt(score / 10);
                this.node.color = new cc.Color(Global.gameData.colors[key]);
            }
        }
        // 碰撞到墙，反弹
        if (other.node.name == 'wall') {
            this.node.dataxspeed = -this.node.dataxspeed;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // let _w = this.node.width
        // // 设置碰撞包围（大小变动的时候包围不会自动跟随 即 只会执行一次，再次从对象池里面拿出来就不执行了）
        // this.node.getComponent(cc.BoxCollider).size.width = this.node.getComponent(cc.BoxCollider).size.height = _w;
        // this.node.getComponent(cc.BoxCollider).offset.x = _w / 2;
        // this.node.getComponent(cc.BoxCollider).offset.y = -_w / 2;
    },
    start: function start() {},
    update: function update(dt) {
        if (this.node.y <= 0.01) {
            Global.gameData.blockPool.put(this.node);
            // cc.log('方块到达底部回收')
        } else {
            this.node.y -= 2;
            this.node.x += this.node.dataxspeed;
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
        //# sourceMappingURL=block.js.map
        