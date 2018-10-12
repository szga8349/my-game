"use strict";
cc._RF.push(module, '50d8cxmSPBDa7BUwSDGJ+8r', 'Game_over');
// Script/Game/Game_over.js

'use strict';

var Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        // 复活音效
        audioRevive: {
            default: null,
            type: cc.AudioClip
        }
    },
    openRank: function openRank() {
        Global.restData();
        cc.director.loadScene('Rank');
    },
    openShare: function openShare() {
        wx.shareAppMessage({
            title: Global.shareInfo.title,
            imageUrl: Global.shareInfo.url
        });
    },

    // 再来一次
    playAgain: function playAgain() {
        Global.restData();
        cc.director.loadScene('Home');
    },

    // 复活游戏
    reviveGame: function reviveGame() {
        cc.audioEngine.play(this.audioRevive, false);
        this.node.destroy();
        var seq = cc.sequence(cc.moveBy(0.5, 0, 350), cc.callFunc(function () {
            Global.game.ball.getChildByName('bone').getComponent(dragonBones.ArmatureDisplay).playAnimation('rock', 0);
            Global.game.ball.getChildByName('particle').getComponent(cc.ParticleSystem).resetSystem();
            Global.game.balljs.restData();
            Global.gameInfo.speed = Global.gameInfo.speedFixed;
            Global.game.balljs.bounce = 0;
            Global.gameInfo.state = 'running';
            Global.playBgm = true;
            cc.audioEngine.playMusic(Global.game.audioBgm, true);
            Global.game.revived = true;
        }));
        Global.game.ball.runAction(seq);
    }
}
// LIFE-CYCLE CALLBACKS:

// onLoad () {},

// start () {

// },

// update (dt) {},
);

cc._RF.pop();