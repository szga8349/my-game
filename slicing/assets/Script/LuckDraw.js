
const Global = require('Global');
const utils = require('utils');

cc.Class({
    extends: cc.Component,

    properties: {
        // 转盘
        disc: {
            default: null,
            type: cc.Node
        },
        // 皮肤列表容器
        skinList: {
            default: null,
            type: cc.Node
        },
        // 金币
        moneyLabel: {
            default: null,
            type: cc.Label
        },
        // 抽奖按钮
        drawButton: {
            default: null,
            type: cc.Node
        },
        // 提示
        prompt: {
            default: null,
            type: cc.Node
        },
        // 抽奖音乐
        drawAudio: {
            default: null,
            type: cc.AudioClip
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

    // 皮肤按钮
    skinBtn(e) {
        if (e.target.getChildByName('lock').active) return utils.showToast('还没解锁当前道具');
        if (this.select == e.target.bindData) return console.log('重复点击');
        
        Global.userInfo.theme = e.target.bindData;
        this.select = e.target.bindData;
        this.btnSwitch();
        
        // 这里做进度保存
        Global.saveData();
    },

    // 按钮切换
    btnSwitch() {
        let skins = this.skinList.children;
        for (let i = 0; i < skins.length; i++) {
            // 判断选中
            if (Global.userInfo.theme == Global.boxList[i]) {
                skins[i].getChildByName('on').active = true;
            } else {
                skins[i].getChildByName('on').active = false;
            }
        }
    },

    // 看视频抽奖
    videoBtn() {
        if (this.rotating) return;
        this.rotating = true;
        this.disc.rotate = 0;
        utils.viewVideo(() => {
            this.startRotate();
        }, () => {
            utils.showToast('视频播放失败');
            this.rotating = false;
        }, 'xashfbiashfi');
    },

    // 抽奖按钮
    drawBtn() {
        if (this.rotating) return;
        this.rotating = true;
        this.disc.rotate = 0;

        // 判断是否免费抽奖
        if (Global.userInfo.free > 0) {
            Global.userInfo.free -= 1;
            this.startRotate();
        } else {
            if (Global.userInfo.money >= 30) {
                Global.userInfo.money -= 30;
                this.startRotate();
            } else {
                utils.showToast('金币不足，无法抽奖');
                this.rotating = false;
            }
        }

    },

    // 转盘旋转
    startRotate(callback) {
        this.resetNode();
        cc.audioEngine.play(this.drawAudio, false); // 播放音频
        // 随机
        let num = parseInt(100 * Math.random()) + 1;
        let angle = 0;

        if (num <= 5) {
            angle = 1;
            // console.log('得到皮肤');
        } else if (num > 5 && num <= 15) {
            angle = 2;
            // console.log('得到50金币');
        } else if (num > 15 && num <= 35) {
            angle = 3;
            // console.log('再抽一次');
        } else if (num > 35 && num <= 60) {
            angle = 4;
            // console.log('得到20金币');
        } else if (num > 60 && num <= 80) {
            angle = 5;
            // console.log('得到10金币');
        } else if (num > 80 && num <= 100) {
            angle = 0;
            // console.log('得到5金币');
        }
        // angle = 1;

        let action = cc.rotateTo(5, 360 * 7 + angle * 60);
        action.easing(cc.easeInOut(3.0));
        this.disc.runAction(cc.sequence(action, cc.callFunc(() => {
            console.log('旋转结束');
            switch (angle) {
                case 0:
                    this.promptSwitch(null, null, '恭喜获得 5 金币');
                    Global.userInfo.money += 5;
                    break;
                case 1:
                    let str = this.randomSkin();
                    if (str == 'none') {
                        this.promptSwitch(null, null, '你已经获得所有皮肤，这次送你100金币');
                        Global.userInfo.money += 100;
                    } else {
                        this.promptSwitch(null, null, '抽中了一款新皮肤已经装备上了~', str);
                        Global.userInfo.themeList.push(str);
                        // 这里做判断解锁系列皮肤
                        let type = str.split('-')[0];
                        let arr = Global.userInfo.themeList.filter(item => item.includes(type));
                        if (arr.length == 4) {
                            Global.userInfo.themeList.push(type);
                        }
                        // 判断解锁
                        let skins = this.skinList.children;
                        for (let i = 0; i < skins.length; i++) {
                            if (Global.userInfo.themeList.some(item => item == skins[i].name)) {
                                skins[i].getChildByName('lock').active = false;
                            } 
                        }
                        // 自动选择上新皮肤
                        Global.userInfo.theme = str;
                        this.select = str;
                        this.btnSwitch();
                    }
                    break;
                case 2:
                    this.promptSwitch(null, null, '恭喜获得 50 金币');
                    Global.userInfo.money += 50;
                    break;
                case 3:
                    this.promptSwitch(null, null, '恭喜获得一次免费抽奖机会', 'again');
                    Global.userInfo.free += 1;
                    break;
                case 4:
                    this.promptSwitch(null, null, '恭喜获得 20 金币');
                    Global.userInfo.money += 20;
                    break;
                case 5:
                    this.promptSwitch(null, null, '恭喜获得 10 金币');
                    Global.userInfo.money += 10;
                    break;
            }

            // 这里做进度保存
            Global.saveData();

            this.resetNode();
            if (typeof callback === 'function') callback();
            this.rotating = false;
        })));
    },

    // 随机一个皮肤
    randomSkin() {
        // console.log(Global.userInfo.themeList);
        let skin = 'none';
        let cases = ['box-white', 'office-1', 'fruit', 'cartoon', 'universe'];

        let themeList = [...Global.userInfo.themeList];
        themeList.push(...cases);

        let newList = Array.from(new Set(themeList));

        // console.log('newList==>', newList);
        
        // 随机列表
        let randomList = Global.boxList.filter(item => {
            return !newList.some(it => it == item);
        });

        if (randomList.length > 0) {
            let num = parseInt(randomList.length * Math.random());
            skin = randomList[num];
        }
        // console.log(Global.userInfo.themeList);
        // console.log(randomList, skin);

        return skin;
    },

    // 生成按钮
    creatBtn() {
        let themeList = Global.userInfo.themeList;
        let btns = Global.boxList;
        for (let i = 0; i < btns.length; i++) {
            let btn = cc.instantiate(this.skinList.getChildByName('skin-btn'));
            btn.name = btns[i];

            // 图片加载
            cc.loader.loadRes(btns[i], cc.SpriteFrame, (err, res) => {
                btn.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = res;
            });

            // 判断解锁
            if (themeList.some(item => item == btns[i])) {
                btn.getChildByName('lock').active = false;
            } else {
                btn.getChildByName('lock').active = true;
            }

            // 判断选中
            if (Global.userInfo.theme == btns[i]) {
                btn.getChildByName('on').active = true;
            } else {
                btn.getChildByName('on').active = false;
            }

            // 位置设置
            btn.x = i * 160;
            this.skinList.width = (i + 1) * 160 - 20;
            btn.bindData = btns[i];

            btn.parent = this.skinList;
        }
        this.skinList.children[0].destroy();

        let light_1 = cc.find('light-1', this.disc),
            light_2 = cc.find('light-2', this.disc);

        let seq1 = cc.repeatForever(cc.sequence(cc.fadeOut(0.1), cc.callFunc(() => {
            light_1.rotation = 15;
        }), cc.rotateTo(0.1, -15), cc.fadeIn(0.1), cc.callFunc(() => {
            light_1.rotation = -15;
        })));
        light_1.runAction(seq1);

        let seq2 = cc.repeatForever(cc.sequence(cc.fadeOut(0.1), cc.callFunc(() => {
            light_1.rotation = 15;
        }), cc.rotateTo(0.1, -15), cc.fadeIn(0.1), cc.callFunc(() => {
            light_1.rotation = -15;
        })));
        
        this.scheduleOnce(() => {
            light_2.runAction(seq2);
        }, 0.1);
    },

    playGame() {
        let str = this.randomSkin();
        Global.gameInfo.theme = str;
        cc.director.loadScene('Game');
    },

    // 返回
    goback() {
        cc.audioEngine.stopAll();
        cc.director.loadScene('Home');
    },

    // 更新节点
    resetNode() {
        if (Global.userInfo.free > 0) {
            cc.find('icon', this.drawButton).active = false;
            cc.find('text', this.drawButton).active = false;
            cc.find('content', this.drawButton).active = true;
        } else {
            cc.find('icon', this.drawButton).active = true;
            cc.find('text', this.drawButton).active = true;
            cc.find('content', this.drawButton).active = false;
        }
        this.moneyLabel.string = Global.userInfo.money;
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.select = Global.userInfo.theme;
        this.resetNode();
        this.creatBtn();

        // this.randomSkin();
    },

    // start () {},

    // update (dt) {},
});
