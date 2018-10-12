const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        // 整体容器（缩放用）
        wrap: {
            default: null,
            type: cc.Node
        },
        ball: {
            default: null,
            type: cc.Node
        },
        // 开始遮罩
        coverStart: {
            default: null,
            type: cc.Node
        },
        // 地图容器
        map: {
            default: null,
            type: cc.Node
        },
        // 兽人
        orc: {
            default: null,
            type: cc.Prefab
        },
        // 宝箱
        storehouse: {
            default: null,
            type: cc.Prefab
        },
        // 炸弹
        bomb: {
            default: null,
            type: cc.Prefab
        },
        // 木板
        board: {
            default: null,
            type: cc.Prefab
        },
        // 血液粒子
        blood: {
            default: null,
            type: cc.Prefab
        },
        // 结束遮罩
        coverOver: {
            default: null,
            type: cc.Prefab
            // type: cc.Node
        },
        // bgm
        audioBgm: {
            default: null,
            type: cc.AudioClip
        },
        audioFail: {
            default: null,
            type: cc.AudioClip
        },
        pauseBtn: {
            default: null,
            type: cc.Node
        },
        // 火焰闪屏
        blaze: {
            default: null,
            type: cc.Node
        },
        // 速度线骨骼
        speedBone: {
            default: null,
            type: cc.Node
        }
    },
    
    // 屏幕震动
    nodeShock() {
        this.wrap.stopAllActions();
        let seq = cc.sequence(
            cc.moveTo(0.1, 0, 30), cc.moveTo(0.1, 0, -30),
            cc.moveTo(0.1, 0, 30), cc.moveTo(0.1, 0, -30),
            cc.moveTo(0.1, 0, 0));
        this.wrap.runAction(seq);
    },
    // 冲刺动画
    sprintMove() {
        if (window.wx) wx.vibrateLong();
        this.speedBone.getComponent(dragonBones.ArmatureDisplay).playAnimation('move', 0);
        let seq = cc.sequence(
            cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2),
            cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2),
            cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2),
            cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2),
            cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2),
            cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2),
            cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2),
            cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2),
            cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2),
            cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2),
            cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2),
            cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.callFunc(() => {
                Global.gameInfo.startDash = false;
                this.blaze.destroy();
                console.log('冲刺结束');
            }));
        this.blaze.runAction(seq);
    },
    // 暂停
    stateSwitch() {
        if (this.pauseGame) {
            this.pauseGame = false;
            cc.director.resume();
            cc.loader.loadRes('pause', cc.SpriteFrame, (err, res) => {
                this.pauseBtn.getComponent(cc.Sprite).spriteFrame = res;
            });
        } else {
            this.pauseGame = true;
            cc.director.pause();
            cc.loader.loadRes('play', cc.SpriteFrame, (err, res) => {
                this.pauseBtn.getComponent(cc.Sprite).spriteFrame = res;
            });
        }
    },
    // 开始
    startGame() {
        this.coverStart.destroy();
        Global.gameInfo.countToatal = Global.gameInfo.total;
        let seq = cc.sequence(cc.moveTo(1, this.wrap.width / 2, 500), cc.callFunc(() => {
            // 产出兽人
            for (let i = Global.gameInfo.total; i > 0; i--) {
                this.scheduleOnce(() => {
                    this.creatOrc(i);
                    // console.log(i);
                }, 0.2);
            }
            Global.gameInfo.state = 'running';
            // 金币箱兽人生成
            this.schedule(() => this.creatPropOrc(this.storehouse), Global.gameInfo.orcMoney);
            // 炸弹箱子兽人生成
            this.schedule(() => this.creatPropOrc(this.bomb), Global.gameInfo.orcBoom);
            // 木板兽人生成
            this.schedule(() => this.creatPropOrc(this.board), Global.gameInfo.orcBoard);
            // 判断是否高能陨石
            if (Global.gameInfo.startDash) {
                this.sprintMove();
                Global.gameInfo.speed = 8;
                this.balljs.isSprint = true;
            } else {
                this.blaze.destroy();
            }
        }));
        this.ball.runAction(seq);

        // 针对全面屏手机做的地板拉长
        if (this.node.width >= 1500) {
            cc.find('move-box/floor', this.wrap).width = 3700;
            console.log('针对全面屏手机做的地板拉长');
        }
    },
    
    // 游戏结束
    gameOver() {
        if (Global.gameInfo.score > Global.userInfo.maxScore) {
            console.log('更新最高分数');
            Global.userInfo.maxScore = Global.gameInfo.score;
        }
        Global.saveData();

        this.coverOverBox = cc.instantiate(this.coverOver);
        this.coverOverBox.parent = this.node;

        if (!this.revived) {
            this.coverOverBox.getChildByName('revive').active = true;
            let seq = cc.repeatForever(
                cc.sequence(cc.scaleTo(0.3, 1.3, 1.2), cc.scaleTo(0.2, 1, 1))
            );
            this.coverOverBox.getChildByName('revive').runAction(seq);
        }
        Global.playBgm = false;
        cc.audioEngine.stopMusic();
        cc.audioEngine.play(this.audioFail, false);
        if (window.wx) wx.postMessage({ action: 'updata', score: Global.gameInfo.score });
    },
    // 血液粒子对象池
    creatBloodPool() {
        this.bloodPool = new cc.NodePool();
        for (let i = 0; i < Global.gameInfo.total - 5; ++i) {
            let blood = cc.instantiate(this.blood);
            this.bloodPool.put(blood);
        }
    },
    // 血浆粒子爆炸
    explode(node) {
        let blood = null,
            _x = node.x + node.width / 2,
            _y = node.y + node.height / 2;
        if (this.bloodPool.size() > 0) {
            blood = this.bloodPool.get();
        } else {
            cc.log('重新创建粒子');
            blood = cc.instantiate(this.blood);
        }
        blood.setPosition(_x, _y);
        blood.parent = this.map;
        blood.getComponent(cc.ParticleSystem).resetSystem();

        // 0.5秒后回收
        this.scheduleOnce(() => this.bloodPool.put(blood), 0.5);
    },
    // 兽人对象池
    creatOrcPool() {
        this.orcPool = new cc.NodePool();
        for (let i = 0; i < Global.gameInfo.total; ++i) {
            let orc = cc.instantiate(this.orc);
            this.orcPool.put(orc);
        }
    },
    // 制造兽人
    creatOrc(index = null) {
        let orc = null;
        if (this.orcPool.size() > 0) {
            orc = this.orcPool.get();
        } else {
            console.log('对象池不够用，重新创建');
            orc = cc.instantiate(this.orc);
        }
        orc.y = 0;
        orc.x = this.map.width + orc.width;
        // 赋值（兽人速度）
        if (index) {
            // if (index > 10) index = 10;
            // orc.moveSpeed = 2 + 0.8 * index;
            // orc.getChildByName('node').getComponent(dragonBones.ArmatureDisplay).timeScale = 2 - index * 0.1;

            if (index <= 10) {
                orc.moveSpeed = 2 + 0.8 * index;
                orc.getChildByName('node').getComponent(dragonBones.ArmatureDisplay).timeScale = 2 - index * 0.1;
            } else {
                orc.moveSpeed = 6 - 0.3 * (index - 10);
                orc.getChildByName('node').getComponent(dragonBones.ArmatureDisplay).timeScale = 2 - (index - 10) * 0.1;
            }
            // console.log('兽人速度赋值', orc.moveSpeed, index);
        }
        orc.parent = this.map;
    },
    // 制造道具兽人
    creatPropOrc(typeNode) {
        let orc = cc.instantiate(typeNode);
        orc.y = 0;
        orc.x = this.map.width + orc.width;
        orc.moveSpeed = parseInt(5 * Math.random()) + 5;
        orc.getChildByName('node').getComponent(dragonBones.ArmatureDisplay).timeScale = 2 - (orc.moveSpeed / 5) * 0.2;
        orc.parent = this.map;
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.game = this;

        //碰撞系统
        const managerCollis = cc.director.getCollisionManager();
        managerCollis.enabled = true;
        // 开启碰撞系统的调试线框绘制
        // managerCollis.enabledDebugDraw = true;
        // managerCollis.enabledDrawBoundingBox = true;

        // ball 脚本
        this.balljs = this.ball.getComponent('Ball');

        // 使用兽人对象池
        this.creatOrcPool();

        // 使用粒子对象池
        this.creatBloodPool();
    },

    start() {
        this.node.on('touchstart', () => {
            if (Global.gameInfo.state == 'over' || this.pauseGame) return;

            this.balljs.value = 3;
            // this.balljs.bg_speed *= 2;
            // if (this.balljs.bounce > 0) 
            this.balljs.bounce = -Math.abs(this.balljs.bounce);

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