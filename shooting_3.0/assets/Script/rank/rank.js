const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 分数label
        scoreText: {
            default: null,
            type: cc.Label
        },
    },
    backHome() {
        cc.director.loadScene('home');
    },
    backGame() {
        cc.director.loadScene('game');
    },
    closeRank() {

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.scoreText.string = '历史最高得分：' + Global.gameData.score
    },

    start () {
        if (window.wx) {
            // 显示分享按钮
            wx.showShareMenu()

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
