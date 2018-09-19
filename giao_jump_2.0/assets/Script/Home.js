

cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },
    },
    testMove() {
        let finished = cc.callFunc(() => {
            console.log('完成');
            // this.player.scale = 0.2;
        }, this);
        let upMove = cc.moveBy(2, 0, 800);
        // upMove.easing(cc.easeExponentialOut());
        // upMove.easing(cc.easeElasticInOut(3.0));

        upMove.easing(cc.easeExponentialOut());

        let downMove = cc.moveBy(2, 0, -800);
        // downMove.easing(cc.easeExponentialOut());

        let seq = cc.sequence(upMove, finished, downMove)
        this.player.runAction(seq);
    },
    restMove() {
        let downMove = cc.moveBy(2, 0, -800);
        downMove.easing(cc.easeExponentialOut());
        // downMove.easing(cc.easeElasticOut(3.0));

        this.player.runAction(downMove);
    },
    openGame() {
        cc.director.loadScene('Game');
    },
    openRank() {
        cc.director.loadScene('Rank');
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.preloadScene('Game', () => console.log('预加载游戏场景成功'));
    },

    start () {

    },

    // update (dt) {},
});
