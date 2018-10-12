"use strict";
cc._RF.push(module, '560e1WzOONLApGuKHuPx+nh', 'Shop');
// Script/Home/Shop.js

'use strict';

var Global = require('Global');
var utils = require('utils');

cc.Class({
    extends: cc.Component,

    properties: {},
    closeShop: function closeShop() {
        Global.home.switchShop(null, null);
    },

    // 商店购买按钮
    shopBtn: function shopBtn(e, num) {
        switch (Number(num)) {
            case 1:
                if (Global.userInfo.money >= 300) {
                    Global.userInfo.money -= 300;
                    Global.userInfo.dash += 1;
                    Global.home.updateUserInfo();
                    Global.saveData();
                    utils.showToast('购买成功~', 'success');
                } else {
                    utils.showToast('金币不足，购买失败');
                }
                break;
            case 2:
                if (Global.userInfo.money >= 600) {
                    Global.userInfo.money -= 600;
                    Global.userInfo.boom += 1;
                    Global.home.updateUserInfo();
                    Global.saveData();
                    utils.showToast('购买成功~', 'success');
                } else {
                    utils.showToast('金币不足，购买失败');
                }
                break;
            case 3:
                if (Global.userInfo.money >= 1000) {
                    Global.userInfo.money -= 1000;
                    Global.userInfo.fanatical += 1;
                    Global.home.updateUserInfo();
                    Global.saveData();
                    utils.showToast('购买成功~', 'success');
                } else {
                    utils.showToast('金币不足，购买失败');
                }
                break;
            default:
                utils.showToast('暂时无法购买，敬请期待~');
                break;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();