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
        // 难度系数（每一列方块到达底部增加一次）
        level: 1,
        // 否获取炸药包类型
        pack: '',
        // 子弹对象池
        bulletPool: null,
        // 方块列表对象池
        blockListPool: null,
        // 粒子列表
        blastPool: null,
        /** 
         * 这里开始 api 动态传参
         * 初始化更改一下属性
        */
        // 小方块数值的基础数值
        baseNum: 5,
        // 1秒钟多少个子弹
        bulletNum: 10,
        // 一颗重力弹减少的数量
        forceful: 3,
        // 列表之间间距
        listSpacing: 800
    },
    // 计算分数
    computeScore: function computeScore() {
        // 小方块最大数值每一组方块增加20%
        var newNum = parseInt(this.gameData.baseNum * (1 + 0.2 * this.gameData.level));
        /** 
         * 每隔3组方块列表增加一
         * let percent = 0.5 - 0.05 * (1 + parseInt(this.gameData.level / 3));
        */
        var percent = 0.5 - 0.05 * this.gameData.level;
        if (percent <= 0.1) percent = 0.1;
        /** 
         * 计算方块最小值和最大值
         * 最大为基础数值的150%, 最小为50%，并随等级变化
        */
        var min = parseInt(newNum * (1 - percent));
        if (min < 1) min = 1;
        var max = parseInt(newNum * (1 + 0.5));
        // console.log(parseInt(Math.random() * (max - min) + min));
        return { score: parseInt(Math.random() * (max - min) + min), maxNum: max };
    },

    // 随机红绿两种颜色
    randomColor: function randomColor(score, type) {
        var max = this.computeScore().maxNum;
        var rVal = type == 1 ? 240 : 240 - parseInt(240 * (score / max));
        var gVal = type == 2 ? 210 : 210 - parseInt(210 * (score / max));
        return { r: rVal, g: gVal, b: 50 };
    },

    pageInfo: {
        shared: false
    },
    shareInfo: {
        title: '脑残射击',
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
        