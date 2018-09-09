const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    onBeginContact(contact, self, other) {
        // console.log(other.node.name);
        let ballStop = () => {
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            cc.log('游戏结束');
            this.scheduleOnce(() => cc.director.loadScene('Game'), 0.5);
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
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
