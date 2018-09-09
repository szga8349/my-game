const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    onBeginContact(contact, self, other) {
        if (Global.gameInfo.over) return;
        // console.log(other.node.name);
        let ballStop = () => {
            Global.gameInfo.over = true;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            cc.log('游戏结束');

            // 执行动作回调是和动作执行同步，不是动作结束之后
            // let finished = cc.callFunc(() => {
            //     console.log('执行回调');
            //     // cc.director.loadScene('Game');
            // }, this);
            // let spawn = cc.spawn(cc.fadeOut(0.8), cc.scaleTo(0.8, 0, 0), finished);

            let spawn = cc.spawn(cc.fadeOut(0.8), cc.scaleTo(0.8, 0, 0));
            self.node.runAction(spawn);
            
            this.scheduleOnce(() => cc.director.loadScene('Game'), 0.8);
        }
        switch (other.node.name) {
            case 'bottom':
                ballStop();
                break;
            case 'brick':
                other.node.destroy();
                // console.log(Global.game.brickBox.children.length);
                if (Global.game.brickBox.children.length == 1) {
                    cc.log('游戏胜利');
                    Global.gameInfo.level = Global.gameInfo.level == Global.levels.length - 1 ? 0 : Global.gameInfo.level + 1;
                    ballStop();
                }
                break;
        }
        // 判断是否 x or y 快要成直线（待实现）
        // let pvel = self.node.getComponent(cc.RigidBody).linearVelocity;
        // if (pvel.x > 0 && pvel.x < 180) {
        //     cc.log('向右');
        //     self.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(200, pvel.y);
        // } else if (pvel.x < 0 && pvel.x < -180) {
        //     cc.log('向左');
        //     self.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-200, pvel.y);
        // }
        // if (pvel.y > 0 && pvel.y < 500) {
        //     cc.log('向上');
        //     self.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(pvel.x, 500);
        // } else if (pvel.y < 0 && pvel.y < -500) {
        //     cc.log('向下');
        //     self.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(pvel.x, -500);
        // }
        // console.log(self.node.getComponent(cc.RigidBody).linearVelocity);
        
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
