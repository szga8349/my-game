const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },
        // 墙的容器
        wallBox: {
            default: null,
            type: cc.Node
        },
        // 球
        ball: {
            default: null,
            type: cc.Node
        },
        // 砖块的容器
        brickBox: {
            default: null,
            type: cc.Node
        },
        // 砖块资源
        brickPrefab: {
            default: null,
            type: cc.Prefab
        },
    },
    // 暂停开始按钮
    stateBtn() {
        let src = '';
        if (this.state) {
            src = 'pause';
            cc.director.resume();
        } else {
            src = 'start';
            cc.director.pause(); 
        }
        cc.loader.loadRes(src, cc.SpriteFrame, (err, res) => {
            this.node.getChildByName('state-btn').getComponent(cc.Sprite).spriteFrame = res;
        });
        this.state = !this.state;
    },
    // 创建关卡砖块
    createBrick() {
        const list = Global.levels[Global.gameInfo.level];
        const num = 7;
        const val = 1.8;
        const _w = this.brickBox.width / num;
        const _h = parseInt(_w / val);
        // 单个砖块生成
        let output = (type, index) => {
            if (type == 0) return;
            let brick = cc.instantiate(this.brickPrefab);
            brick.width = brick.getComponent(cc.PhysicsBoxCollider).size.width = _w;
            brick.height = brick.getComponent(cc.PhysicsBoxCollider).size.height = _h;
            brick.getComponent(cc.PhysicsBoxCollider).offset.x = _w / 2;
            brick.getComponent(cc.PhysicsBoxCollider).offset.y = -(_h / 2);            
            // 设置位置
            brick.x = (index % num) * _w;
            brick.y = -Math.floor(index / num) * _h;
            // 输出到指定容器
            brick.parent = this.brickBox;
        }
        // 列表输出方块
        for (let i = 0; i < list.length; i++) output(list[i], i);
    },
    // 重置所有的墙物理描边（适应所有手机，目前没效果，我直接在编辑器中设置最大了）
    restAllWall() {
        const walls = this.wallBox.children;
        for (let i = 0; i < walls.length; i++) {
            walls[i].getComponent(cc.PhysicsBoxCollider).size.width = walls[i].width;
            walls[i].getComponent(cc.PhysicsBoxCollider).size.height = walls[i].height;
            console.log(walls[i].getComponent(cc.PhysicsBoxCollider).size);
        }
    },
    // 添加拖动监听
    onDrag() {
        this.node.on('touchmove', this.dragMove, this);
    },
    // 清除拖动监听
    offDrag() {
        this.node.off('touchmove', this.dragMove, this);
    },
    // 设置托盘拖拽
    dragMove(event) {
        if (Global.gameInfo.over) return;
        let locationv = event.getLocation();
        let location = this.wallBox.convertToNodeSpaceAR(locationv);
        // 不移出屏幕
        let minX = -this.wallBox.width / 2 + this.player.width / 2,
            maxX = -minX,
            minY = -this.wallBox.height / 2 + this.player.height / 2,
            maxY = -minY;
        if (location.x < minX) location.x = minX;
        if (location.x > maxX) location.x = maxX;
        if (location.y < minY) location.y = minY;
        if (location.y > maxY) location.y = maxY;
        this.player.setPosition(location.x, this.player.y);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Global.game = this;
        Global.gameInfo.over = false;
        // 碰撞系统（不需要）
        // const managerCollis = cc.director.getCollisionManager();
        // managerCollis.enabled = true;
        // // 开启碰撞系统的调试线框绘制
        // managerCollis.enabledDebugDraw = true;
        // managerCollis.enabledDrawBoundingBox = true;
        
        // 物理系统
        const managerPhysics = cc.director.getPhysicsManager();
        managerPhysics.enabled = true;
        // managerPhysics.enabledAccumulator = true;
        // managerPhysics.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit | cc.PhysicsManager.DrawBits.e_pairBit | cc.PhysicsManager.DrawBits.e_centerOfMassBit | cc.PhysicsManager.DrawBits.e_jointBit | cc.PhysicsManager.DrawBits.e_shapeBit;
        
        this.createBrick();
        // 设置引力
        this.ball.getComponent(cc.RigidBody).linearVelocity = cc.v2(300, 1000);
        
    },

    start() {
        this.onDrag();
        // 游戏暂停状态
        this.state = false;
    },

    // update (dt) {},
});
