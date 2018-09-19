const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    onCollisionEnter(other, self) {
        console.log(other.node.name);
        if (other.node.name == 'rocket') {
            other.node.destroy();
            Global.space.checkProgress(1);
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
