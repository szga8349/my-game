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
        // 跳板
        plate: {
            default: null,
            type: cc.Prefab
        },
        // 道具
        rocket: {
            default: null,
            type: cc.Prefab
        }
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
        this.plateMinHeight = 0;

        // let plate = cc.instantiate(this.plate);
        // plate.getComponent(cc.BoxCollider).destroy();
        // plate.getComponent('Plate').destroy();

        // console.log(plate);
        
        let single = () => {
            let plate = cc.instantiate(this.plate);
            // 这里清除掉的组件还是会执行（后续要换掉）
            plate.getComponent(cc.BoxCollider).destroy();
            plate.getComponent('Plate').destroy();
            plate.space = true;
            plate.y = this.plateMinHeight;
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

    onLoad () {
        this.checkProgress();
        this.readyGo();
        this.creatProp();
    },

    start () {
        this.node.on('touchmove', this.dragMove, this);
    },

    // update (dt) {},
});
