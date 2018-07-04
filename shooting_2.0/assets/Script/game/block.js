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
            cc.log('创建新粒子')
            blast = cc.instantiate(this.blastPrefab);
        }
        // cc.log(this.node.x, this.node.y)
        blast.setPosition(this.node.x + this.node.width / 2, this.node.y - this.node.height / 2);
        blast.parent = Global.game.blockBox;
    },
    // 碰撞检测
    onCollisionEnter(other, self) {
        // 子弹碰撞
        if (other.node.name == 'bullet') {
            let score = Number(this.node.getChildByName('boxtext').getComponent(cc.Label).string);
            if (score == 1) {
                // this.createBlast()

                /**
                 * Auto Remove On 勾上
                 * Play On Load 勾上
                */
                let blast = cc.instantiate(this.blastPrefab);
                blast.setPosition(this.node.x + this.node.width / 2, this.node.y - this.node.height / 2);
                blast.parent = Global.game.blockBox;

                Global.gameData.blockPool.put(this.node)
            } else {
                this.node.getChildByName('boxtext').getComponent(cc.Label).string = score - 1;
                // 改变颜色
                let key = parseInt(score / 10) > 5 ? 5 : parseInt(score / 10);
                this.node.color = new cc.Color(Global.gameData.colors[key]);
            }
        }
        // 碰撞到墙，反弹
        if (other.node.name == 'wall') {
            this.node.dataxspeed = -this.node.dataxspeed
        }

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {

    },

    update (dt) {
        if (this.node.y <= 0.01) {
            Global.gameData.blockPool.put(this.node)
            // cc.log('方块到达底部回收')
        } else {
            this.node.y -= 2
            this.node.x += this.node.dataxspeed
        }
    },
});
