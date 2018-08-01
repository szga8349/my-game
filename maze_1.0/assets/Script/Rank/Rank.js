const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {

    },
    openGame() {
        cc.director.loadScene('Game');
    },
    openHome() {
        cc.director.loadScene('Home');
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});