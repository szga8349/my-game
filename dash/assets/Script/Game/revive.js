const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Node,
        },
        // 提示title
        titleLabel: {
            default: null,
            type: cc.Label,
        },
        // 宝石数量
        gemLabel: {
            default: null,
            type: cc.Label,
        },
        // 视频按钮文字
        videoLabel: {
            default: null,
            type: cc.Label,
        },
        // 提示条
        prompt: {
            default: null,
            type: cc.Prefab,
        },
        // 结算窗口
        overBox: {
            default: null,
            type: cc.Prefab,
        }
    },

    hide(callBack) {
        let action = cc.spawn(cc.scaleTo(0.4, 0), cc.rotateBy(0.4, -360));
        action.easing(cc.easeExponentialOut(3.0));
        this.content.runAction(cc.sequence(action, cc.callFunc(() => {
            if (callBack) callBack();
        })));
    },

    show(callBack) {
        let action = cc.spawn(cc.scaleTo(0.4, 1), cc.rotateBy(0.4, 360));
        action.easing(cc.easeExponentialOut(3.0));
        this.content.runAction(cc.sequence(action, cc.callFunc(() => {
            if (callBack) callBack();
        })));
    },

    // 更新视图
    upDataUi() {
        if (this.state) {
            this.gemLabel.string = 200;
            this.videoLabel.string = '飞呀';
            this.titleLabel.string = '最后一次飞跃？';
            this.show();
            this.content.getChildByName('text').active = true;
        } 
    },

    // 提示
    showPrompt(str) {
        let promptIns = cc.instantiate(this.prompt)
        promptIns.y = -(this.node.height / 2 - promptIns.height / 2);
        promptIns.parent = this.node;
        cc.find('text', promptIns).getComponent(cc.Label).string = str;
        promptIns.runAction(cc.sequence(cc.moveBy(0.2, 0, 150), cc.moveBy(0.8, 0, 0), cc.callFunc(() => {
            promptIns.runAction(cc.sequence(cc.spawn(cc.moveBy(0.2, 0, 150), cc.fadeOut(0.2)), cc.callFunc(() => {
                promptIns.destroy();
            })))
        })));
    },

    // 关闭按钮
    btnClose() {
        this.hide(() => {
            let overBox = cc.instantiate(this.overBox);
            overBox.parent = Global.game.node;
            overBox.zIndex = 10;
            this.node.destroy();
        });
    },

    // 使用宝石按钮
    btnGem() {
        if (this.state) {
            if (Global.userData.gem > 200) {
                this.hide(() => {
                    this.state = true;
                    Global.userData.gem -= 200;
                    Global.game.gemBox.getChildByName('num').getComponent(cc.Label).string = Global.userData.gem;
                    // 死亡冲刺
                    Global.game.dieFly();
                });
            } else {
                this.showPrompt('宝石不足，冲刺失败~');
            }
        } else {
            if (Global.userData.gem > 100) {
                this.hide(() => {
                    this.state = true;
                    Global.userData.gem -= 100;
                    Global.game.gemBox.getChildByName('num').getComponent(cc.Label).string = Global.userData.gem;
                    Global.game.reviveGame();
                    if (!Global.musicInfo.state) {
                        cc.audioEngine.resumeMusic();
                    }
                });
            } else {
                this.showPrompt('宝石不足，复活失败~');
            }
        }
    },

    // 看视频按钮
    btnVideo() {
        if (this.state) {
            this.hide(() => {
                // 死亡冲刺
                Global.game.dieFly();
                // if (!Global.musicInfo.state) {
                //     cc.audioEngine.resumeMusic();
                // }
            });
            
        } else {
            this.hide(() => {
                this.state = true;
                Global.game.reviveGame();
                if (!Global.musicInfo.state) {
                    cc.audioEngine.resumeMusic();
                }
            });
        }
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 状态
        this.state = false;
        this.content.rotaion = -360;
        this.content.scale = 0;
        this.show();
    },

    // start () {},

    // update (dt) {},
});