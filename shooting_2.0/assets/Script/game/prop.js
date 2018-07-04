cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update (dt) {
        if (this.node.y < 0.01) {
            this.node.parent.removeChild(this.node)
            cc.log('道具回收')
        } else {
            this.node.y -= 5
        }
    },
});
