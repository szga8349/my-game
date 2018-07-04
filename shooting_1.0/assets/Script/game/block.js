const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 生成的粒子资源
        blastPrefab: {
            default: null,
            type: cc.Prefab
        },
    },
    // 生成一个爆炸粒子
    createBlast() {
        let blast = null;
        if (Global.gameData.blastPool.size() > 0) {
            blast = Global.gameData.blastPool.get();
        } else {
            cc.log('创建一个粒子')
            blast = cc.instantiate(this.blastPrefab);
        }
        // console.log(Global.game.node);
        
        blast.setPosition(this.node.x, this.node.y);
        blast.parent = Global.game.blockBox;
    },
    // 碰撞检测
    onCollisionEnter(other, self) {
        // 子弹碰撞
        if (other.node.name == 'bullet') {
            let score = Number(this.node.getChildByName('boxtext').getComponent(cc.Label).string);
            if (score == 1) {
                // this.createBlast()

                // let blast = cc.instantiate(this.blastPrefab);
                // blast.setPosition(this.node.x + this.node.width / 2, this.node.y - this.node.height / 2);
                // blast.parent = Global.game.blockBox;

                Global.gameData.blockPool.put(this.node)
            } else {
                this.node.getChildByName('boxtext').getComponent(cc.Label).string = score - 1
            } 
        }
        // 碰撞到墙，反弹
        if (other.node.name == 'wall') {
            let xSpeed = -(this.node.getComponent(cc.RigidBody).linearVelocity.x)
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(xSpeed, -400)
        }
        
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 设置碰撞包围（大小变动的时候包围不会自动跟随）
        let _w = this.node.width;
        this.node.getComponent(cc.BoxCollider).size.width = this.node.getComponent(cc.BoxCollider).size.height = _w;
        this.node.getComponent(cc.BoxCollider).offset.x = _w / 2;
        this.node.getComponent(cc.BoxCollider).offset.y = -_w / 2;
    },

    start () {
        
    },

    update (dt) {
        if (this.node.y <= 0.01) {
            Global.gameData.blockPool.put(this.node)
            // cc.log('方块到达底部回收')
        }
    },
});
