"use strict";
cc._RF.push(module, 'b3677chzw5JNYW1lOPAusuh', 'Logo');
// Script/Logo.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        cc.director.preloadScene('Home', function () {
            return console.log('预加载游戏场景成功');
        });
        this.scheduleOnce(function () {
            cc.director.loadScene('Home');
        }, 2);
    },
    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();