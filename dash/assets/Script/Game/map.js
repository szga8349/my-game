const Global = require('Global');
const MAP = require('mapdata');

cc.Class({
    extends: cc.Component,

    properties: {
        maxIndex: 9999,
        player: {
            default: null,
            type: cc.Node,
        },
        floor: {
            default: null,
            type: cc.Prefab,
        },
        // 陷阱
        trap: {
            default: null,
            type: cc.Prefab,
        },
        floorTotal: 60
    },

    // 掉落动画
    downMove(floor) {
        if (floor.getChildByName('trap')) {
            floor.getChildByName('trap').destroy();
        }
        let action = cc.moveBy(0.5, 0, -1000);
        action.easing(cc.easeIn(3));
        floor.floorData.overMove = true;
        floor.color = cc.hexToColor('#8c8c8c');
        floor.runAction(cc.sequence(action, cc.callFunc(() => {
            this.floorPool.put(floor);
            this.createSingle();
            // 这里做继续生成地图判断
            if (this.mapList.length - 100 < this.record.num) {
                console.log('继续生成地图数据==============>');
                let key = 'r' + (parseInt(3 * Math.random()) + 7);
                this.mapList.push(...MAP[key]);
            } 
        })));
    },

    // 地板超出屏幕掉落
    fallDownFloor() {
        // console.log(this.player.scaleX); // 向右 => 1
        let nodes = this.node.children.filter(item => !item.floorData.overMove);
        for (let i = 0; i < nodes.length; i++) {
            if (this.player.x - this.node.width / 2 + 50 > nodes[i].x && nodes[i].y < this.player.y && this.player.scaleX > 0) {
                this.downMove(nodes[i]);
                this.createSingle();
            }
            if (this.player.x + this.node.width / 2 - 50 < nodes[i].x && nodes[i].y < this.player.y && this.player.scaleX < 0) {
                this.downMove(nodes[i]);
                this.createSingle();
            }
            if (this.player.y - this.node.height / 2 + 300 > nodes[i].y) {
                this.downMove(nodes[i]);
                this.createSingle();
            }
        }
    },

    // 创建对象池
    createPool() {
        this.floorPool = new cc.NodePool();
        for (let i = 0; i < this.floorTotal; i++) {
            let floor = cc.instantiate(this.floor); 
            this.floorPool.put(floor);
        }
    },

    // 获取地板
    getFloor() {
        let enemy = null;
        if (this.floorPool.size() > 0) {
            enemy = this.floorPool.get();
        } else {
            enemy = cc.instantiate(this.floor);
        }
        return enemy;
    },

    // 输出地板
    outPutFloor(obj) {
        let floor = this.getFloor();

        // 判断分岔
        if (obj.fork) {
            if (obj.fork[0].d == 'right') {
                this.forkRecord.x = this.record.x + 60;
            } else {
                this.forkRecord.x = this.record.x - 60;
            }
            this.forkRecord.y = this.record.y + 35;
            for (let i = 0; i < obj.fork.length; i++) {
                this.outPutFork(obj.fork[i], i);
            }
        }

        // 设置地板属性
        floor.floorData = obj;
        // 脚本初始化
        floor.getComponent('mapfloor').initFloor();

        floor.zIndex = this.maxIndex;
        floor.x = this.record.x;
        floor.y = this.record.y;
        floor.parent = this.node;

        // 更新下一个地板出现的位置 (记录数据)
        switch (obj.d) {
            case 'right':
                this.record.x += 60;
                break;
            case 'left':
                this.record.x -= 60;
                break;
        }
        if (obj.bottom) {
            this.record.y -= 35;
        } else {
            this.record.y += 35;
            this.maxIndex -= 1;
        }

        this.record.num += 1;
    },

    // 输出分岔
    outPutFork(obj, index) {
        let floor = this.getFloor();

        // 设置地板属性
        floor.floorData = obj;
        // 脚本初始化
        floor.getComponent('mapfloor').initFloor();

        floor.zIndex = this.maxIndex - index;
        floor.x = this.forkRecord.x;
        floor.y = this.forkRecord.y;
        floor.parent = this.node;

        // 更新下一个地板出现的位置 (记录数据)
        switch (obj.d) {
            case 'right':
                this.forkRecord.x += 60;
                break;
            case 'left':
                this.forkRecord.x -= 60;
                break;
        }

        this.forkRecord.y += 35;

        // this.record.num += 1; 暂定
    },

    // 将掉落的地板放到最后
    createSingle(num = 0) {
        if (num != 0) {
            // 执行起飞的时候执行
            for (let i = 0; i < num; i++) {
                this.outPutFloor(this.mapList[this.record.num]);
            }
        } else {
            if (this.mapList[this.record.num] && this.node.children.length < this.floorTotal + Global.gameInfo.isMaxPhone) {
                this.outPutFloor(this.mapList[this.record.num]);
            }
        }
    },

    // 一开始随机拼接地图
    randomList() {
        this.mapList = [];
        this.mapList.push(...MAP.base);
        let randomArray = array => {
            let tmp, current, top = array.length;
            if (top) while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
            return array;
        }
        let r1 = ['r1','r2','r3'], r2 = ['r4','r5','r6'], r3 = ['r7','r8','r9'];
        let newList = [...randomArray(r1), ...randomArray(r2), ...randomArray(r3)];
        for (let i = 0; i < newList.length; i++) {
            this.mapList.push(...MAP[newList[i]]);
        }
        
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.map = this;
        this.randomList();
        // 拼接道路（三个档位）
        // this.mapList = [...MAP.base, ...MAP.r2, ...MAP.r1, ...MAP.r3, ...MAP.r5, ...MAP.r6, ...MAP.r4, ...MAP.r7, ...MAP.r9, ...MAP.r8];

        // 底板记录
        this.record = {
            num: 0,
            x: 180, // 0    60
            y: -141 // -246  -71
        }
        // 地板分岔记录
        this.forkRecord = {
            x: 0,
            y: 0
        }
        this.createPool()
        // 主角一开场出现的位置 => (0, -246);
        for (let i = 0; i < this.floorTotal; i++) {
            this.outPutFloor(this.mapList[i]);
        }

    },

    // start () {},

    // update (dt) {},
});
