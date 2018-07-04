(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/rank/rank.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '176f3H41mpDmbBb+8Ug+/U8', 'rank', __filename);
// Script/rank/rank.js

'use strict';

var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        // 分数label
        scoreText: {
            default: null,
            type: cc.Label
        }
    },
    backHome: function backHome() {
        cc.director.loadScene('home');
    },
    backGame: function backGame() {
        cc.director.loadScene('game');
    },
    closeRank: function closeRank() {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {
        this.scoreText.string = '历史最高得分：' + Global.gameData.score;
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
        //# sourceMappingURL=rank.js.map
        