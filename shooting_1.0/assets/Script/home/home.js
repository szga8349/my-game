const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    openGame() {
        cc.director.loadScene('game');
    },
    openRank() {
        cc.director.loadScene('rank');
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.preloadScene('game', () => console.log('预加载游戏场景成功'));
    },

    start () {
        
    },

    // update (dt) {},
});
