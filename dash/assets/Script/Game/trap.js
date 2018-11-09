const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        // 盖子
        cap: {
            default: null,
            type: cc.Node,
        },
        // 海豹
        seals: {
            default: null,
            type: cc.Node,
        },
        // 尾巴
        tail: {
            default: null,
            type: cc.Node,
        },
    },

    // 出现尾巴
    showTail() {
        let action = cc.sequence(cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.2, 1, 1), cc.rotateTo(0.2, 30), cc.moveTo(0.2, 15, -36)), cc.moveBy(1, 0, 0), cc.callFunc(() => {
            this.hideTail();
        }));
        this.tail.runAction(action);
    },

    // 隐藏尾巴
    hideTail() {
        let action = cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2, 0, 0), cc.rotateTo(0.2, 0), cc.moveTo(0.2, 31, -32.7));
        this.tail.runAction(action);
    },

    // 出现海豹
    showSeals() {
        let action = cc.sequence(cc.spawn(cc.fadeIn(0.2), cc.scaleTo(0.2, 1, 1)), cc.moveBy(1, 0, 0), cc.callFunc(() => {
            this.hideSeals();
        }));
        this.seals.runAction(action);
    },

    // 隐藏海豹
    hideSeals() {
        let action = cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2, 1, 0));
        this.seals.runAction(action);
    },

    // 打开盖子
    openCap() {
        let action = cc.sequence(
            cc.spawn(cc.rotateTo(0.1, 95), cc.moveTo(0.1, 36, -12.8)),
            cc.callFunc(() => {
                if (this.state == 'seals') {
                    this.node.parent.trapData = 'seals';
                    this.showSeals();
                } else {
                    this.node.parent.trapData = 'tail';
                    this.showTail();
                }
            }), 
            cc.moveBy(1.4, 0, 0),
            cc.callFunc(() => {
                this.offCap();
            })
        );
        this.cap.runAction(action);
    },

    // 关闭盖子 这里重置属性
    offCap() {
        let action = cc.sequence(
            cc.spawn(cc.rotateTo(0.1, 0), cc.moveTo(0.1, 41.3, -12.8)),
            cc.callFunc(() => {
                this.node.parent.trapData = 'none';
            }),
            cc.moveBy(0.5, 0, 0),
            cc.callFunc(() => {
                if (this.state == 'seals') {
                    this.state = 'tail';
                } else {
                    this.state = 'seals';
                }
                this.shakeCap();
            }) 
        );
        this.cap.runAction(action);
        
    },

    // 抖动盖子
    shakeCap() {
        let action = cc.sequence(
            cc.rotateTo(0.1, 3), 
            cc.rotateTo(0.1, -3),
            cc.rotateTo(0.1, 3), 
            cc.rotateTo(0.1, -3),
            cc.rotateTo(0.1, 3), 
            cc.rotateTo(0.1, -3),
            cc.rotateTo(0.1, 3), 
            cc.rotateTo(0.1, -3),
            cc.rotateTo(0.1, 0),   
            cc.callFunc(() => {
                this.openCap();
        }));
        this.cap.runAction(action);
    },  

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.state = 'seals'; // 切换状态
        this.node.x = -3;
        this.node.y = 49.4;
        this.shakeCap();
    },

    // start () {},

    // update (dt) {},
});
