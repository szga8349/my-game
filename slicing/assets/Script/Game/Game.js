const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        // 上方切割线
        lineTop: {
            default: null,
            type: cc.Node
        },
        // 中间切割线
        lineCenter: {
            default: null,
            type: cc.Node
        },
        // 下方切割线
        lineBottom: {
            default: null,
            type: cc.Node
        },
        // 分数
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        // 金币
        moneyLabel: {
            default: null,
            type: cc.Label
        },
        // 方块输出
        map: {
            default: null,
            type: cc.Node
        },
        // 盒子资源
        boxPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 盒子图片资源
        boxList: {
            default: [],
            type: cc.SpriteFrame
        },
        // 道具资源 0 => 时钟，1 => 三重割线
        propPrefab: {
            default: [],
            type: cc.Prefab
        },
        // 道具粒子资源 对应上面
        propList: {
            default: [],
            type: cc.Prefab
        },
        // 血量
        hpBox: {
            default: null,
            type: cc.Node
        },
        // 警告
        warning: {
            default: null,
            type: cc.Node
        },
        // 整体
        wrap: {
            default: null,
            type: cc.Node
        },
        // 陷阱盒子
        trapBox: {
            default: null,
            type: cc.SpriteFrame
        },
        // 提示文字
        tipNode: {
            default: null,
            type: cc.Node
        },
        // 倒计时
        timeoutLabel: {
            default: null,
            type: cc.Label
        },
        // 音效资源（各类盒子） 0：普通，1：水果，2：卡通，3：宇宙，4：办公软件
        boxAudios: {
            default: [],
            type: cc.AudioClip
        },
        // 失败音效
        failAudio: {
            default: null,
            type: cc.AudioClip
        },
        // 减少血量音效
        reduceAudio: {
            default: null,
            type: cc.AudioClip
        },
        // 连击音效
        hitAudio: {
            default: null,
            type: cc.AudioClip
        },
        // 炸弹音效
        boomAudio: {
            default: null,
            type: cc.AudioClip
        },
        // 时钟音效
        clockAudio: {
            default: null,
            type: cc.AudioClip
        },
        // 三重割线
        lineAudio: {
            default: null,
            type: cc.AudioClip
        },
        // 暂停按钮
        pauseBtn: {
            default: null,
            type: cc.Node
        },
        // 开始按钮
        resumeBtn: {
            default: null,
            type: cc.Node
        },
    },
    stateSwitch() {
        if (this.isPause) {
            this.isPause = false;
            cc.director.resume();
            this.pauseBtn.active = true;
            this.resumeBtn.active = false;
        } else {
            this.isPause = true;
            cc.director.pause();
            this.pauseBtn.active = false;
            this.resumeBtn.active = true;
        }
    },
    // 开始预备倒计时
    startReady() {
        this.timeoutLabel.node.stopAllActions();
        this.timeoutLabel.string = 3;
        let action = cc.sequence(cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.3, 1.5)), cc.scaleTo(0.2, 0.8), cc.callFunc(() => {
            this.timeoutLabel.string = 2;
        }), cc.scaleTo(0.3, 1.5), cc.scaleTo(0.2, 0.8), cc.callFunc(() => {
            this.timeoutLabel.string = 1;
        }), cc.scaleTo(0.3, 1.5), cc.spawn(cc.scaleTo(0.2, 0), cc.fadeOut(0.2)), cc.callFunc(() => {
            this.timeoutLabel.string = 0;
            this.startGame();
        }));
        this.timeoutLabel.node.runAction(action);
    },
    // 提示出现
    tipSwitch(str, color) {
        let _w = -(this.node.width / 2);
        this.tipNode.stopAllActions();
        // if (color) {
        //     this.tipNode.color = cc.hexToColor('#ed4d32');
        // } else {
        //     this.tipNode.color = cc.hexToColor('#ed4d32');
        // }
        cc.find('text', this.tipNode).getComponent(cc.Label).string = str;
        let show = cc.moveTo(0.2, _w, this.tipNode.y);
        show.easing(cc.easeExponentialInOut());
        let hide = cc.moveTo(0.1, _w - this.tipNode.width, this.tipNode.y);
        let stop = cc.scaleTo(0.5, 1);
        let seq = cc.sequence(show, stop, hide);
        this.tipNode.runAction(seq);
    },
    // 再玩一次
    playAgain() {
        Global.restData();
        cc.director.loadScene('Game');
    },
    // 开始
    startGame(e) {
        this.creatBox();
        // e.target.destroy();

        this.scheduleOnce(() => {
            if (Global.gameInfo.state != 'over') {
                this.creatProp(0);
                this.scheduleOnce(() => {
                    if (Global.gameInfo.state != 'over') this.creatProp(1);
                }, 3);
            }
        }, 5);
    },
    // 游戏结束
    gameOver(time = 1) {
        console.log('游戏结束');
        Global.gameInfo.state = 'over';
        Global.gameInfo.speed = 0.2;
        this.pauseBtn.active = false;
        this.scheduleOnce(() => {
            Global.gameInfo.speed = 1;
            cc.audioEngine.play(this.failAudio, false);
            this.scheduleOnce(() => {
                // 判断复活或者回到首页
                this.lineSwitch();
                if (this.lineTimer) clearTimeout(this.lineTimer);
                if (this.gameState == 'revive') {
                    Global.restData();
                    cc.director.loadScene('Home');
                } else {
                    cc.loader.loadRes('revive-btn', (err, prefab) => {
                        let btn = cc.instantiate(prefab);
                        btn.y = -(this.node.height / 2 + 100);
                        btn.parent = this.node;
                    });
                }
            }, 1);
        }, time);
        // 分数提交处理
        if (Global.gameInfo.score > Global.userInfo.maxScore) {
            Global.userInfo.maxScore = Global.gameInfo.score;
        }
        // 这里做进度保存
        Global.saveData();
    },
    // 震动
    shockMove(needWarn = false) {
        this.wrap.stopAllActions();
        let seq = cc.sequence(
            cc.moveTo(0.1, 0, 30), cc.moveTo(0.1, 0, -30),
            cc.moveTo(0.1, 0, 30), cc.moveTo(0.1, 0, -30),
            cc.moveTo(0.1, 0, 30), cc.moveTo(0.1, 0, -30),
            cc.moveTo(0.1, 0, 0));
        this.wrap.runAction(seq);
        if (needWarn) {
            let show = cc.fadeIn(0.3);
            show.easing(cc.easeExponentialInOut());
            this.warning.runAction(show);
        }
    },
    // 短震
    shortShockMove() {
        this.wrap.stopAllActions();
        let seq = cc.sequence(
            cc.moveTo(0.05, 0, 10), cc.moveTo(0.05, 0, -10),
            cc.moveTo(0.1, 0, 0));
        this.wrap.runAction(seq);
    },
    // 减速
    decelerate() {
        this.timeoutLabel.node.stopAllActions();
        cc.audioEngine.play(this.clockAudio, false); // 播放音频
        Global.gameInfo.speed = 0.4;
        this.timeoutLabel.string = 10;
        this.timeoutLabel.node.runAction(cc.fadeIn(0.3));
        cc.find('bg', this.node).runAction(cc.tintTo(0.3, 47, 186, 80));

        let seq = cc.sequence(cc.scaleTo(0.3, 1.5), cc.scaleTo(0.7, 0.8), cc.callFunc(() => {
            this.timeoutLabel.string = 9;
        }), cc.scaleTo(0.3, 1.5), cc.scaleTo(0.7, 0.8), cc.callFunc(() => {
            this.timeoutLabel.string = 8;
        }), cc.scaleTo(0.3, 1.5), cc.scaleTo(0.7, 0.8), cc.callFunc(() => {
            this.timeoutLabel.string = 7;
        }), cc.scaleTo(0.3, 1.5), cc.scaleTo(0.7, 0.8), cc.callFunc(() => {
            this.timeoutLabel.string = 6;
        }), cc.scaleTo(0.3, 1.5), cc.scaleTo(0.7, 0.8), cc.callFunc(() => {
            this.timeoutLabel.string = 5;
        }), cc.scaleTo(0.3, 1.5), cc.scaleTo(0.7, 0.8), cc.callFunc(() => {
            this.timeoutLabel.string = 4;
        }), cc.scaleTo(0.3, 1.5), cc.scaleTo(0.7, 0.8), cc.callFunc(() => {
            this.timeoutLabel.string = 3;
        }), cc.scaleTo(0.3, 1.5), cc.scaleTo(0.7, 0.8), cc.callFunc(() => {
            this.timeoutLabel.string = 2;
        }), cc.scaleTo(0.3, 1.5), cc.scaleTo(0.7, 0.8), cc.callFunc(() => {
            this.timeoutLabel.string = 1;
        }), cc.scaleTo(0.3, 1.5), cc.scaleTo(0.7, 0.8), cc.callFunc(() => {
            this.timeoutLabel.string = 0;
            Global.gameInfo.speed = 1;
            this.timeoutLabel.node.runAction(cc.fadeOut(0.3)); 
            cc.find('bg', this.node).runAction(cc.tintTo(0.3, 43, 183, 244));
        }));
        this.timeoutLabel.node.runAction(seq);
    },
    // 三倍开关
    lineSwitch(open = false) {
        if (open) {
            Global.gameInfo.triple = true;
            this.lineTop.runAction(cc.spawn(cc.fadeIn(0.1), cc.moveTo(0.1, 0, 100)));
            this.lineBottom.runAction(cc.spawn(cc.fadeIn(0.1), cc.moveTo(0.1, 0, -100)));
        } else {
            Global.gameInfo.triple = false;
            this.lineTop.runAction(cc.spawn(cc.fadeOut(0.1), cc.moveTo(0.1, 0, 0)));
            this.lineBottom.runAction(cc.spawn(cc.fadeOut(0.1), cc.moveTo(0.1, 0, 0)));
        }
    },
    // 三重割线
    openLine() {
        cc.audioEngine.play(this.lineAudio, false); // 播放音频
        this.lineSwitch(true); 
        if (this.lineTimer) clearTimeout(this.lineTimer);
        this.lineTimer = setTimeout(() => {
            this.lineSwitch();
        }, 7000);
    },
    // 生命更新
    updateHp() {
        if (this.hp_count == Global.gameInfo.hp) return;
        this.hp_count = Global.gameInfo.hp;
        // 动画方法不能共用
        // let show = cc.spawn(cc.scaleTo(0.2, 1), cc.fadeIn(0.2));
        // let hide = cc.spawn(cc.scaleTo(0.2, 0), cc.fadeOut(0.2));
        let heart_1 = cc.find('heart-1', this.hpBox),
            heart_2 = cc.find('heart-2', this.hpBox),
            heart_3 = cc.find('heart-3', this.hpBox);
        // 显示
        if (heart_1.opacity < 100 && this.hp_count > 0) {
            heart_1.runAction(cc.spawn(cc.scaleTo(0.2, 1), cc.fadeIn(0.2)));
        }
        if (heart_2.opacity < 100 && this.hp_count > 1) {
            heart_2.runAction(cc.spawn(cc.scaleTo(0.2, 1), cc.fadeIn(0.2)));
        }
        if (heart_3.opacity < 100 && this.hp_count > 2) {
            heart_3.runAction(cc.spawn(cc.scaleTo(0.2, 1), cc.fadeIn(0.2)));
        }
        // 消失
        if (heart_1.opacity > 100 && this.hp_count < 1) {
            heart_1.runAction(cc.spawn(cc.scaleTo(0.2, 0), cc.fadeOut(0.2)));
        }
        if (heart_2.opacity > 100 && this.hp_count < 2) {
            heart_2.runAction(cc.spawn(cc.scaleTo(0.2, 0), cc.fadeOut(0.2)));
        }
        if (heart_3.opacity > 100 && this.hp_count < 3) {
            heart_3.runAction(cc.spawn(cc.scaleTo(0.2, 0), cc.fadeOut(0.2)));
        }
        // console.log('血量更新！！！');
    },
    // 更新分数
    updateScore() {
        Global.gameInfo.score += 1 + Global.gameInfo.hit;
        this.scoreLabel.string = Global.gameInfo.score;
    },
    // 更新金币
    updateMoney(type = true) {
        Global.userInfo.money += 1;
        if (type) this.moneyLabel.string = Global.userInfo.money;
    },
    // 创建对象池
    creatBoxPool() {
        this.boxPool = new cc.NodePool();
        for (let i = 0; i < 10; i++) {
            let box = cc.instantiate(this.boxPrefab);
            this.boxPool.put(box);
        }
    },
    // 创建单个盒子
    creatBox(type = 'none') {
        let box = null;
        if (this.boxPool.size() > 0) {
            box = this.boxPool.get();
        } else {
            box = cc.instantiate(this.boxPrefab);
            console.log('不够用重新创建 box');
        }
        box.getComponent('Box').restBox(type);
        box.parent = this.map;
    },
    // 创建道具
    creatProp(type) {
        let prop = cc.instantiate(this.propPrefab[type]);
        prop.getComponent('Prop').restBox();
        prop.parent = this.map;
    },
    // 动态添加资源
    addImg() {
        if (Global.gameInfo.theme == 'none') {
            let loop = str => {
                cc.loader.loadRes(`${str}-1`, cc.SpriteFrame, (err, res) => this.boxList.push(res));
                cc.loader.loadRes(`${str}-2`, cc.SpriteFrame, (err, res) => this.boxList.push(res));
                cc.loader.loadRes(`${str}-3`, cc.SpriteFrame, (err, res) => this.boxList.push(res));
                cc.loader.loadRes(`${str}-4`, cc.SpriteFrame, (err, res) => this.boxList.push(res));
            }
            if (Global.userInfo.theme == 'cartoon' || Global.userInfo.theme == 'fruit' || Global.userInfo.theme == 'universe' || Global.userInfo.theme == 'office') {
                loop(Global.userInfo.theme);
            } else {
                cc.loader.loadRes(Global.userInfo.theme, cc.SpriteFrame, (err, res) => {
                    this.boxList = [res, res, res, res];
                });
            }
        } else {
            cc.log('试玩！！！')
            cc.loader.loadRes(Global.gameInfo.theme, cc.SpriteFrame, (err, res) => {
                this.boxList = [res, res, res, res];
            });
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.game = this;
        // cc.find('bg', this.node).runAction(cc.tintTo(0.5, 43, 183, 244));
        
        this.updateHp();
        this.updateMoney(false);
        this.addImg();
        this.creatBoxPool();

        if (Global.userInfo.first) {
            console.log('第一次玩，创建新手引导');
            cc.loader.loadRes('tutorial', (err, prefab) => {
                Global.userInfo.first = false;
                let page = cc.instantiate(prefab);
                page.parent = this.node;
            });
        } else {
            this.startReady();
            this.pauseBtn.active = true;
        }        
    },

    start() {
        this.node.on('touchstart', () => {
            if (Global.gameInfo.state == 'over' || Global.gameInfo.click) return;
            Global.gameInfo.click = true;
            this.lineTop.color = this.lineCenter.color = this.lineBottom.color = cc.hexToColor('#ff0001');
            this.scheduleOnce(() => {
                this.lineTop.color = this.lineCenter.color = this.lineBottom.color = cc.hexToColor('#ffffff');
                Global.gameInfo.click = false;
            }, 0.1);
        }, this);

        if (window.wx) {
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

    // update (dt) {},
});
