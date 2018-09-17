const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    backGame() {
        cc.director.loadScene('Game');
    },
    backHome() {
        cc.director.loadScene('Home');
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {

    },

    // update (dt) {},
});
