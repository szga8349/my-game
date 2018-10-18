const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        // 提示文字
        tipNode: {
            default: null,
            type: cc.Node
        },
        // 盒子资源
        boxPrefab: {
            default: null,
            type: cc.Prefab
        }
    },
    tipSwitch(str, show = false) {
        let _w = this.node.width / 2;
        this.tipNode.stopAllActions();
        cc.find('text', this.tipNode).getComponent(cc.Label).string = str;
        let action = null;
        if (show) {
            action = cc.moveTo(0.2, _w - this.tipNode.width, this.tipNode.y);
            action.easing(cc.easeExponentialInOut());
            this.scheduleOnce(() => {
                this.stopClick = false;
            }, 0.2);
        } else {
            action = cc.moveTo(0.1, _w, this.tipNode.y);
            this.step += 1;
            if (this.step == 6) {
                Global.game.creatBox('trap');
                this.scheduleOnce(() => {
                    this.tipSwitch('注意不要切中炸弹！', true);
                    this.scheduleOnce(() => {
                        this.tipSwitch('~');
                        this.scheduleOnce(() => {
                            this.tipSwitch('准备正式开始', true);
                            this.scheduleOnce(() => {
                                Global.game.startReady();
                                Global.game.pauseBtn.active = true;
                                this.node.destroy();
                            }, 2);
                        }, 0.5);
                    }, 2);
                }, 0.3);
            } else if (this.step < 6) {
                this.creatBox();
            }
        }
        this.tipNode.runAction(action);
    },

    // 步骤
    stepRun() {
        if (this.stopClick) return;
        this.stopClick = true;
        this.click = true;
        Global.game.lineTop.color = Global.game.lineCenter.color = Global.game.lineBottom.color = cc.hexToColor('#ff0001');
        this.scheduleOnce(() => {
            Global.game.lineTop.color = Global.game.lineCenter.color = Global.game.lineBottom.color = cc.hexToColor('#ffffff');
            this.click = false;
        }, 0.1);  
    },

    creatBox() {
        let box = cc.instantiate(this.boxPrefab);
        box.parent = this.node;
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.tutorial = this;
        this.stopClick = true;
        this.step = 1;
        this.click = false;
        
        this.creatBox();
    },

    // start () {},

    // update (dt) {},
});
