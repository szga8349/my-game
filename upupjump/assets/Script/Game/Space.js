const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },
        // 能量条
        progress: {
            default: null,
            type: cc.Node
        },
        // 准备提示
        prompt: {
            default: null,
            type: cc.Node
        },
        // 跳板容器
        map: {
            default: null,
            type: cc.Node
        },
        // 道具
        rocket: {
            default: null,
            type: cc.Prefab
        },
        // 黑洞
        blackHole: {
            default: null,
            type: cc.Node
        },
        bmg: {
            default: null,
            type: cc.AudioClip
        }
    },
    // 创建一个新的跳板节点
    newPlate() {
        let plate = new cc.Node('plate');
        let sp = plate.addComponent(cc.Sprite);
        plate.height = 10;
        plate.y = this.plateMinHeight;
        sp.sizeMode = 0; // CUSTOM
        // 图片加载
        cc.loader.loadRes('white', cc.SpriteFrame, (err, res) => sp.spriteFrame = res);
        return plate;
    },
    // 创建道具
    creatProp() {
        // 重置跳板容器
        this.map.width = this.node.width;
        this.map.height = this.node.height;
        this.map.x = -(this.node.width / 2);
        this.map.y = this.node.height / 2;
        // 
        const spacing = Global.gameInfo.distance;
        const mapWidth = this.map.width;
        const lineNum = 5;
        // 设置一个跳板容器的实际高度
        this.plateMinHeight = 10;

        let single = () => {
            let plate = this.newPlate();
            // 输出道具到跳板上
            let prop = cc.instantiate(this.rocket);
            prop.parent = plate;

            // 随难度系数缩短跳板
            if (Global.gameInfo.level <= 4) {
                plate.width = 160;
            } else if (Global.gameInfo.level > 4 && Global.gameInfo.level <= 8) {
                plate.width = 130;
            } else if (Global.gameInfo.level > 8) {
                plate.width = 100;
            }

            // 随机左右位置
            let _x = parseInt(lineNum * Math.random());
            plate.x = _x * (mapWidth / lineNum) + mapWidth / (lineNum * 2);
            // console.log('随机数', _x, '偏移值', plate.x);

            let type = parseInt(8 * Math.random());
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
                default:
                    plate.name = 'plate-1';
                    plate.color = cc.hexToColor('#FFD600');
                    break;
            }
            // 输出到对应容器
            plate.parent = this.map;
            this.plateMinHeight += spacing;
        }
        for (let i = 0; i < 50; i++) single();
    },
    // 开始准备提示
    readyGo() {
        let finished = cc.callFunc(() => {
            this.startPlayer = true;
            this.prompt.destroy();
            cc.audioEngine.play(this.bmg, false);
            let action = cc.moveBy(10, 0, -(this.plateMinHeight + this.node.height));
            this.map.runAction(action);
            this.scheduleOnce(() => {
                this.spaceEnd();
            }, 10);
        }, this);
        let spa = cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.4, 1));
        let seq = cc.sequence(
            cc.scaleTo(0.2, 2),
            cc.scaleTo(0.4, 1), cc.callFunc(() => { this.prompt.getComponent(cc.Label).string = 2; }, this),
            cc.scaleTo(0.2, 2),
            cc.scaleTo(0.4, 1), cc.callFunc(() => { this.prompt.getComponent(cc.Label).string = 1; }, this),
            cc.scaleTo(0.2, 2),
            cc.scaleTo(0.4, 1), cc.callFunc(() => { this.prompt.getComponent(cc.Label).string = 'GO'; }, this),
            cc.scaleTo(0.2, 2),
            spa, finished);
        this.prompt.runAction(seq);
    },
    // 狂热模式结束
    spaceEnd() {
        Global.gameInfo.state = 'space';
        this.startPlayer = false;
        let spawn = cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.7, 1), cc.rotateBy(2, 720));
        // let seq = cc.sequence(spawn, cc.scaleTo(0.1, 0.5), cc.scaleTo(0.3, 1));
        spawn.easing(cc.easeInOut(3.0));
        this.blackHole.runAction(spawn);
        this.player.runAction(cc.spawn(cc.moveTo(1, this.blackHole.x, this.blackHole.y), cc.scaleTo(1, 0)));
        this.scheduleOnce(() => {
            console.log('Space', Global.gameInfo);
            cc.director.loadScene('Game');
        }, 1);
    },
    // 进度条更新
    checkProgress(num = 0) {
        let val = this.progress.getChildByName('val').getComponent(cc.Label);
        let line = this.progress.getChildByName('line');
        Global.gameInfo.progressVal += Number(num);
        line.height = 50 * Global.gameInfo.progressVal < 500 ? 50 * Global.gameInfo.progressVal : 500;
        val.string = parseInt(Global.gameInfo.progressVal / 10);
    },
    // 拖拽移动
    dragMove(event) {
        if (!this.startPlayer) return;
        let padding = this.player.width / 2;
        let _width = this.node.width / 2;
        // 第一种拖拽
        let delta = event.touch.getDelta();
        this.player.x += delta.x;
        if (this.player.x >= _width - padding) this.player.x = _width - padding;
        if (this.player.x < -(_width - padding)) this.player.x = -(_width - padding);

        // 第二种拖拽
        // let locationv = event.getLocation();
        // let location = this.node.convertToNodeSpaceAR(locationv);
        // // 不移出屏幕
        // let minX = -_width + padding,
        //     maxX = -minX;
        // if (location.x < minX) location.x = minX;
        // if (location.x > maxX) location.x = maxX;
        // this.player.setPosition(location.x, this.player.y);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.space = this;
        this.checkProgress();
        this.readyGo();
        this.creatProp();
        //碰撞系统
        const managerCollis = cc.director.getCollisionManager();
        managerCollis.enabled = true;
    },

    start() {
        this.node.on('touchmove', this.dragMove, this);
    },

    // update (dt) {},
});
