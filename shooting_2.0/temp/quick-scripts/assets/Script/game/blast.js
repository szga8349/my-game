(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/game/blast.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '15f33DRkFhPIZkc/2B3qRAJ', 'blast', __filename);
// Script/game/blast.js

"use strict";

var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // this.node.getComponent(cc.ParticleSystem).resetSystem()
        // this.scheduleOnce(() => {
        //     this.node.getComponent(cc.ParticleSystem).stopSystem()
        // }, 0.1)
        // this.scheduleOnce(() => {
        //     cc.log('粒子回收')
        //     Global.gameData.blastPool.put(this.node)
        // }, 2)
    },
    start: function start() {
        // this.node.getComponent(cc.ParticleSystem).resetSystem()
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
        //# sourceMappingURL=blast.js.map
        