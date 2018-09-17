const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        rocket: {
            default: null,
            type: cc.Prefab
        }
    },
    // 生成道具
    creatRocket() {
        let num = parseInt(5 * Math.random());
        if (num == 3) {
            let prop = cc.instantiate(this.rocket);
            prop.parent = this.node;
        }
    },
    // 
    plateMove() {
        switch (this.node.name) {
            case 'plate-lr':
                let _width = Global.game.node.getChildByName('map').width / 2;
                let sqr7 = null;
                if (this.node.x > _width) {
                    sqr7 = cc.sequence(cc.moveBy(1, -_width, 0), cc.moveBy(1, _width, 0));
                } else {
                    sqr7 = cc.sequence(cc.moveBy(1, _width, 0), cc.moveBy(1, -_width, 0));
                }
                // sqr7.easing(cc.easeExponentialOut());
                sqr7.easing(cc.easeInOut(3.0));
                
                this.node.runAction(cc.repeatForever(sqr7));
                break;
            case 'plate-one':
                let seq6 = cc.sequence(cc.moveBy(0.2, 0, 20), cc.moveBy(0.2, 0, -20));
                this.node.runAction(cc.repeatForever(seq6));
                break; 
            case 'plate-5':
                let seq5 = cc.sequence(cc.rotateTo(0.1, 20), cc.rotateTo(0.1, -20));
                this.node.runAction(cc.repeatForever(seq5));
                break;
            case 'plate-3':
                let seq3 = cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1, 0.8));
                seq3.easing(cc.easeSineInOut());
                this.node.runAction(cc.repeatForever(seq3));
                break;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.plateMove();
        this.creatRocket();
    },

    start () {

    },

    // update (dt) {},
});
