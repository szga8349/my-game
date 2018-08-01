const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    // 关卡按钮点击
    btnClick(e) {
        console.log(e.target.dataNum);
        if (Global.gameInfo.saveLevel < e.target.dataNum) return console.log('需要玩前面一关');
        Global.gameInfo.level = e.target.dataNum;
        cc.director.loadScene('Game');
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
