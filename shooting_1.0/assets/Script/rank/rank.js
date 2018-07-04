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

    // onLoad () {},

    start () {
        this.scoreText.string = '历史最高得分：' + Global.gameData.score
    },

    // update (dt) {},
});
