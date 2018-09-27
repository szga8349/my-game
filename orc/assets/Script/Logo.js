

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.preloadScene('Home', () => console.log('预加载游戏场景成功'));
        this.scheduleOnce(() => {
            cc.director.loadScene('Home');
        }, 2);
    },

    start () {

    },

    // update (dt) {},
});
