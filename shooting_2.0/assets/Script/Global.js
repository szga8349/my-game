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
        // 方块颜色值
        colors: [
            { r: 104, g: 159, b: 56 }, 
            { r: 255, g: 193, b: 7 }, 
            { r: 255, g: 87, b: 34 }, 
            { r: 233, g: 30, b: 99 },
            { r: 216, g: 7, b: 7 },
            { r: 156, g: 39, b: 176 }
        ]
    },
    pageInfo: {
        shared: false
    },
    shareInfo: {
        title: '脑残射击',
        url: 'https://color-1255728886.cos.ap-guangzhou.myqcloud.com/img/share_pic_creazybird.png'
    }
}