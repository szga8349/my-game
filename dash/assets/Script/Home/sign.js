const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Node
        },
        // 提示条
        prompt: {
            default: null,
            type: cc.Prefab,
        },
    },

    closeBtn() {
        this.node.active = false;
        // 保存一下数据
        Global.saveData();
    },

    //提示条
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

    //设置签到显示
    getSignAward() {
        let arr = this.content.children;
        let i = Global.userData.signDay;
        if (i < 7) {
            if (i == 0) {
                let white_bg = arr[i].getChildByName('white_bg');
                let sign_tag = arr[i].getChildByName('sign_tag');
                white_bg.opacity = 155;
                sign_tag.opacity = 255;
                Global.userData.signDay += 1;
                Global.userData.signTime = Global.timeFormat();
                // console.log('Global.userData.signTime:' + Global.userData.signTime);
            } else {
                //如果间隔超过24小时或者进入到当天凌晨
                if (Global.userData.signTime != Global.timeFormat()) {
                    for (let temp = 0; temp <= i; temp++) {
                        let white_bg = arr[temp].getChildByName('white_bg');
                        let sign_tag = arr[temp].getChildByName('sign_tag');
                        white_bg.opacity = 155;
                        sign_tag.opacity = 255;
                    }
                    Global.userData.signDay += 1;
                    Global.userData.signTime = Global.timeFormat();
                }
            }
        }
        switch (Global.userData.signDay) {
            case 1:
                this.showPrompt('已领取第' + Global.userData.signDay + '日签到奖励！宝石+ 10');
                Global.userData.gem += 10;
                break;
            case 2:
                this.showPrompt('已领取第' + Global.userData.signDay + '日签到奖励！公主皮肤~');
                Global.userData.skinList.push(2);
                break;
            case 3:
                this.showPrompt('已领取第' + Global.userData.signDay + '日签到奖励！宝石+ 20');
                Global.userData.gem += 20;
                break;
            case 4:
                this.showPrompt('已领取第' + Global.userData.signDay + '日签到奖励！宝石+ 50');
                Global.userData.gem += 50;
                break;
            case 5:
                this.showPrompt('已领取第' + Global.userData.signDay + '日签到奖励！宝石+ 100');
                Global.userData.gem += 100;
                break;
            case 6:
                this.showPrompt('已领取第' + Global.userData.signDay + '日签到奖励！宝石+ 300');
                Global.userData.gem += 300;
                break;
            case 7:
                this.showPrompt('已领取第' + Global.userData.signDay + '日签到奖励！宝石+ 1000');
                Global.userData.gem += 1000;
                break;
        }
        this.setSignAwardBtn();
    },

    //设置登陆领取图标状态
    setSignAwardBtn() {
        let arr = this.content.children;
        let num = Global.userData.signDay;
        let disable = this.node.getChildByName('btn_rank_disable');
        let relive = this.node.getChildByName('btn_relive');
        if (num != 0) {
            for (let temp = 0; temp < num; temp++) {
                let white_bg = arr[temp].getChildByName('white_bg');
                let sign_tag = arr[temp].getChildByName('sign_tag');
                white_bg.opacity = 155;
                sign_tag.opacity = 255;
            }
        }
        if (Global.userData.signDay < 7) {
            if (Global.userData.signDay == 0 || Global.userData.signTime != Global.timeFormat()) {
                disable.active = false;
                relive.active = true;
            }
            else {
                disable.active = true;
                relive.active = false;
            }
        } else {
            disable.active = false;
            relive.active = false;
        }
    },

    onLoad() {
        this.setSignAwardBtn();
    },

});
