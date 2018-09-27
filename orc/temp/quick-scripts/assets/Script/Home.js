(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Home.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f149fTAsvFGpqRl39CPTvqE', 'Home', __filename);
// Script/Home.js

'use strict';

var Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {},
    openGame: function openGame() {
        cc.director.loadScene('Game');
    },
    openRank: function openRank() {
        cc.director.loadScene('Rank');
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        cc.director.preloadScene('Game', function () {
            return console.log('预加载游戏场景成功');
        });
    },
    start: function start() {
        if (window.wx) {
            // 检测用户是否授权过
            wx.getUserInfo({
                success: function success(res) {
                    console.log('用户授权信息====>', res);
                },
                fail: function fail() {
                    var _w = wx.getSystemInfoSync().windowWidth,
                        _h = wx.getSystemInfoSync().windowHeight;
                    console.warn('创建获取用户信息按钮');
                    // 创建获取用户信息按钮
                    var loginBtn = wx.createUserInfoButton({
                        type: 'text',
                        text: '',
                        style: {
                            left: 0,
                            top: 0,
                            width: _w,
                            height: _h,
                            lineHeight: _h,
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            color: 'rgba(0, 0, 0, 0)',
                            textAlign: 'center',
                            fontSize: 16,
                            borderRadius: 4
                        }
                    });
                    // 监听点击事件
                    loginBtn.onTap(function (res) {
                        console.log('用户授权数据：', res);
                        if (res.errMsg != 'getUserInfo:ok') return;
                        loginBtn.destroy();
                    });
                }
            });
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
        //# sourceMappingURL=Home.js.map
        