const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 子弹帧数计数
        count: 0,
        // 子弹资源
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 生成的粒子资源
        blastPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // 碰撞检测
    onCollisionEnter(other, self) {
        console.log('飞机撞到的物体：',other.node.name);
        if (other.node.name == 'prop') {
            Global.gameData.pack = true;
            other.node.parent.removeChild(other.node);
            this.schedule(() => {
                Global.gameData.pack = false;
            }, 5, 0);
        } else {
            Global.game.gameEnd();
        }
    },
    // 子弹对象池
    bulletObjGroup() {
        // 储存到 Global 里面
        Global.gameData.bulletPool = new cc.NodePool();
        let initCount = 20;
        for (let i = 0; i < initCount; ++i) {
            // 创建节点
            let bullet = cc.instantiate(this.bulletPrefab);
            // 通过 putInPool 接口放入对象池
            Global.gameData.bulletPool.put(bullet);
        }
    },
    /** 
     * 创建子弹
     * key: 2 为直线射击 1 & 3 则左右两边倾斜射击
    */
    createBullet(parentNode, key = 2) {
        let bullet = null,
            _x = this.node.getPosition().x,
            _y = this.node.getPosition().y + this.node.height / 4;
        // 通过 size 接口判断对象池中是否有空闲的对象
        if (Global.gameData.bulletPool.size() > 0) {
            bullet = Global.gameData.bulletPool.get();
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bullet = cc.instantiate(this.bulletPrefab);
        }
        bullet.setPosition(_x, _y);
        // 将生成的敌人加入节点树
        bullet.parent = parentNode;
        // 设置key标记
        bullet.datakey = key
        // cc.log(bullet.datakey)
    },
    // 创建粒子对象池
    blastObjGroup() {
        Global.gameData.blastPool = new cc.NodePool();
        let initCount = 50;
        for (let i = 0; i < initCount; ++i) {
            let block = cc.instantiate(this.blastPrefab);
            Global.gameData.blastPool.put(block);
        }
        // cc.log('执行粒子创建')
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 创建子弹对象池
        this.bulletObjGroup();
        // 创建粒子对象池
        // this.blastObjGroup();
    },

    start () {
        // this.getComponent('player')
    },

    update (dt) {
        if (Global.gameData.over) return;
        this.count += 1;
        if (this.count % 10 == 0) {
            // 检查获取道具包
            if (Global.gameData.pack) {
                for (let i = 1; i <= 3; i++) {
                    this.createBullet(Global.game.node, i);
                }
            } else {
                this.createBullet(Global.game.node);
            }
            // 难度叠加
            if (this.count >= 1000) {
                this.count = 0;
                Global.gameData.level = Global.gameData.level == 3 ? 3 : Global.gameData.level += 1;
                console.log('难度系数：', Global.gameData.level);
            }
        }
    },
});
