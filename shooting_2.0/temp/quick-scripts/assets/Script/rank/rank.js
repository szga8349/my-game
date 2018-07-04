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

    onLoad: function onLoad() {
        this.scoreText.string = '历史最高得分：' + Global.gameData.score;
    },
    start: function start() {
        if (window.wx) {
            // 显示分享按钮
            wx.showShareMenu({
                withShareTicket: true,
                success: function success(res) {
                    console.log('打开分享成功');
                },
                fail: function fail(err) {
                    console.log('打开分享失败');
                }
            });

            // 设置转发分内容
            wx.onShareAppMessage(function (res) {
                // console.log('监听分享内容', res);
                return {
                    title: Global.shareInfo.title,
                    imageUrl: Global.shareInfo.url
                };
            });
        }
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
        