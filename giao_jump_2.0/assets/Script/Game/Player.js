const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        map: {
            default: null,
            type: cc.Node
        },
        // 跳板
        plate: {
            default: null,
            type: cc.Prefab
        },
        // 分数值
        scoreLabel: {
            default: null,
            type: cc.Node
        },
        // 天梯
        highLadder: {
            default: null,
            type: cc.Prefab
        },
        // 竹蜻蜓
        dragonfly: {
            default: null,
            type: cc.Prefab
        },
        // 充能道具
        rocket: {
            default: null,
            type: cc.Prefab
        },
        // 陨石
        aerolite: {
            default: null,
            type: cc.Prefab
        },
        // 音效
        yigui: {
            default: null,
            type: cc.AudioClip
        },
        yaho: {
            default: null,
            type: cc.AudioClip
        },
        wodigiao: {
            default: null,
            type: cc.AudioClip
        },
        beibang: {
            default: null,
            type: cc.AudioClip
        },
        giao: {
            default: null,
            type: cc.AudioClip
        },
        hoho: {
            default: null,
            type: cc.AudioClip
        }
    },
    // 复活动画
    reviveMove() {
        Global.game.reviveBox.getChildByName('text').getComponent(cc.Label).string = this.revive;
        Global.game.reviveBox.runAction(cc.moveTo(0.3, 0, 359));
        this.scheduleOnce(() => {
            Global.game.reviveBox.runAction(cc.moveTo(0.3, 420, 359));
        }, 1);
        // action.easing(cc.easeOut(3.0));
    },
    // 创建陨石下落
    creatAerolite() {
        // console.log('========>创建陨石');
        let aer = cc.instantiate(this.aerolite);
        let _y = this.node.y + Global.game.node.height;
        // 随机左右位置
        let _x = parseInt(5 * Math.random());
        aer.x = _x * (this.map.width / 5) + aer.width / 2;
        aer.y = _y;
        // aer.x = this.node.x + this.map.width/2;
        aer.parent = this.map;
        let finished = cc.callFunc(() => {
            aer.destroy();
        }, this);
        let action = cc.moveBy(4, 0, -Global.game.node.height);
        let seq = cc.sequence(action, finished);
        aer.runAction(seq);
    },
    // 创建竹蜻蜓
    creatDragonfly() {
        let dragonfly = cc.instantiate(this.dragonfly);
        let _x = parseInt((this.map.width - dragonfly.width) * Math.random()) + dragonfly.width / 2;
        dragonfly.x = _x;
        dragonfly.y = Global.gameInfo.plateMinHeight - 150;
        dragonfly.parent = this.map;
    },
    // 制造天梯道具
    creatHighLadder(num = 1) {
        let highLadder = cc.instantiate(this.highLadder);
        highLadder.x = this.map.width / 2;
        highLadder.y = Global.gameInfo.plateMinHeight * num - 200;
        let seq = cc.sequence(cc.scaleTo(0.2, 1.2, 1), cc.scaleTo(0.2, 1));
        var action = cc.repeatForever(seq);
        highLadder.runAction(action);
        highLadder.parent = this.map;
        // console.log(highLadder.name);
    },
    // 更改分数
    setScore() {
        Global.gameInfo.topScore = this.node.y > 0 ? this.node.y : 0;
        this.scoreLabel.getComponent(cc.Label).string = Global.numFormat(Global.gameInfo.topScore);
        if (!this.labelMove) {
            this.labelMove = true;
            let action = cc.scaleTo(0.3, 1.5);
            action.easing(cc.easeExponentialOut(3.0));
            this.scoreLabel.runAction(action);
        }
    },
    // 创建跳板
    creatPlate(first) {
        const spacing = Global.gameInfo.distance;
        const mapWidth = this.map.width;
        const lineNum = 5;
        if (Global.gameInfo.level > 40) this.creatAerolite();
        // 单个跳板
        let single = () => {
            let plate = cc.instantiate(this.plate);
            plate.y = Global.gameInfo.plateMinHeight;
            let type = 0;
            // 随难度系数缩短跳板
            if (Global.gameInfo.level <= 10) {
                plate.width = plate.getComponent(cc.BoxCollider).size.width = 160;
                type = parseInt(6 * Math.random());
            } else if (Global.gameInfo.level > 10 && Global.gameInfo.level <= 20) {
                type = parseInt(7 * Math.random());
            } else if (Global.gameInfo.level > 20) {
                plate.width = plate.getComponent(cc.BoxCollider).size.width = 130;
                type = parseInt(8 * Math.random());
            } else if (Global.gameInfo.level > 50) {
                plate.width = plate.getComponent(cc.BoxCollider).size.width = 100;
                type = parseInt(8 * Math.random());
            }

            // 随机左右位置
            let _x = parseInt(lineNum * Math.random());
            plate.x = _x * (mapWidth / lineNum) + mapWidth / (lineNum * 2);
            // console.log('随机数', _x, '偏移值', plate.x);

            switch (type) {
                case 7:
                    // 左右移动
                    plate.name = 'plate-lr';
                    plate.color = cc.hexToColor('#ff41d5');
                    break;
                case 6:
                    // 踩一次就消失 
                    plate.name = 'plate-one';
                    plate.color = cc.hexToColor('#000000');
                    break;
                case 5:
                    // 5倍高度 
                    plate.name = 'plate-5';
                    plate.color = cc.hexToColor('#41ff72');
                    break;
                case 4: case 3:
                    // 3倍高度 
                    plate.name = 'plate-3';
                    plate.color = cc.hexToColor('#4141ff');
                    break;
                default:
                    plate.name = 'plate-1';
                    plate.color = cc.hexToColor('#FFD600');
                    break;
            }
            // 输出到对应容器
            plate.parent = this.map;
            Global.gameInfo.plateMinHeight += spacing;

            // 判断是否第一次生成跳板
            if (first) {
                let plateFrist = this.map.children[0];
                let _x = parseInt(2 * Math.random()) == 0 ? 0 : 4;
                plateFrist.x = _x * (mapWidth / lineNum) + mapWidth / (lineNum * 2);
            }
        }
        for (let i = 0; i < 10; i++) single();
        // 难度系数上升
        Global.gameInfo.level += 1;

        let plates = this.map.children;
        if (plates.length > 30) {
            // console.log('清除下面的跳板');
            for (let i = 0; i < 10; i++) {
                plates[i].destroy();
            }
        }
    },
    // 创建天梯跳板
    creatHighPlate() {
        let plates = this.map.children;
        for (let i = 0; i < plates.length; i++) plates[i].runAction(cc.scaleTo(0.3, 0));

        let singleWidth = 400;
        // 单个生成
        let single = () => {
            let highPlate = new cc.Node('plate');
            let sp = highPlate.addComponent(cc.Sprite);
            highPlate.addComponent(cc.BoxCollider);
            sp.sizeMode = 0;
            highPlate.height = 10;
            cc.loader.loadRes('white', cc.SpriteFrame, (err, res) => sp.spriteFrame = res);
            highPlate.color = cc.hexToColor('#F35A5A');

            let prop = cc.instantiate(this.rocket);
            highPlate.width = highPlate.getComponent(cc.BoxCollider).size.width = singleWidth;
            highPlate.x = this.map.width / 2;
            highPlate.y = Global.gameInfo.plateMinHeight;
            highPlate.scale = 0;

            // 添加道具到跳板上
            prop.y = prop.height / 2;
            let randomx = parseInt(3 * Math.random());
            switch (randomx) {
                case 2:
                    prop.x = singleWidth / 2;
                    break;
                case 1:
                    prop.x = -(singleWidth / 2);
                    break;
                default:
                    prop.x = 0;
                    break;
            }
            prop.parent = highPlate;

            // plateMinHeight增加
            Global.gameInfo.plateMinHeight += Global.gameInfo.distance;

            // 输出到对应容器
            highPlate.parent = this.map;
            highPlate.runAction(cc.scaleTo(0.3, 1));
        }
        this.scheduleOnce(() => {
            // 清除所有的节点
            this.map.destroyAllChildren();
            // 生成天梯跳板
            for (let i = 0; i < 28; i++) single();

            // 重置数据
            this.scheduleOnce(() => {
                this.actionMove = true;
                this.creatHigh = false;
                Global.game.bounce = 0;
                Global.game.slideMove(this, true);
            }, 0.3);
        }, 0.3);
        // 难度系数上升
        Global.gameInfo.level += 1;
    },
    // 碰撞检测
    onCollisionEnter(other, self) {
        if (Global.gameInfo.over) return;
        let str = other.node.name;
        // 初始化地板碰撞
        if (str == 'floor') {
            if (Global.gameInfo.state == 'normal') {
                if (Global.gameInfo.progressVal >= 10 && this.revive != 0) {
                    console.log('有火箭自动复活');
                    this.revive -= 1;
                    this.actionMove = true;
                    this.reviveMove();
                    Global.game.slideMove(this);
                } else {
                    Global.game.gameOver();
                }
            } else {
                Global.game.bounce = Global.gameInfo.distance;
            }
        }
        // 碰到陨石
        else if (str == 'aerolite') {
            // 判断火箭加速状态下
            if (this.rocketRunning) {
                other.node.stopAllActions();
                let direction = parseInt(2 * Math.random()) == 1 ? true : false;
                let spawn = null;
                if (direction) {
                    spawn = cc.spawn(cc.rotateTo(0.2, -90), cc.moveBy(0.3, this.map.width, 0));
                } else {
                    spawn = cc.spawn(cc.rotateTo(0.2, 90), cc.moveBy(0.3, -this.map.width, 0));
                }
                let seq = cc.sequence(spawn, cc.callFunc(() => {
                    other.node.destroy();
                }, this));
                other.node.runAction(seq);
            } else {
                other.node.stopAllActions();
                this.node.stopAllActions();
                Global.game.gameOver();
            }
        }
        // 吃到竹蜻蜓
        else if (str == 'dragonfly') {
            if (this.actionMove) return;
            if (this.fiveJump) clearTimeout(this.fiveJump);
            this.actionMove = true;
            other.node.destroy();
            Global.game.bounce = 60;
            cc.audioEngine.play(this.beibang, false);

            this.node.stopAllActions(); //停止五倍跳跃的动画
            // 竹蜻蜓动画
            let fly = this.node.getChildByName('dragonfly');
            let down = cc.spawn(cc.moveBy(0.3, 0, -100), cc.fadeIn(0.2));
            let top = cc.spawn(cc.moveBy(0.3, 0, 100), cc.fadeOut(0.2));
            fly.runAction(down);
            // 主角动画
            let action = cc.moveBy(2, 0, 3000);
            action.easing(cc.easeInOut(2.0));
            this.node.runAction(action);

            this.flyJump = setTimeout(() => {
                Global.game.bounce = 0;
                this.actionMove = false;
                this.isFiveMove = false;
                fly.runAction(top);
            }, 2000);
        }
        // 吃到道具
        else if (str == 'rocket') {
            other.node.destroy();
            Global.game.checkProgress(1);
            cc.audioEngine.play(this.hoho, false);
        }
        // 碰到天梯道具
        else if (str == 'highLadder') {
            // other.node.destroy();

            Global.game.bounce = 60;
            this.actionMove = true;
            this.creatHigh = true;

            // 清除所有的定时任务
            if (Global.game.rocketEnd) clearTimeout(Global.game.rocketEnd);
            if (this.fiveJump) {
                clearTimeout(this.fiveJump);
                this.isFiveMove = false;
            }
            if (this.flyJump) clearTimeout(this.flyJump);

            // 停止所有动作并重置道具的位置
            this.node.stopAllActions();
            Global.game.node.stopAllActions();
            Global.game.node.getChildByName('fanatical').stopAllActions();
            this.node.getChildByName('left').stopAllActions();
            this.node.getChildByName('right').stopAllActions();
            Global.game.node.getChildByName('fanatical').opacity = 0;
            // 左右两边动画结束
            let spawnToLeft2 = cc.spawn(cc.moveTo(0.3, -175, -54), cc.fadeOut(0.3));
            let spawnToRight2 = cc.spawn(cc.moveTo(0.3, 175, -54), cc.fadeOut(0.3));
            this.node.getChildByName('left').runAction(spawnToLeft2);
            this.node.getChildByName('right').runAction(spawnToRight2);
            // 头顶竹蜻蜓
            this.node.getChildByName('dragonfly').runAction(cc.spawn(cc.moveTo(0.3, 0, 177), cc.fadeOut(0.3)));

            // 设置跳板生成高度
            Global.gameInfo.plateMinHeight = this.node.y - Global.gameInfo.distance;

            // 创建天梯
            this.creatHighPlate();
        }
        // 碰到跳板类型
        else if (str.includes('plate')) {
            // 差不多到达顶端之后才能有碰撞回调
            if (Global.game.bounce > 50) return;
            // 设备震动
            if (window.wx) wx.vibrateShort();
            switch (str) {
                case 'plate-3':
                    Global.game.bounce = Global.gameInfo.distance * 1.5;
                    cc.audioEngine.play(this.yaho, false);
                    break;
                case 'plate-5':
                    cc.audioEngine.play(this.wodigiao, false);
                    // 动画加速
                    this.isFiveMove = true;
                    Global.game.bounce = 60;

                    let upMove = cc.moveBy(8, 0, 3000);
                    upMove.easing(cc.easeExponentialOut());

                    this.fiveJump = setTimeout(() => {
                        Global.game.bounce = 0;
                        // console.log('完成');
                        this.node.stopAllActions();
                        this.isFiveMove = false;
                    }, 1500);
                    this.node.runAction(upMove);
                    break;
                case 'plate-one':
                    Global.game.bounce = Global.gameInfo.distance;
                    other.node.destroy();
                    break;
                default:
                    Global.game.bounce = Global.gameInfo.distance;
                    cc.audioEngine.play(this.giao, false);
                    break;
            }
            Global.gameInfo.state = 'normal';
            console.log('当前难度等级', Global.gameInfo.level);
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 可复活次数
        this.revive = 3;
        // 背景检测帧数计数
        this.count = 0;
    },

    // start() {

    // },

    update(dt) {
        if (Global.gameInfo.over) return;

        // 如果是动画加速就不执行
        if (!this.actionMove && !this.isFiveMove) {
            let val = 11;
            Global.game.bounce -= val;
            let num = Math.floor(Global.game.bounce / val) > val * 2 ? val * 2 : Math.floor(Global.game.bounce / val);
            // console.log(num);
            this.node.y += num + num * Global.gameInfo.speed;
        }

        // 更新分数
        if (Global.gameInfo.topScore < this.node.y) {
            this.setScore();
        } else {
            if (this.labelMove) {
                this.labelMove = false;
                let action = cc.scaleTo(0.3, 1);
                action.easing(cc.easeExponentialOut(3.0));
                this.scoreLabel.runAction(action);
            }
        }

        // 小于一个屏幕就生成跳板
        if (this.node.y + Global.game.node.y * 2 > Global.gameInfo.plateMinHeight && !this.creatHigh) {
            console.log('小于一个屏幕生成跳板');
            this.creatPlate();
        }

        // 检测背景移动
        this.count += 1;
        if (this.count == 30) {
            this.count = 0;
            Global.game.checkBackground();
        }
    },
});