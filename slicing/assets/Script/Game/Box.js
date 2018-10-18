const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        maskDown: {
            default: null,
            type: cc.Node
        },
        maskDownBox: {
            default: null,
            type: cc.Node
        },
        maskTop: {
            default: null,
            type: cc.Node
        },
        maskTopBox: {
            default: null,
            type: cc.Node
        },
    },

    // 重置参数
    restBox(type = 'none') {
        this.cuted = false;
        this.node.rotation = 0;

        // 子节点重置 
        this.maskDown.y = this.maskTop.y = 0;
        this.maskDown.rotation = this.maskTop.rotation = this.maskDownBox.rotation = this.maskTopBox.rotation = 0;
        this.maskDown.anchorY = this.maskTop.anchorY = 0.5;
        this.node.opactiy = 255;

        // 图片加载
        let boxkey = parseInt(4 * Math.random());
        if (type == 'trap') {
            this.maskDownBox.getComponent(cc.Sprite).spriteFrame = Global.game.trapBox;
            this.maskTopBox.getComponent(cc.Sprite).spriteFrame = Global.game.trapBox;
        } else {
            this.maskDownBox.getComponent(cc.Sprite).spriteFrame = Global.game.boxList[boxkey];
            this.maskTopBox.getComponent(cc.Sprite).spriteFrame = Global.game.boxList[boxkey];
        }
        this.boxType = type;

        // 设置旋转
        this.rotationVal = parseInt(4 * Math.random());

        // 设置Y
        this.node.y = -(667 + this.node.height / 2);
        this.bounce = parseInt(6 * Math.random()) + 45;

        // 设置 X 随机移动位置
        let num = parseInt(5 * Math.random());
        let w = Global.game.map.width / 2;
        switch (num) {
            case 0:
                this.node.x = -w;
                this.deviation = parseInt(5 * Math.random()) + 3.5;
                break;
            case 1:
                this.node.x = -(w / 2);
                this.deviation = 3.75;
                break;
            case 2:
                this.node.x = 0;
                let d = parseInt(5 * Math.random());
                if (parseInt(2 * Math.random()) && d != 0) {
                    d = -d;
                    this.rotationVal = -this.rotationVal;
                }
                this.deviation = d;
                break;
            case 3:
                this.node.x = w / 2;
                this.deviation = -3.75;
                this.rotationVal = -this.rotationVal;
                break;
            case 4:
                this.node.x = w;
                this.deviation = -(parseInt(5 * Math.random()) + 3.5);
                this.rotationVal = -this.rotationVal;
                break;
        }
        
    },
    
    // 检测音效播放
    checkAudio() {
        if (Global.userInfo.theme == 'box-white') {
            cc.audioEngine.play(Global.game.boxAudios[0], false);
        }else if (Global.userInfo.theme.includes('fruit')) {
            cc.audioEngine.play(Global.game.boxAudios[1], false);
        } else if (Global.userInfo.theme.includes('cartoon')) {
            cc.audioEngine.play(Global.game.boxAudios[2], false);
        } else if (Global.userInfo.theme.includes('universe')) {
            cc.audioEngine.play(Global.game.boxAudios[3], false);
        } else if (Global.userInfo.theme.includes('office')) {
            cc.audioEngine.play(Global.game.boxAudios[4], false);
        }
    },

    // 切中之后处理
    cutHandle(type) {
        this.cuted = true;
        // console.log('y轴', this.bounce);
        let computed = (num) => {
            let size = Math.sqrt(20000);

            /**
             * 第一种
             * 0.5 - 1.5 轴心变化范围
             * -50 - 50 偏移变化范围
             * this.maskDown.width = this.maskDown.height = size; 这里不可以改 height
             */
            // // 向下
            // this.maskDown.width = size;
            // this.maskDown.rotation = -this.node.rotation;
            // this.maskDown.anchorY = 0.5 + (this.node.y + num + 50) / 100;
            // this.maskDownBox.rotation = this.node.rotation;
            
            // // 向上
            // this.maskTop.width = size;
            // this.maskTop.rotation = -this.node.rotation;
            // this.maskTop.anchorY = 0.5 + (this.node.y + num - 50) / 100;
            // this.maskTopBox.rotation = this.node.rotation;
            

            // 第二种（完善）
            let y = this.node.y + num;
            // 向下
            this.maskDown.width = this.maskDown.height = size;
            this.maskDown.rotation = -this.node.rotation;
            this.maskDownBox.rotation = this.node.rotation;
            this.maskDown.anchorY = (0.5 + (y + 50) / 100) - y * 0.003;
            
            // 向上
            this.maskTop.width = this.maskTop.height = size;
            this.maskTop.rotation = -this.node.rotation;
            this.maskTopBox.rotation = this.node.rotation;
            this.maskTop.anchorY = (0.5 + (y - 50) / 100) - y * 0.003;


            if (this.boxType == 'trap') {
                cc.audioEngine.play(Global.game.boomAudio, false); // 播放音频
                Global.game.tipSwitch('切到炸弹！！！');
                Global.game.shockMove(true);
                Global.game.gameOver();
            } else {
                // 切中变透明
                this.node.runAction(cc.fadeTo(0.2, 160));
                // 短震
                Global.game.shortShockMove();

                if (this.bounce > 0) {
                    if (Global.gameInfo.hit > 0) {
                        Global.game.tipSwitch(`连击 +${Global.gameInfo.hit}`);
                        cc.audioEngine.play(Global.game.hitAudio, false); // 播放音频
                        Global.game.updateMoney();
                    } else {
                        this.checkAudio();
                    }
                    Global.gameInfo.hit += 1;
                } else {
                    this.checkAudio();
                    Global.gameInfo.hit = 0;
                }
                Global.gameInfo.level_count += 1;
                if (Global.gameInfo.level_count % 10 == 0) Global.gameInfo.level += 1;
                    
                Global.game.creatBox();

                // 判断生成炸弹
                if (parseInt(10 * Math.random()) < Global.gameInfo.level && Global.gameInfo.level_count % 7 == 0) {
                    this.scheduleOnce(() => {
                       if (Global.gameInfo.state != 'over') Global.game.creatBox('trap');
                    }, 0.6);
                }

                // 判断生成三重割线
                if (Global.gameInfo.level_count % 23 == 0) {
                    this.scheduleOnce(() => {
                        if (Global.gameInfo.state != 'over') Global.game.creatProp(1);
                    }, 0.6);
                }

                // 判断生成时钟
                if (Global.gameInfo.level_count % 45 == 0) {
                    this.scheduleOnce(() => {
                        if (Global.gameInfo.state != 'over') Global.game.creatProp(0);
                    }, 0.6);
                }

                console.log('游戏难度计数', Global.gameInfo.level_count);
            } 
            Global.game.updateScore();
        }

        switch (type) {
            case 'top':
                computed(-100);
                break;
            case 'center':
                computed(0);
                break;
            case 'bottom':
                computed(100);
                break;
        }
        // 旋转处理
        this.rotationVal = 1;
        // if (this.rotationVal > 2) this.rotationVal = 2;
    },

    // 判断是否切中
    isCut() {
        let h = this.node.height / 2;
        // 上方切割线
        if (this.node.y < h + 100 && this.node.y > h && Global.gameInfo.triple) {
            this.cutHandle('top');
        }
        // 中间切割线
        if (this.node.y < h && this.node.y > -h) {
            this.cutHandle('center');
        }
        // 下方切割线
        if (this.node.y < -h && this.node.y > -(h + 100) && Global.gameInfo.triple) {
            this.cutHandle('bottom');
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.range = parseInt(this.node.parent.height / 1.5);
    },

    // start () {},

    update (dt) {
        // 判断是否切割
        if (Global.gameInfo.click && !this.cuted) this.isCut();

        // 上下移动
        this.bounce -= Global.gameInfo.speed;
        this.node.y += this.bounce * Global.gameInfo.speed;
        this.node.x += this.deviation * Global.gameInfo.speed;

        // 旋转
        this.node.rotation += this.rotationVal * Global.gameInfo.speed;
        if (this.node.rotation >= 360) this.node.rotation = 0;

        // 判断节点回收
        if (this.node.y <= -this.range) {
            // console.log('节点回收');
            Global.game.boxPool.put(this.node);
            if (!this.cuted && Global.gameInfo.state != 'over') {
                if (this.boxType != 'trap') {
                    Global.gameInfo.hp -= 1;
                    cc.audioEngine.play(Global.game.reduceAudio, false); // 播放音频
                    if (Global.gameInfo.hp < 1) {
                        Global.game.updateHp();
                        Global.game.shockMove(true);
                        Global.game.gameOver(0.1);
                        Global.game.tipSwitch('生命值为零！！！');
                    } else {
                        Global.gameInfo.level_count += 1;
                        Global.game.shockMove();
                        Global.game.updateHp();
                        Global.game.creatBox();
                        if (Global.gameInfo.level_count % 10 == 0) Global.gameInfo.level += 1; 
                    }
                }
            }
        }
        
        // 节点分离（碎片）
        if (this.cuted) {
            this.maskDown.y -= 5 * Global.gameInfo.speed;
            this.maskTop.y += 5 * Global.gameInfo.speed;
        }
        
    },
});
