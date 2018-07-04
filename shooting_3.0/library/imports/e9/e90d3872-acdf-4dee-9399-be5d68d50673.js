"use strict";
cc._RF.push(module, 'e90d3hyrN9N7pOZvl1o1QZz', 'home');
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
    start: function start() {
        if (window.wx) {
            // 显示分享按钮
            wx.showShareMenu();

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