(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/home/home.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e90d3hyrN9N7pOZvl1o1QZz', 'home', __filename);
// Script/home/home.js

'use strict';

var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {},
    openGame: function openGame() {
        cc.director.loadScene('game');
    },
    openRank: function openRank() {
        cc.director.loadScene('rank');
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        cc.director.preloadScene('game', function () {
            return console.log('预加载游戏场景成功');
        });
    },
    start: function start() {}
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
        //# sourceMappingURL=home.js.map
        