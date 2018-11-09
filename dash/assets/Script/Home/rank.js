const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Node,
        }
    },

    openShare() {

    },

    closeBtn() {
        this.node.active = false;
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    // update (dt) {},
});
