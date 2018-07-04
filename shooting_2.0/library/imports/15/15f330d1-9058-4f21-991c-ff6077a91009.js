"use strict";
cc._RF.push(module, '15f33DRkFhPIZkc/2B3qRAJ', 'blast');
// Script/game/blast.js

"use strict";

var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // this.node.getComponent(cc.ParticleSystem).resetSystem()
        // this.scheduleOnce(() => {
        //     this.node.getComponent(cc.ParticleSystem).stopSystem()
        // }, 0.1)
        // this.scheduleOnce(() => {
        //     cc.log('粒子回收')
        //     Global.gameData.blastPool.put(this.node)
        // }, 2)
    },
    start: function start() {
        // this.node.getComponent(cc.ParticleSystem).resetSystem()
    }
}

// update (dt) {},
);

cc._RF.pop();