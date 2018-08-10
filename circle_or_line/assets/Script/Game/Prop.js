const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    onCollisionEnter(other, self) {
        self.node.destroy();
        Global.game.sendScore();
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
