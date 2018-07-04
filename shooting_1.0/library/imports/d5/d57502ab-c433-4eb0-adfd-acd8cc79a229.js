"use strict";
cc._RF.push(module, 'd5750KrxDNOsK39rNjMeaIp', 'Global');
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
        blastPool: null
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