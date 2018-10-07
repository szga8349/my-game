"use strict";
cc._RF.push(module, '7314785p89CdbuOywTQapVc', 'Sign');
// Script/Home/Sign.js

'use strict';

var Global = require('Global');
var utils = require('utils');

cc.Class({
    extends: cc.Component,

    properties: {
        content: {
            default: null,
            type: cc.Node
        }
    },

    eachCheck: function eachCheck() {
        var btns = this.content.children;
        var day = Global.userInfo.signDay - 1;
        // console.log(btns.length, day);

        for (var i = 0; i < btns.length; i++) {
            if (day > i) {
                btns[i].getChildByName('sign_day').color = cc.hexToColor('#E9DCC9');
                btns[i].getChildByName('btn').color = cc.hexToColor('#E9DCC9');
                cc.find('btn/text', btns[i]).getComponent(cc.Label).string = '已领取';
            }
            if (day < i) {
                btns[i].getChildByName('btn').color = cc.hexToColor('#E9DCC9');
                cc.find('btn/text', btns[i]).getComponent(cc.Label).string = '待领取';
            }
        }
    },
    signBtn: function signBtn(e, num) {
        switch (Number(num)) {
            case 1:
                if (Global.userInfo.signDay == num) {
                    Global.userInfo.signDay += 1;
                    Global.userInfo.money += 1000;
                    utils.showToast('领取成功', 'success');
                    Global.home.updateUserInfo();
                    Global.userInfo.signDate = utils.timeFormat();
                    Global.saveData();
                    this.node.destroy();
                } else {
                    utils.showToast('已经领取过了');
                }
                break;
            case 2:
                if (Global.userInfo.signDay == num) {
                    Global.userInfo.signDay += 1;
                    Global.userInfo.money += 2000;
                    utils.showToast('领取成功', 'success');
                    Global.home.updateUserInfo();
                    Global.userInfo.signDate = utils.timeFormat();
                    Global.saveData();
                    this.node.destroy();
                } else {
                    if (Global.userInfo.signDay > num) {
                        utils.showToast('已经领取过了');
                    } else {
                        utils.showToast('还没到领取日期');
                    }
                }
                break;
            case 3:
                if (Global.userInfo.signDay == num) {
                    Global.userInfo.signDay += 1;
                    Global.userInfo.money += 3000;
                    utils.showToast('领取成功', 'success');
                    Global.home.updateUserInfo();
                    Global.userInfo.signDate = utils.timeFormat();
                    Global.saveData();
                    this.node.destroy();
                } else {
                    if (Global.userInfo.signDay > num) {
                        utils.showToast('已经领取过了');
                    } else {
                        utils.showToast('还没到领取日期');
                    }
                }
                break;
            case 4:
                if (Global.userInfo.signDay == num) {
                    Global.userInfo.signDay += 1;
                    Global.userInfo.money += 5000;
                    utils.showToast('领取成功', 'success');
                    Global.home.updateUserInfo();
                    Global.userInfo.signDate = utils.timeFormat();
                    Global.saveData();
                    this.node.destroy();
                } else {
                    if (Global.userInfo.signDay > num) {
                        utils.showToast('已经领取过了');
                    } else {
                        utils.showToast('还没到领取日期');
                    }
                }
                break;
            case 5:
                if (Global.userInfo.signDay == num) {
                    Global.userInfo.signDay += 1;
                    Global.userInfo.dash += 5;
                    utils.showToast('领取成功', 'success');
                    Global.home.updateUserInfo();
                    Global.userInfo.signDate = utils.timeFormat();
                    Global.saveData();
                    this.node.destroy();
                } else {
                    if (Global.userInfo.signDay > num) {
                        utils.showToast('已经领取过了');
                    } else {
                        utils.showToast('还没到领取日期');
                    }
                }
                break;
            case 6:
                if (Global.userInfo.signDay == num) {
                    Global.userInfo.signDay += 1;
                    Global.userInfo.fanatical += 5;
                    utils.showToast('领取成功', 'success');
                    Global.home.updateUserInfo();
                    Global.userInfo.signDate = utils.timeFormat();
                    Global.saveData();
                    this.node.destroy();
                } else {
                    if (Global.userInfo.signDay > num) {
                        utils.showToast('已经领取过了');
                    } else {
                        utils.showToast('还没到领取日期');
                    }
                }
                break;
            case 7:
                if (Global.userInfo.signDay == num) {
                    Global.userInfo.signDay = 1; // 轮回
                    Global.userInfo.boom += 5;
                    utils.showToast('领取成功', 'success');
                    Global.home.updateUserInfo();
                    Global.userInfo.signDate = utils.timeFormat();
                    Global.saveData();
                    this.node.destroy();
                } else {
                    utils.showToast('还没到领取日期');
                }
                break;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.eachCheck();
    }
}

// start () {},

// update (dt) {},
);

cc._RF.pop();