"use strict";
cc._RF.push(module, '10919IcMlRJCIJnVTKIFzRH', 'Rank');
// Script/Rank.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        // 子项目容器
        subBox: {
            default: null,
            type: cc.Sprite
        }
    },
    openShare: function openShare() {
        wx.shareAppMessage({
            title: Global.shareInfo.title,
            imageUrl: Global.shareInfo.url
        });
    },
    backGame: function backGame() {
        if (window.wx) wx.postMessage({ action: 'hide' });
        cc.director.loadScene('Game');
    },
    backHome: function backHome() {
        cc.director.loadScene('Home');
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        if (window.wx) {
            wx.postMessage({
                action: 'show'
            });
        }
    },
    start: function start() {
        if (window.wx) {
            // 设置一个子项目canvas
            this.sub = new cc.Texture2D();
            // 显示分享按钮
            wx.showShareMenu();
            // 设置转发分内容
            wx.onShareAppMessage(function (res) {
                return {
                    title: Global.shareInfo.title,
                    imageUrl: Global.shareInfo.url
                };
            });
        }
    },
    updaetSubDomainCanvas: function updaetSubDomainCanvas() {
        if (!this.sub) return;
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.sub.initWithElement(sharedCanvas);
        this.sub.handleLoadedTexture();
        this.subBox.spriteFrame = new cc.SpriteFrame(this.sub);
    },
    update: function update(dt) {
        this.updaetSubDomainCanvas();
    }
});

cc._RF.pop();