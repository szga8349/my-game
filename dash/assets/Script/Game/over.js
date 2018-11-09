const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Node,
        },
        // 本局分数
        score: {
            default: null,
            type: cc.Label,
        },
        // 历史最高
        maxScore: {
            default: null,
            type: cc.Label,
        },
        // 本局获取宝石数量
        gem: {
            default: null,
            type: cc.Label,
        },
        // 钻石加成
        moreGem: {
            default: null,
            type: cc.Label,
        }
    },

    show(callBack) {
        let action = cc.spawn(cc.scaleTo(0.4, 1), cc.rotateBy(0.4, 360));
        action.easing(cc.easeExponentialOut(3.0));
        this.content.runAction(cc.sequence(action, cc.callFunc(() => {
            if (callBack) callBack();
        })));
    },

    // 返回首页按钮
    backHome() {
        if (!Global.musicInfo.state) {
            cc.audioEngine.resumeMusic();
        }
        Global.restData();
        cc.director.loadScene('Home');
    },

    // 再玩一次
    playAgain() {
        if (!Global.musicInfo.state) {
            cc.audioEngine.resumeMusic();
        }
        Global.restData();
        cc.director.loadScene('Game');
    },

    // 分享
    openShare() {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 判断是否钻石加成
        if (Global.game.moreGem) {
            this.moreGem.node.active = true;
            let num = parseInt(Global.game.gemNum / 6);
            Global.userData.gem += num;
            this.moreGem.string = '皮肤奖励：+' + num;
            Global.game.gemBox.getChildByName('num').getComponent(cc.Label).string = Global.userData.gem;
        }
        this.score.string = Global.gameInfo.score;
        this.maxScore.string = Global.userData.maxScore;
        this.gem.string = Global.game.gemNum;

        this.content.rotaion = -360;
        this.content.scale = 0;
        this.show();

        // 保存下数据
        Global.saveData();
    },

    // start () {},

    // update (dt) {},
});