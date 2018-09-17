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
        // 黑洞
        blackHole: {
            default: null,
            type: cc.Prefab
        }
    },
    // 制造黑洞
    creatBlackHole() {
        let blackHole = cc.instantiate(this.blackHole);
        blackHole.x = this.map.width / 2;
        blackHole.y = Global.gameInfo.plateMinHeight - 200;
        let seq = cc.sequence(cc.scaleTo(0.2, 1.2, 0.8), cc.scaleTo(0.2, 0.8, 1.2));
        var action = cc.repeatForever(seq);
        blackHole.runAction(action);
        blackHole.parent = this.map;
    },
    // 更改分数
    setScore() {
        Global.gameInfo.topScore = this.node.y;
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
        // 单个跳板
        let single = () => {
            let plate = cc.instantiate(this.plate);
            plate.y = Global.gameInfo.plateMinHeight;

            // 随难度系数缩短跳板
            if (Global.gameInfo.level <= 4) {
                plate.width = plate.getComponent(cc.BoxCollider).size.width = 160;
            } else if (Global.gameInfo.level > 4 && Global.gameInfo.level <= 8) {
                plate.width = plate.getComponent(cc.BoxCollider).size.width = 130;
            } else if (Global.gameInfo.level > 8) {
                plate.width = plate.getComponent(cc.BoxCollider).size.width = 100;
            }

            // 随机左右位置
            let _x = parseInt(lineNum * Math.random());
            plate.x = _x * (mapWidth / lineNum) + mapWidth / (lineNum * 2);
            // console.log('随机数', _x, '偏移值', plate.x);
            
            let type = parseInt((Global.gameInfo.level + 3) * Math.random());
            switch (type) {
                case 7: 
                    // 踩一次就消失 
                    plate.name = 'plate-7';
                    plate.color = cc.hexToColor('#000000');
                    break;
                case 6: 
                    // 左右移动
                    plate.name = 'plate-6';
                    plate.color = cc.hexToColor('#ff41d5');
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
                // default:
                    
                //     break;
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
        Global.gameInfo.level = Global.gameInfo.level < 7 ? Global.gameInfo.level + 1 : 7;
        
        let plates = this.map.children;
        if (plates.length > 30) {
            // console.log('清除下面的跳板');
            for (let i = 0; i < 10; i++) {
                plates[i].destroy();
            }
        }
    },
    onCollisionEnter(other, self) {
        if (Global.gameInfo.over) return;
        let str = other.node.name;
        // 初始化地板碰撞
        if (str == 'floor') {
            if (Global.gameInfo.state == 'normal') {
                Global.game.gameOver();
            } else {
                Global.game.bounce = Global.gameInfo.distance;
            }
        } 
        // 吃到道具
        else if (str == 'rocket') {
            Global.game.checkProgress(1);
            other.node.destroy();
        } 
        // 碰到黑洞
        else if (str == 'black_hole') {
            cc.log('进入黑洞模式');
            this.node.stopAllActions();
            Global.gameInfo.over = true;
            Global.gameInfo.state = 'space';
            // 动画回调
            let finished = cc.callFunc(() => {
                cc.log('进入黑洞模式');
                cc.director.loadScene('Space');
            }, this);
            let spa = cc.spawn(cc.fadeOut(0.3), cc.scaleTo(0.3, 0, 0));
            let seq = cc.sequence(
                cc.scaleTo(0.2, 0.8, 1.2),
                cc.scaleTo(0.2, 1.2, 0.8),
                cc.scaleTo(0.2, 0.8, 1.2),
                cc.scaleTo(0.2, 1.2, 0.8),
                cc.scaleTo(0.2, 0.8, 1.2),
                cc.scaleTo(0.2, 1.2, 0.8), spa, finished);
            this.node.runAction(seq);
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
                    break;
                case 'plate-5':
                    // 动画加速
                    this.actionMove = true;
                    Global.game.bounce = 60;

                    let upMove = cc.moveBy(7, 0, 3000);
                    // upMove.easing(cc.easeElasticOut(3.0));
                    // upMove.easing(cc.easeExponentialOut());
                    // upMove.easing(cc.easeBezierAction(0, 0, .47, .99));
                    upMove.easing(cc.easeExponentialOut());

                    this.scheduleOnce(() => {
                        Global.game.bounce = 0;
                        console.log('完成');
                        this.node.stopAction(upMove);
                        this.actionMove = false;
                    }, 1.5);
                    this.node.runAction(upMove);

                    // Global.game.bounce = Global.gameInfo.distance * 5;  // 匀速
                    break;
                case 'plate-7':
                    Global.game.bounce = Global.gameInfo.distance;
                    other.node.destroy();
                    break;
                default :
                    Global.game.bounce = Global.gameInfo.distance;
                    break;
            }
            Global.gameInfo.state = 'normal';
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        
    },
    
    start() {
        
    },

    update(dt) {
        if (Global.gameInfo.over) return;

        // 如果是动画加速就不执行
        if (!this.actionMove) {
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
        if (this.node.y + Global.game.node.y * 2 > Global.gameInfo.plateMinHeight) {
            console.log('小于一个屏幕生成跳板');
            this.creatPlate();
        }
        
    },
});