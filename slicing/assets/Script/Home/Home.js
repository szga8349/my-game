const Global = require('Global');
const utils = require('utils');

cc.Class({
    extends: cc.Component,

    properties: {
        maxScoreLabel: {
            default: null,
            type: cc.Label
        },
        // 签到界面
        signBox: {
            default: null,
            type: cc.Node
        },
        // 提示框
        prompt: {
            default: null,
            type: cc.Node
        },
        // 排行榜
        rankBox: {
            default: null,
            type: cc.Node
        }
    },

    // 排行榜显示切换
    rankSwitch(e, show) {
        if (show) {
            if (this.rankBox.active) return;
            this.rankBox.active = true;
            this.rankBox.runAction(cc.fadeIn(0.2));
        } else {
            if (!this.rankBox.active) return;
            let seq = cc.sequence(cc.fadeOut(0.2), cc.callFunc(() => {
                this.rankBox.active = false;
            }))
            this.rankBox.runAction(seq);
        }
    },

    // 提示框切换
    promptSwitch(e, hide, str, type) {
        if (hide) {
            let seq = cc.sequence(cc.fadeOut(0.2), cc.callFunc(() => {
                this.prompt.active = false;
            }))
            this.prompt.runAction(seq);
        } else {
            this.prompt.active = true;
            this.prompt.runAction(cc.fadeIn(0.2));
            this.prompt.getChildByName('text').getComponent(cc.Label).string = str;
            if (type) {
                this.prompt.getChildByName('icon').active = true;
                this.prompt.getChildByName('money').active = false;
                cc.loader.loadRes(type, cc.SpriteFrame, (err, res) => {
                    this.prompt.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = res;
                });
            } else {
                this.prompt.getChildByName('icon').active = false;
                this.prompt.getChildByName('money').active = true;
            }
        }
    },

    // 领取签到按钮
    receiveBtn() {
        if (this.signIn) {
            let str = '';
            let icon = null;
            switch (Global.userInfo.signDay) {
                case 1:
                    Global.userInfo.money += 30;
                    str = '30金币';
                    break;
                case 2:
                    Global.userInfo.money += 40;
                    str = '40金币';
                    break;
                case 3:
                    Global.userInfo.money += 50;
                    str = '50金币';
                    break;
                case 4:
                    Global.userInfo.money += 60;
                    str = '60金币';
                    break;
                case 5:
                    Global.userInfo.money += 90;
                    str = '90金币';
                    break;
                case 6:
                    Global.userInfo.money += 150;
                    str = '150金币';
                    break;
                case 7:
                    Global.userInfo.themeList.push('office-1');
                    str = '皮肤一个';
                    icon = 'office-1';
                    break;
            }
            // 当前动作停止
            let btn = cc.find('content', this.signBox).children[Global.userInfo.signDay - 1];
            btn.stopAllActions();
            btn.rotation = 0;
            
            Global.userInfo.signDate = utils.timeFormat();
            Global.userInfo.signDay += 1;
            // if (Global.userInfo.signDay > 7) Global.userInfo.signDay = 1; // 轮回
            
            // 这里做进度保存
            Global.saveData();

            this.signSwitch();
            this.promptSwitch(null, null, '成功领取' + str, icon);
            this.checkSign();
            // this.checkSignBtn();
        } else {
            if (Global.userInfo.signDay > 7) {
                utils.showToast('七天签到已领完，期待下个版本吧~');
            } else {
                utils.showToast('今天已经领取过啦，明天再来吧~');
            }
            
        }
    },

    // 签到显示切换
    signSwitch(e, show) {
        if (show) {
            if (this.signBox.active) return;
            this.signBox.active = true;
            this.signBox.runAction(cc.fadeIn(0.2));
        } else {
            if (!this.signBox.active) return;
            let seq = cc.sequence(cc.fadeOut(0.2), cc.callFunc(() => {
                this.signBox.active = false;
            }))
            this.signBox.runAction(seq);
        }
    },

    // 检查是否可以签到
    checkSign() {
        let now = utils.timeFormat().split(' ')[0];
        let last = Global.userInfo.signDate.split(' ')[0];
        // console.log(now, last);
        if (now != last) {
            this.signIn = true;
            this.signSwitch(null, true);
            if (Global.userInfo.signDay < 8) {
                // 对应的动画
                let seq = cc.repeatForever(
                    cc.sequence(
                        cc.rotateTo(0.1, -15),
                        cc.rotateTo(0.1, 15),
                        cc.rotateTo(0.1, -15),
                        cc.rotateTo(0.1, 15),
                        cc.rotateTo(0.1, 0),
                        cc.scaleTo(1, 1)
                    ));
                let btn = cc.find('content', this.signBox).children[Global.userInfo.signDay - 1];
                btn.runAction(seq);
                cc.find('cover', btn).active = false;
                if (Global.userInfo.signDay < 7) {
                    let nextBtn = cc.find('content', this.signBox).children[Global.userInfo.signDay];
                    cc.find('cover/text', nextBtn).getComponent(cc.Label).string = '明天领取';
                }
            }
            
        } else {
            this.signIn = false;
            if (Global.userInfo.signDay > 7) {
                cc.find('receive-btn/text', this.signBox).getComponent(cc.Label).string = '七天签到已领完';
            } else {
                cc.find('receive-btn/text', this.signBox).getComponent(cc.Label).string = '今日已领取过';
                let nextBtn = cc.find('content', this.signBox).children[Global.userInfo.signDay-1];
                cc.find('cover/text', nextBtn).getComponent(cc.Label).string = '明天领取';
            }
            this.checkSignBtn();
        }
    },

    checkSignBtn() {
        let btns = cc.find('content', this.signBox).children;
        for (let i = 0; i < btns.length; i++) {
            if (i < Global.userInfo.signDay-1) {
                cc.find('cover', btns[i]).active = true;
                cc.find('cover/text', btns[i]).destroy();
                cc.find('cover/icon_receive', btns[i]).active = true;
            }
        }
    },

    openGame() {
        Global.restData();
        cc.director.loadScene('Game');
    },

    openLuckDraw() {
        cc.director.loadScene('LuckDraw');  
    },

    // 按钮动画
    btnMove() {
        let seq = cc.repeatForever(
            cc.sequence(
                cc.rotateTo(0.1, -15),
                cc.rotateTo(0.1, 15),
                cc.rotateTo(0.1, -15),
                cc.rotateTo(0.1, 15),
                cc.rotateTo(0.1, 0),
                cc.scaleTo(1, 1)
            ));
        let seq2 = cc.repeatForever(
            cc.sequence(
                cc.tintTo(0.5, 237, 194, 26), 
                cc.scaleTo(1, 1),
                cc.tintTo(0.5, 43, 183, 244),
                cc.scaleTo(1, 1),
            )
        )
        cc.find('game_start', this.node).runAction(seq);
        cc.find('game_start/start-icon', this.node).runAction(seq2);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.preloadScene('Game', () => console.log('预加载游戏场景成功'));
        cc.director.preloadScene('LuckDraw', () => console.log('预加载抽奖场景成功'));

        if (Global.fetchData()) Global.userInfo = Global.fetchData();
        if (Global.userInfo.maxScore != 0) this.maxScoreLabel.string = Global.userInfo.maxScore;

        this.checkSign();
        this.btnMove();
    },

    start () {
        if (window.wx) {
            // 检测用户是否授权过
            wx.getUserInfo({
                success(res) {
                    console.log('用户授权信息====>', res);
                },
                fail() {
                    let _w = wx.getSystemInfoSync().windowWidth,
                        _h = wx.getSystemInfoSync().windowHeight;
                    console.warn('创建获取用户信息按钮');
                    // 创建获取用户信息按钮
                    let loginBtn = wx.createUserInfoButton({
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
                    loginBtn.onTap(res => {
                        console.log('用户授权数据：', res);
                        if (res.errMsg != 'getUserInfo:ok') return;
                        loginBtn.destroy();
                    });
                }
            });
            // 显示分享按钮
            wx.showShareMenu();
            // 设置转发分内容
            wx.onShareAppMessage(res => {
                return {
                    title: Global.shareInfo.title,
                    imageUrl: Global.shareInfo.url,
                }
            });
        }
    },
    computed() {
        let mask_down = cc.find('mask-down', this.box),
            mask_down_box = cc.find('mask-down/mask-box', this.box),
            mask_top = cc.find('mask-top', this.box),
            mask_top_box = cc.find('mask-top/mask-box', this.box);
        let size = Math.sqrt(20000);

        /**
         * 0.5 - 1.5 轴心变化范围
         * -50 - 50 偏移变化范围
         * 30 - 50范围开始增加锚点计算
         * mask_down.width = mask_down.height = size; 这里不可以改 height
         */
        
        // 第一种 （圆形）
        // // 向下
        // mask_down.width = mask_down.height = mask_down_box.width = mask_down_box.height = size;
        // mask_down.rotation = -this.box.rotation;
        // mask_down.anchorY = 0.5 + (this.box.y + size/2) / size;
        // mask_down_box.rotation = this.box.rotation;
        
        // // 向上
        // mask_top.width = mask_top.height = mask_top_box.width = mask_top_box.height = size;
        // mask_top.rotation = -this.box.rotation;
        // mask_top.anchorY = 0.5 + (this.box.y - size/2) / size;
        // mask_top_box.rotation = this.box.rotation;


        // 第二种（正方形）
        mask_down.width = mask_down.height = size;
        mask_down.rotation = -this.box.rotation;
        mask_down_box.rotation = this.box.rotation;
        mask_down.anchorY = (0.5 + (this.box.y + 50) / 100) - this.box.y * 0.003;
        
        // 向上
        mask_top.width = mask_top.height = size;
        mask_top.rotation = -this.box.rotation;
        mask_top_box.rotation = this.box.rotation;
        mask_top.anchorY = (0.5 + (this.box.y - 50) / 100) - this.box.y * 0.003;

        console.log(mask_down.anchorY, this.box.y * 0.003);
    },
    // update (dt) {},
});
