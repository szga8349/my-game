const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        gemLabel: {
            default: null,
            type: cc.Label,
        },
        content: {
            default: null,
            type: cc.Node,
        },
        selectNode: {
            default: null,
            type: cc.Node,
        },
        prompt: {
            default: null,
            type: cc.Prefab,
        }
    },

    closeBtn() {
        this.node.active = false;
        // 保存一下数据
        Global.saveData();
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

    // 选择按钮
    selectBtn(e, num) {
        if (Global.userData.skin == Number(num)) return this.showPrompt('皮肤已经装备上啦~');
        switch (Number(num)) {
            case 0:
                Global.userData.skin = Number(num);
                this.updataUi();
                break;
            case 1:
                if (Global.userData.skinList.some(item => item == 1)) {
                    Global.userData.skin = Number(num);
                    this.updataUi();
                } else {
                    if (Global.userData.gem >= 4000) {
                        Global.userData.gem -= 4000;
                        Global.userData.skin = 1;
                        Global.userData.skinList.push(1);
                        this.updataUi();
                    } else {
                        this.showPrompt('宝石不足，购买失败~');
                    }
                }
                break;
            case 2:
                if (Global.userData.skinList.some(item => item == 2)) {
                    Global.userData.skin = Number(num);
                    this.updataUi();
                } else {
                    this.showPrompt('请第二天签到获得此皮肤~');
                }
                break;
            case 3:
                if (Global.userData.skinList.some(item => item == 3)) {
                    Global.userData.skin = Number(num);
                    this.updataUi();
                } else {
                    if (Global.userData.gem >= 6000) {
                        Global.userData.gem -= 6000;
                        Global.userData.skin = 3;
                        Global.userData.skinList.push(3);
                        this.updataUi();
                    } else {
                        this.showPrompt('宝石不足，购买失败~');
                    }
                }
                break;
            case 4:
                if (Global.userData.skinList.some(item => item == 4)) {
                    Global.userData.skin = Number(num);
                    this.updataUi();
                } else {
                    if (Global.userData.gem >= 8000) {
                        Global.userData.gem -= 8000;
                        Global.userData.skin = 4;
                        Global.userData.skinList.push(4);
                        this.updataUi();
                    } else {
                        this.showPrompt('宝石不足，购买失败~');
                    }
                }
                break;
        }
    },

    // 更新视图
    updataUi() {
        this.gemLabel.string = Global.userData.gem;
        for (let i = 0; i < this.items.length; i++) {
            // 先判断解锁
            if (Global.userData.skinList.some(item => item == i)) {
                this.items[i].getChildByName('on').active = true;
                this.items[i].getChildByName('off').active = false;
            } else {
                this.items[i].getChildByName('on').active = false;
                this.items[i].getChildByName('off').active = true;
            }
            // 再判断选中
            if (Global.userData.skin == i) {
                this.selectNode.stopAllActions();
                this.selectNode.runAction(cc.moveTo(0.2, this.items[i].x, this.items[i].y));
                cc.find('on/text', this.items[i]).getComponent(cc.Label).string = '使用中';
                cc.find('player', this.items[i]).getComponent(dragonBones.ArmatureDisplay).playAnimation('celebrate', 0);
                Global.home.skinSelect();
            } else {
                cc.find('on/text', this.items[i]).getComponent(cc.Label).string = '使用';
                cc.find('player', this.items[i]).getComponent(dragonBones.ArmatureDisplay).playAnimation('stand', 0);
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.items = this.content.children.filter(item => item.name == 'item');

        this.updataUi();
    },

    // start () {},

    // update (dt) {},
});
