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
            case 'plate-7':
                let seq7 = cc.sequence(cc.moveBy(0.2, 0, 20), cc.moveBy(0.2, 0, -20));
                this.node.runAction(cc.repeatForever(seq7));
                break; 
            case 'plate-6':
                let _width = Global.game.node.getChildByName('map').width / 2;
                let sqr6 = null;
                if (this.node.x > _width) {
                    sqr6 = cc.sequence(cc.moveBy(1, -_width, 0), cc.moveBy(1, _width, 0));
                } else {
                    sqr6 = cc.sequence(cc.moveBy(1, _width, 0), cc.moveBy(1, -_width, 0));
                }
                // sqr6.easing(cc.easeExponentialOut());
                sqr6.easing(cc.easeInOut(3.0));
                
                this.node.runAction(cc.repeatForever(sqr6));
                break;
            case 'plate-5':
                let seq5 = cc.sequence(cc.rotateTo(0.1, 180), cc.rotateTo(0.1, 360));
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
        if (!this.node.space) {
            this.plateMove();
            this.creatRocket();
        }
        
    },

    start () {

    },

    // update (dt) {},
});
