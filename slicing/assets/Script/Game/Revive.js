const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    backHome() {
        Global.restData();
        cc.director.loadScene('Home');
    },

    reviveBtn() {
        let hide = cc.fadeOut(0.1);
        hide.easing(cc.easeExponentialInOut());
        Global.game.warning.runAction(hide);

        // 重置数据
        Global.game.gameState = 'revive';
        Global.gameInfo.hit = 0;
        Global.gameInfo.speed = 1;
        Global.gameInfo.hp = 3;
        Global.gameInfo.triple = false;
        Global.game.updateHp();

        let action = cc.sequence(cc.moveTo(0.5, 0, Global.game.node.heigth / 2 + 100), cc.callFunc(() => {
            Global.game.pauseBtn.active = true;
            Global.gameInfo.state = 'none';
            Global.game.startReady();
            cc.find('bg', Global.game.node).runAction(cc.tintTo(0.5, 43, 183, 244));
            this.node.destroy();
        }));
        this.node.runAction(action);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let action = cc.moveTo(0.5, 0, 0);
        action.easing(cc.easeExponentialInOut());
        this.node.runAction(action);
    },

    start () {

    },

    // update (dt) {},
});
