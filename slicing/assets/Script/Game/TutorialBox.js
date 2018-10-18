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
    restBox() {
        this.cuted = false;
        this.node.rotation = 0;
        this.isPause = false;
        // 子节点重置 
        this.maskDown.y = this.maskTop.y = 0;
        this.maskDown.rotation = this.maskTop.rotation = this.maskDownBox.rotation = this.maskTopBox.rotation = 0;
        this.maskDown.anchorY = this.maskTop.anchorY = 0.5;
        this.node.opactiy = 255;

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

    // 切中之后处理
    cutHandle(type) {
        this.cuted = true;
        Global.tutorial.tipSwitch('~');
        // console.log('y轴', this.bounce);
        let computed = (num) => {
            let size = Math.sqrt(20000);
            
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


            // 切中变透明
            this.node.runAction(cc.fadeTo(0.2, 160));
            // 短震
            Global.game.shortShockMove();

            if (this.bounce > 0) {
                if (Global.gameInfo.hit > 0) {
                    Global.game.tipSwitch(`连击 +${Global.gameInfo.hit}`);
                    cc.audioEngine.play(Global.game.hitAudio, false); // 播放音频
                } else {
                    cc.audioEngine.play(Global.game.boxAudios[0], false); // 播放音频
                }
                Global.gameInfo.hit += 1;
                Global.game.updateMoney();
            } else {
                cc.audioEngine.play(Global.game.boxAudios[0], false); // 播放音频
                Global.gameInfo.hit = 0;
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
    },
    // 判断是否切中
    isCut() {
        let h = this.node.height / 2;
        // 上方切割线
        // if (this.node.y < h + 100 && this.node.y > h && Global.gameInfo.triple) {
        //     this.cutHandle('top');
        // }
        // 中间切割线
        if (this.node.y < h && this.node.y > -h) {
            this.cutHandle('center');
        }
        // 下方切割线
        // if (this.node.y < -h && this.node.y > -(h + 100) && Global.gameInfo.triple) {
        //     this.cutHandle('bottom');
        // }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.restBox();
        this.range = parseInt(this.node.parent.height / 1.5);
    },

    // start () {},

    update (dt) {
        if (this.node.y > -10 && !this.cuted && !Global.tutorial.click) {
            // console.log('执行');
            if (!this.isPause) {
                this.isPause = true;
                switch (Global.tutorial.step) {
                    case 1:
                        Global.tutorial.tipSwitch('点击屏幕进行切割', true);
                        break;
                    case 2:
                        Global.tutorial.tipSwitch('当上升时切断可以连击', true);
                        break;
                    case 3:
                        Global.tutorial.tipSwitch('连击可以获得金币', true);
                        break;
                    case 4:
                        Global.tutorial.tipSwitch('连续点击屏幕', true);
                        break;
                    case 5:
                        Global.tutorial.tipSwitch('继续点击', true);
                        break;
                }
            }
            return;
        }

        // 判断是否切割
        if (Global.tutorial.click && !this.cuted) this.isCut();

        this.bounce -= Global.gameInfo.speed;
        this.node.y += this.bounce * Global.gameInfo.speed;
        this.node.x += this.deviation * Global.gameInfo.speed;

        // 旋转
        this.node.rotation += this.rotationVal * Global.gameInfo.speed;
        if (this.node.rotation >= 360) this.node.rotation = 0;

        // 判断节点回收
        if (this.node.y <= -this.range) {
            this.node.destroy();
        }
        // 节点分离（碎片）
        if (this.cuted) {
            this.maskDown.y -= 5 * Global.gameInfo.speed;
            this.maskTop.y += 5 * Global.gameInfo.speed;
        }
    },
});
