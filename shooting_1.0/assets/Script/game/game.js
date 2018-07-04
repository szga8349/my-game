const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 开始按钮
        startBtn: {
            default: null,
            type: cc.Node
        },
        // 暂停
        puaseBtn: {
            default: null,
            type: cc.Node
        },
        // 游戏开始遮罩层(这里我设成了一个全屏按钮，这样就不用初始化添加事件柄了) 
        coverBox: {
            default: null,
            type: cc.Node
        },
        // 飞机
        player: {
            default: null,
            type: cc.Node
        },
        // 分数label
        scoreText: {
            default: null,
            type: cc.Label
        },
        // 方块的容器
        blockBox: {
            default: null,
            type: cc.Node
        },
        // 生成的方块资源
        blockPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 道具包资源
        propPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // Method:

    initGame() {
        this.coverBox.active = false;
        // 添加触摸事件
        this.onDrag();
        Global.gameData.over = false;
        // 方块定时生成
        this.createBlockList(5);
        this.schedule(() => {
            if (Global.gameData.level >= 3) {
                this.createBlockList(5, true);
            } else {
                this.createBlockList(5);
            }
        }, 1.5);
        // 道具定时派出
        // this.createProp()
        this.schedule(() => {
            this.createProp();
        }, 18 / Global.gameData.level);
    },
    // 开始游戏
    startGame() {
        cc.director.resume();
        this.puaseBtn.active = true;
        this.startBtn.active = false;
        this.onDrag();
    },
    // 暂停游戏
    pauseGame() {
        if (Global.gameData.over) return;
        cc.director.pause();
        this.startBtn.active = true;
        this.puaseBtn.active = false;
        this.offDrag();
    },
    // 游戏结束
    gameEnd() {
        console.log('游戏结束~');
        cc.director.pause();
        this.offDrag();
        Global.gameData.over = true;
        setTimeout(() => {
            cc.director.loadScene('rank', () => {
                console.log('重置游戏了~');
                cc.director.resume();
            });
        }, 1000);
    },
    // 游戏得分
    getScore() {
        Global.gameData.score += 1;
        this.scoreText.string = Global.gameData.score;
    },
    // 添加拖动监听
    onDrag() {
        this.player.on('touchmove', this.dragMove, this);
    },
    // 清除拖动监听
    offDrag() {
        this.player.off('touchmove', this.dragMove, this);
    },
    // 设置飞机拖拽
    dragMove(event) {
        if (Global.gameData.over) return;
        let locationv = event.getLocation();
        let location = this.node.convertToNodeSpaceAR(locationv);
        // 飞机不移出屏幕 
        let minX = -this.node.width / 2 + this.player.width / 6,
            maxX = -minX,
            minY = -this.node.height / 2 + this.player.height / 6,
            maxY = -minY;
        if (location.x < minX) location.x = minX;
        if (location.x > maxX) location.x = maxX;
        if (location.y < minY) location.y = minY;
        if (location.y > maxY) location.y = maxY;
        this.player.setPosition(location);
    },
    // 创建道具包
    createProp() {
        let newProp = cc.instantiate(this.propPrefab);
        let _x = parseInt((this.blockBox.width - newProp.width) * Math.random()) + 1 + newProp.width,
            _y = this.blockBox.height + newProp.height;
        newProp.setPosition(_x, _y);
        this.blockBox.addChild(newProp);
        // 设置方块初始速度
        newProp.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -200);
    },
    // 方块对象池
    blockObjGroup() {
        Global.gameData.blockPool = new cc.NodePool();
        let initCount = 50;
        for (let i = 0; i < initCount; ++i) {
            let block = cc.instantiate(this.blockPrefab);
            Global.gameData.blockPool.put(block);
        }
    },
    /** 
     * 创建方块（单个）
     * num: 一列个数
     * parentNode：父节点
     * key：当前位置
     * x：x坐标
     * y：y坐标
     * score：当个方块的分数
     * needSpeed: 是否要左右偏移
    */
    createBlock(num = 4, parentNode, key = 1, x, score = 1, needSpeed, y) {
        let block = null;
        let _w = this.node.width / num;
        let _x = x || 0;
        let _y = y || this.node.height + _w;
        let oddArr = [{ r: 255, g: 235, b: 59 }, { r: 255, g: 87, b: 34 }, { r: 233, g: 30, b: 99 }],
            evenArr = [{ r: 96, g: 125, b: 139 }, { r: 0, g: 151, b: 167 }, { r: 0, g: 150, b: 136 }];
        let colorKey = Math.floor(score / 3) - 1 > 0 ? Math.floor(score / 3) - 1 : 0;
        let type = parseInt(2 * Math.random());
        let xSpeed = 0;
        if (needSpeed) xSpeed = type == 0 ? parseInt(300 * Math.random()) : parseInt(-300 * Math.random());
        
        // console.log(colorKey);
        
        if (Global.gameData.blockPool.size() > 0) {
            block = Global.gameData.blockPool.get();
        } else {
            block = cc.instantiate(this.blockPrefab);
        }
        // 设置宽高
        block.width = block.height = _w;
        // 设置颜色
        if (key % 2 == 0) {
            block.color = new cc.Color(oddArr[colorKey]);
        }else{
            block.color = new cc.Color(evenArr[colorKey]);
        }
        // 设置定位
        block.setPosition(_x, _y);
        // 子节点分数
        block.getChildByName('boxtext').getComponent(cc.Label).string = score;
        // 将生成的敌人加入节点树
        block.parent = parentNode; 
        // 设置方块初始速度
        block.getComponent(cc.RigidBody).linearVelocity = cc.v2(xSpeed, -400);
        // console.log(block.color, new cc.Color(oddArr[colorKey]));
    },
    // 生成一列方块
    createBlockList(num, needSpeed) {
        let _w = this.node.width / num;
        for (let i = 0; i < num; i++) {
            let random = parseInt(3 * Global.gameData.level * Math.random()) + 1;
            this.createBlock(num, this.blockBox, i + 1, i * _w, random, needSpeed)
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 储存游戏 & 重置全局数据
        Global.game = this;
        Global.gameData.over = true;
        Global.gameData.score = 0;
        Global.gameData.level = 1;
        Global.gameData.pack = false;

        // 开启碰撞系统
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // 开启物理系统
        cc.director.getPhysicsManager().enabled = true;
        // 开启碰撞系统的调试线框绘制
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        // 创建方块对象池
        this.blockObjGroup();
        
        // console.log(this.node.getChildByName('player').active);
        if (window.wx) {
            console.log('宽度：', this.node.width, wx.getSystemInfoSync().windowWidth);
        }
    },

    start () {
       
    },

    // update (dt) {},
});
