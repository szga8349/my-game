const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        startBtn: {
            default: null,
            type: cc.Node
        },
        playerBone: {
            default: null,
            type: dragonBones.ArmatureDisplay
        },
        sign: {
            default: null,
            type: cc.Prefab,
        },
        shop: {
            default: null,
            type: cc.Prefab,
        },
        rank: {
            default: null,
            type: cc.Prefab,
        },
        // 背景音乐
        audioBgm: {
            default: null,
            type: cc.AudioClip
        },

    },

    openRank() {
        if (this.rankBox) {
            this.rankBox.active = true;
        } else {
            this.rankBox = cc.instantiate(this.rank);
            this.rankBox.parent = this.node;
        }
    },

    // 打开签到
    openSign() {
        if (this.signBox) {
            this.signBox.active = true;
        } else {
            this.signBox = cc.instantiate(this.sign);
            this.signBox.parent = this.node;
        }
    },

    // 打开商店
    openShop() {
        if (this.shopBox) {
            this.shopBox.active = true;
            this.shopBox.getComponent('shop').gemLabel.string = Global.userData.gem;
        } else {
            this.shopBox = cc.instantiate(this.shop);
            this.shopBox.parent = this.node;
        }
    },

    // 开始按钮
    startBtnMove() {
        let seq = cc.repeatForever(
            cc.sequence(
                cc.rotateTo(0.1, -15),
                cc.rotateTo(0.1, 15),
                cc.rotateTo(0.1, -15),
                cc.rotateTo(0.1, 15),
                cc.rotateTo(0.1, 0),
                cc.scaleTo(1, 1)
            ));
        this.startBtn.runAction(seq);
        this.skinSelect();
    },

    // 皮肤选择
    skinSelect() {
        this.playerBone.armatureName = Global.gameInfo.skinName[Global.userData.skin];
    },

    // 主题选择
    themeSelect() {
        // 先清空再赋值
        Global.gameInfo.images = {};
        // 直接加载整个主题文件夹的图片 这里可以放在home场景中预先加载
        cc.loader.loadResDir(`theme${Global.gameInfo.theme}`, cc.SpriteFrame, (errs, res) => {
            for (let i = 0; i < res.length; i++) {
                Global.gameInfo.images[res[i]._name] = res[i];
            }
            // console.log(Global.gameInfo.images);
        });
    },

    openGame() {
        cc.director.loadScene('Game');
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (!Global.musicInfo.bgmState) {
            Global.musicInfo.bgmState = true;
            Global.musicInfo.bgm = this.audioBgm;
            cc.audioEngine.playMusic(this.audioBgm, true);
        }

        Global.home = this;
        // 更新数据
        if (Global.fetchData()) {
            Global.userData = Global.fetchData();
            console.log('更新数据', Global.userData);
        }

        if (!Global.gameInfo.images) {
            console.log('首次加载资源');
            this.themeSelect();
        }

        cc.director.preloadScene('Game', () => console.log('预加载游戏场景成功'));

        if (this.node.height >= 1500) {
            Global.gameInfo.isMaxPhone = 10;
            console.log('针对全面屏手机做的地板冰块增加');
        }

        this.startBtnMove();

        // 检测是否显示签到
        if (Global.userData.signTime != Global.timeFormat() && Global.userData.signDay < 7) {
            this.signBox = cc.instantiate(this.sign);
            this.signBox.parent = this.node;
        }
        
    },

    // start () {},

    // update (dt) {},
});