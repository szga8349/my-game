
const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        // 复活音效
        audioRevive: {
            default: null,
            type: cc.AudioClip
        },
    },
    openRank() {
        Global.restData();
        cc.director.loadScene('Rank');
    },
    openShare() {
        wx.shareAppMessage({
            title: Global.shareInfo.title,
            imageUrl: Global.shareInfo.url
        });
    },
    // 再来一次
    playAgain() {
        Global.restData();
        cc.director.loadScene('Home');
    },
    // 复活游戏
    reviveGame() {
        cc.audioEngine.play(this.audioRevive, false);
        this.node.destroy();
        let seq = cc.sequence(cc.moveBy(0.5, 0, 350), cc.callFunc(() => {
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
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {

    // },

    // update (dt) {},
});
