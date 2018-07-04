"use strict";
cc._RF.push(module, '51b3cu5nXNGfYqKeDzOAhP9', 'prop');
// Script/game/prop.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},
    update: function update(dt) {
        if (this.node.y < 0.01) {
            this.node.parent.removeChild(this.node);
            // cc.log('道具回收')
        } else {
            this.node.y -= 5;
        }
    }
});

cc._RF.pop();