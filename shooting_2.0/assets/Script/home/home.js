const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    openGame() {
        cc.director.loadScene('game');
    },
    openRank() {
        cc.director.loadScene('rank');
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.preloadScene('game', () => console.log('预加载游戏场景成功'));
    },

    start () {
        if (window.wx) {
            // 显示分享按钮
            wx.showShareMenu({
                withShareTicket: true,
                success(res) {
                    console.log('打开分享成功');
                },
                fail(err) {
                    console.log('打开分享失败');
                }
            })
            // 设置转发分内容
            wx.onShareAppMessage(res => {
                // console.log('监听分享内容', res);
                return {
                    title: Global.shareInfo.title,
                    imageUrl: Global.shareInfo.url,
                }
            })
        }
    },

    // update (dt) {},
});
