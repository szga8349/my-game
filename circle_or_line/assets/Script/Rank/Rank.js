const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 得分
        scoreLabel: {
            default: null,
            type: cc.Label
        },
    },
    againGame() {
        cc.director.loadScene('Game');
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.scoreLabel.string = '得分：' + Global.gameInfo.score;
    },

    // update (dt) {},
});
