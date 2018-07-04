"use strict";
cc._RF.push(module, '176f3H41mpDmbBb+8Ug+/U8', 'rank');
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