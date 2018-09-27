(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Game/Camera.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ff4bcMPMEpOrKR8PyNvcvMB', 'Camera', __filename);
// Script/Game/Camera.js

'use strict';

var Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        // 设置一个目标为摄像机的中心点
        target: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    update: function update(dt) {
        // 监测目标设为中心点
        if (this.target.x >= 0 && this.node.x < this.target.x) {
            this.node.x = this.target.x;
            // this.node.getChildByName('floor').x = this.target.x;
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
        //# sourceMappingURL=Camera.js.map
        