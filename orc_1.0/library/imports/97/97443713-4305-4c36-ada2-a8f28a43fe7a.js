"use strict";
cc._RF.push(module, '97443cTQwVMNq2iqPKKQ/56', 'Orc');
// Script/Game/Orc.js

'use strict';

var Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {},

    nodeMove: function nodeMove() {
        if (this.node.name == 'orc') {
            if (this.node.x > this.node.parent.width) {
                this.node.x = -this.node.width;
            }
        } else {
            if (this.node.x > this.node.parent.width) {
                this.node.destroy();
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {

    // },

    // start () {

    // },

    update: function update(dt) {
        this.node.x += this.node.moveSpeed;
        this.nodeMove();
    }
});

cc._RF.pop();