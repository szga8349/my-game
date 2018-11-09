const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        prop: {
            default: null,
            type: cc.Node,
        },
        gemImg: {
            default: null,
            type: cc.SpriteFrame,
        }
    },

    // 倒计时跌落地板
    countDownMove(x, y) {
        let action = cc.moveBy(0.5, 0, -1000);
        action.easing(cc.easeIn(3));
        this.node.runAction(cc.sequence(
            cc.moveBy(0.2, 10, -5),
            cc.moveBy(0.2, -10, 0),
            cc.moveBy(0.2, 12, 0),
            cc.moveBy(0.1, -12, 0),
            cc.moveBy(0.1, 15, -5),
            cc.moveBy(0.1, -15, 0),
            cc.callFunc(() => {
                // Global.game.playerSize.x 可以试着用这个参数去作为判定，或许player就可以加动画移动了
                if (Global.game.playerSize.x == x && Global.game.playerSize.y == y) {
                    Global.game.gameOver(3);
                } else {
                    Global.map.createSingle();
                }
                this.node.color = cc.hexToColor('#8c8c8c');
            }), action
        ));
    },

    // 初始化
    initFloor() {
        let floor = this.node;
        let data = this.node.floorData;
        this.node.stopAllActions();
        this.node.color = cc.hexToColor('#ffffff');

        floor.floorData.overMove = false;
        floor.floorData.countDown = 0;
        
        switch (data.type) {
            case 'base':
                floor.getComponent(cc.Sprite).spriteFrame = Global.gameInfo.images.base;
                break;
            case 'floor':
                floor.getComponent(cc.Sprite).spriteFrame = Global.gameInfo.images.floor;
                break;
        }

        // 是否第一格
        if (data.first) {
            floor.getComponent(cc.Sprite).spriteFrame = Global.gameInfo.images.start;
        }
        
        // 判断道具类型
        switch (data.prop) {
            case 'ice1':
                this.prop.getComponent(cc.Sprite).spriteFrame = Global.gameInfo.images.ice_1;
                break;
            case 'ice2':
                this.prop.getComponent(cc.Sprite).spriteFrame = Global.gameInfo.images.ice_2;
                break;
            case 'ice3':
                this.prop.getComponent(cc.Sprite).spriteFrame = Global.gameInfo.images.ice_3;
                break;
            case 'gem':
                this.prop.getComponent(cc.Sprite).spriteFrame = this.gemImg;
                break;
            case 'force':
                this.prop.getComponent(cc.Sprite).spriteFrame = Global.gameInfo.images.force;
                break;
            case 'reverse':
                this.prop.getComponent(cc.Sprite).spriteFrame = Global.gameInfo.images.reverse;
                break;
            case 'trap':
                this.prop.getComponent(cc.Sprite).spriteFrame = null;
                // console.log(this.node.floorData);
                
                let trap = cc.instantiate(Global.map.trap);
                if (this.node.floorData.d == 'left') {
                    trap.scaleX = -1;
                } 
                trap.parent = this.node;
                break;
            default:
                this.prop.getComponent(cc.Sprite).spriteFrame = null;
                break;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    update (dt) {
        if (this.node.floorData.countDown != 0 && !this.node.floorData.overMove && this.node.floorData.type == 'floor' && Global.gameInfo.state != 'over') {
            this.node.floorData.countDown -= 1;
            if (this.node.floorData.countDown == 0) {
                this.countDownMove(this.node.x, this.node.y);
            }
        }
    },

});
