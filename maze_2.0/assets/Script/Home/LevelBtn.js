const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    // 关卡按钮点击
    btnClick(e) {
        // console.log(e.target.dataNum);
        if (Global.gameInfo.saveLevel < e.target.dataNum) {
            // console.log(`需要玩过第：${e.target.dataNum} 关解锁`);
            Global.home.bar.getChildByName('text').getComponent(cc.Label).string = `需要玩过第：${e.target.dataNum} 关解锁`;
            if (Global.home.isClick) return;
            Global.home.isClick = true;
            let h = Global.home.bar.height;
            let show = cc.moveBy(0.3, cc.p(0, -h));
            Global.home.bar.runAction(show);
            if (Global.home.timer) clearTimeout(Global.home.timer);
            Global.home.timer = setTimeout(() => {
                // cc.log('执行');
                let hide = cc.moveBy(0.3, cc.p(0, h));
                Global.home.bar.runAction(hide);
                Global.home.isClick = false;
            }, 3000);
            // console.log('定时器：', Global.home.timer);
        } else {
            Global.gameInfo.level = e.target.dataNum;
            cc.director.loadScene('Game');
            if (Global.home.timer) clearTimeout(Global.home.timer);
        } 
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
