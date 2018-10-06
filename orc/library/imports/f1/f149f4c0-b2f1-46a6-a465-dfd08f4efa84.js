"use strict";
cc._RF.push(module, 'f149fTAsvFGpqRl39CPTvqE', 'Home');
// Script/Home/Home.js

'use strict';

var Global = require('Global');
var utils = require('utils');

cc.Class({
    extends: cc.Component,

    properties: {
        // 金币
        moneyLabel: {
            default: null,
            type: cc.Label
        },
        // 技能选择
        skilBox: {
            default: null,
            type: cc.Node
        },
        // 说明
        explain: {
            default: null,
            type: cc.Node
        },
        // 商店
        shopBox: {
            default: null,
            type: cc.Prefab
        },
        // 签到资源
        signInBox: {
            default: null,
            type: cc.Prefab
        },
        // bgm
        audioBgm: {
            default: null,
            type: cc.AudioClip
        }
    },
    // 检查是否可以签到
    checkSign: function checkSign() {
        var now = utils.timeFormat().split(' ')[0];
        var last = Global.userInfo.signDate.split(' ')[0];
        // console.log(now, last);
        if (now != last) {
            var box = cc.instantiate(this.signInBox);
            box.y = box.x = 0;
            box.parent = this.node;
        }
    },

    // 技能按钮
    skilBtn: function skilBtn(e, num) {
        switch (Number(num)) {
            case 1:
                if (Global.userInfo.dash == 0) {
                    this.switchSkillBox();
                    this.switchShop(null, 'show');
                } else {
                    Global.userInfo.dash -= 1;
                    Global.gameInfo.startDash = 3;
                    Global.saveData();
                    cc.director.loadScene('Game');
                }
                break;
            case 2:
                if (Global.userInfo.boom == 0) {
                    this.switchSkillBox();
                    this.switchShop(null, 'show');
                } else {
                    Global.userInfo.boom -= 1;
                    Global.saveData();
                    Global.gameInfo.orcBoom = 3;
                    cc.director.loadScene('Game');
                }
                break;
            case 3:
                if (Global.userInfo.fanatical == 0) {
                    this.switchSkillBox();
                    this.switchShop(null, 'show');
                } else {
                    Global.userInfo.fanatical -= 1;
                    Global.saveData();
                    Global.gameInfo.crazy = 2;
                    cc.director.loadScene('Game');
                }
                break;
        }
    },

    // 技能选择切换
    switchSkillBox: function switchSkillBox(e) {
        var _this = this;

        var show = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (this.skillMove) return;
        this.skillMove = true;
        var action = null;
        if (show) {
            action = cc.moveTo(0.5, 0, 0);
        } else {
            action = cc.moveTo(0.5, 0, -this.node.height);
        }
        action.easing(cc.easeExponentialOut(3.0));
        var seq = cc.sequence(action, cc.callFunc(function () {
            _this.skillMove = false;
        }));
        this.skilBox.runAction(seq);
    },

    // 商店切换
    switchShop: function switchShop(e) {
        var _this2 = this;

        var show = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (this.shopMove) return;
        this.shopMove = true;
        var action = null;
        if (show) {
            action = cc.moveTo(0.5, 0, 0);
        } else {
            action = cc.moveTo(0.5, 0, this.node.height);
        }
        action.easing(cc.easeExponentialOut(3.0));
        var seq = cc.sequence(action, cc.callFunc(function () {
            _this2.shopMove = false;
        }));
        this.shop.runAction(seq);
    },

    // 说明切换
    switchExplain: function switchExplain(e) {
        var _this3 = this;

        var show = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (this.explainMove) return;
        this.explainMove = true;
        var action = null;
        var seq = null;
        if (show) {
            action = cc.moveTo(0.5, 0, 0);
            action.easing(cc.easeExponentialOut(3.0));
        } else {
            action = cc.moveTo(0.5, -this.node.width, 0);
            action.easing(cc.easeExponentialOut(3.0));
        }
        seq = cc.sequence(action, cc.callFunc(function () {
            _this3.explainMove = false;
        }));
        this.explain.runAction(seq);
    },

    // 更新用户数据
    updateUserInfo: function updateUserInfo() {
        // 修改金币
        this.moneyLabel.string = Global.userInfo.money;
        cc.find('money/text', this.shop).getComponent(cc.Label).string = Global.userInfo.money;

        cc.find('skill-1/content', this.skilBox).getComponent(cc.Label).string = '高能陨石 ×' + Global.userInfo.dash;
        cc.find('skill-2/content', this.skilBox).getComponent(cc.Label).string = '炸弹多多 ×' + Global.userInfo.boom;
        cc.find('skill-3/content', this.skilBox).getComponent(cc.Label).string = '兽人狂暴 ×' + Global.userInfo.fanatical;

        if (Global.userInfo.dash == 0) {
            cc.find('skill-1/btn/text', this.skilBox).getComponent(cc.Label).string = '去购买';
        } else {
            cc.find('skill-1/btn/text', this.skilBox).getComponent(cc.Label).string = '使用';
        }
        if (Global.userInfo.boom == 0) {
            cc.find('skill-2/btn/text', this.skilBox).getComponent(cc.Label).string = '去购买';
        } else {
            cc.find('skill-2/btn/text', this.skilBox).getComponent(cc.Label).string = '使用';
        }

        if (Global.userInfo.fanatical == 0) {
            cc.find('skill-3/btn/text', this.skilBox).getComponent(cc.Label).string = '去购买';
        } else {
            cc.find('skill-3/btn/text', this.skilBox).getComponent(cc.Label).string = '使用';
        }
    },
    openGame: function openGame() {
        Global.playBgm = true;
        cc.director.loadScene('Game');
    },
    openRank: function openRank() {
        Global.playBgm = true;
        cc.director.loadScene('Rank');
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        Global.home = this;
        // 获取本地数据
        if (Global.fetchData()) Global.userInfo = Global.fetchData();

        // 输出商店
        this.shop = cc.instantiate(this.shopBox);
        this.shop.parent = this.node;

        // 重置位置
        this.shop.y = this.node.height;
        this.skilBox.y = -this.node.height;
        this.explain.width = this.node.width;
        this.explain.height = this.node.height;
        this.explain.x = -this.node.width;

        // 更新数据
        this.updateUserInfo();

        // 检测签到
        this.checkSign();

        cc.director.preloadScene('Game', function () {
            return console.log('预加载游戏场景成功');
        });
        // 背景音乐
        if (!Global.playBgm) {
            cc.audioEngine.playMusic(this.audioBgm, true);
        }
    },
    start: function start() {
        if (window.wx) {
            // 检测用户是否授权过
            wx.getUserInfo({
                success: function success(res) {
                    console.log('用户授权信息====>', res);
                },
                fail: function fail() {
                    var _w = wx.getSystemInfoSync().windowWidth,
                        _h = wx.getSystemInfoSync().windowHeight;
                    console.warn('创建获取用户信息按钮');
                    // 创建获取用户信息按钮
                    var loginBtn = wx.createUserInfoButton({
                        type: 'text',
                        text: '',
                        style: {
                            left: 0,
                            top: 0,
                            width: _w,
                            height: _h,
                            lineHeight: _h,
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            color: 'rgba(0, 0, 0, 0)',
                            textAlign: 'center',
                            fontSize: 16,
                            borderRadius: 4
                        }
                    });
                    // 监听点击事件
                    loginBtn.onTap(function (res) {
                        console.log('用户授权数据：', res);
                        if (res.errMsg != 'getUserInfo:ok') return;
                        loginBtn.destroy();
                    });
                }
            });
            // 显示分享按钮
            wx.showShareMenu();
            // 设置转发分内容
            wx.onShareAppMessage(function (res) {
                return {
                    title: Global.shareInfo.title,
                    imageUrl: Global.shareInfo.url
                };
            });
        }
    }
}

// update (dt) {},
);

cc._RF.pop();