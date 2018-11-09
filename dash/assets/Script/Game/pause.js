const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        onBtn: {
            default: null,
            type: cc.Node,
        },
        offBtn: {
            default: null,
            type: cc.Node,
        }
    },

    // 再玩一次
    playAgain() {
        cc.director.resume();
        Global.restData();
        cc.director.loadScene('Game');
    },

    // 返回首页按钮
    backHome() {
        cc.director.resume();
        Global.restData();
        cc.director.loadScene('Home');
    },

    // 返回首页按钮
    closeBtn() {
        cc.director.resume();
        this.node.destroy();
    },

    musicSwitch(e, type) {
        if (type == 'on') {
            Global.musicInfo.state = true;
            cc.audioEngine.pauseMusic();

            this.onBtn.active = false;
            this.offBtn.active = true;
        } else {
            Global.musicInfo.state = false;
            cc.audioEngine.resumeMusic();

            this.onBtn.active = true;
            this.offBtn.active = false;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.zIndex = 10;
        if (Global.musicInfo.state) {
            this.onBtn.active = false;
            this.offBtn.active = true;
        } else {
            this.onBtn.active = true;
            this.offBtn.active = false;
        }
    },

    // start () {},

    // update (dt) {},
});
