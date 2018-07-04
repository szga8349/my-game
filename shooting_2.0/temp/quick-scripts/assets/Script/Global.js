(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Global.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd5750KrxDNOsK39rNjMeaIp', 'Global', __filename);
// Script/Global.js

'use strict';

module.exports = {
    game: null,
    gameData: {
        // 游戏状态
        over: true,
        // 分数
        score: 0,
        // 难度系数
        level: true,
        // 是否获取炸药包
        pack: false,
        // 子弹对象池
        bulletPool: null,
        // 方块对象池
        blockPool: null,
        // 粒子对象池
        blastPool: null,
        // 方块颜色值
        colors: [{ r: 104, g: 159, b: 56 }, { r: 255, g: 193, b: 7 }, { r: 255, g: 87, b: 34 }, { r: 233, g: 30, b: 99 }, { r: 216, g: 7, b: 7 }, { r: 156, g: 39, b: 176 }]
    },
    pageInfo: {
        shared: false
    },
    shareInfo: {
        title: '疯狂鸟儿，看看你能拿几分',
        url: 'https://color-1255728886.cos.ap-guangzhou.myqcloud.com/img/share_pic_creazybird.png'
    }
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Global.js.map
        