"use strict";
cc._RF.push(module, 'ccbdbz4xYJOtJdax0OemaT/', 'Global');
// Script/Global.js

'use strict';

module.exports = {
    game: null,
    home: null,
    playBgm: false,
    gameInfo: {
        state: 'over',
        // 衰减时候计算总数
        countToatal: 0,
        // 兽人总数
        total: 10,
        // 难度
        level: 0,
        // 炸弹箱子兽人生成时间(秒)
        orcBoom: 6,
        // 木板兽人生成(秒)
        orcBoard: 5,
        // 金币箱兽人生成(秒)
        orcMoney: 10,
        // 分数（距离）
        score: 0,
        // 最小兽人数量
        minNumber: 5,

        // 开局冲刺
        startDash: false,
        // 兽人狂暴模式(兽人移动速度)
        crazy: 1

    },
    // 用户道具数据
    userInfo: {
        money: 0, // 游戏中金币
        dash: 1, // 冲刺
        fanatical: 1, // 狂热（数量增至30）
        boom: 1, // 增加炸弹 4秒一个
        signDate: '', // 签到时间
        signDay: 1 // 签到天数
    },
    shareInfo: {
        title: '',
        url: ''
    },
    // 重置参数
    restData: function restData() {
        this.gameInfo.score = 0;
        this.gameInfo.level = 0;
        this.gameInfo.crazy = 1;
        this.gameInfo.orcBoom = 6;
        this.gameInfo.orcBoard = 5;
        this.gameInfo.orcMoney = 10;
        this.gameInfo.startDash = false;
    },

    // 本地储存数据
    saveData: function saveData() {
        window.localStorage.setItem('orcUserInfo', JSON.stringify(this.userInfo));
    },

    // 获取本地数据
    fetchData: function fetchData() {
        var data = window.localStorage.getItem('orcUserInfo') ? JSON.parse(window.localStorage.getItem('orcUserInfo')) : null;
        return data;
    }
};

cc._RF.pop();