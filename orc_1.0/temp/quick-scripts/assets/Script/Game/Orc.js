(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Game/Orc.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '97443cTQwVMNq2iqPKKQ/56', 'Orc', __filename);
// Script/Game/Orc.js

'use strict';

var Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {},

    nodeMove: function nodeMove() {
        if (this.node.name == 'orc') {
            if (this.node.x > this.node.parent.width) {
                this.node.x = -this.node.width;
            }
        } else {
            if (this.node.x > this.node.parent.width) {
                this.node.destroy();
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {

    // },

    // start () {

    // },

    update: function update(dt) {
        this.node.x += this.node.moveSpeed;
        this.nodeMove();
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
        //# sourceMappingURL=Orc.js.map
        