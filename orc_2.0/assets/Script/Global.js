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
        minNumber: 4,
        
        // 开局冲刺
        startDash: false,
        // 兽人狂暴模式(兽人移动速度)
        crazy: 1,

        // 整体移动速度(重要) 中间值为5
        speed: 5,
        // 中间值
        speedFixed: 5
    },
    // 用户道具数据
    userInfo: {
        money: 0,       // 游戏中金币
        dash: 1,        // 冲刺
        fanatical: 1,   // 狂热
        boom: 1,        // 增加炸弹 4秒一个
        signDate: '',   // 签到时间
        signDay: 1,     // 签到天数
        maxScore: 0     // 最远距离
    },
    shareInfo: {
        title: '',
        url: ''
    },
    // 重置参数
    restData() {
        this.gameInfo.score = 0;
        this.gameInfo.level = 0;
        this.gameInfo.total = 10;
        this.gameInfo.crazy = 1;
        this.gameInfo.orcBoom = 6;
        this.gameInfo.orcBoard = 5;
        this.gameInfo.orcMoney = 10;
        this.gameInfo.startDash = false;
        this.gameInfo.speed = 3;
    },
    // 本地储存数据
    saveData() {
        window.localStorage.setItem('orcUserInfo', JSON.stringify(this.userInfo));
    },
    // 获取本地数据
    fetchData() {
        let data = window.localStorage.getItem('orcUserInfo') ? JSON.parse(window.localStorage.getItem('orcUserInfo')) : null;
        return data;
    }
}
function commonlyUse() {
    // 加载 or 预加载
    cc.director.loadScene('name');
    cc.director.preloadScene('name', () => console.log('预加载游戏场景成功'));
    // 暂停 or 开始
    cc.director.pause();
    cc.director.resume();
    // 图片加载
    cc.loader.loadRes(src, cc.SpriteFrame, (err, res) => {
        node.getComponent(cc.Sprite).spriteFrame = res;
    });
    // 克隆
    cc.instantiate(node);

    // 定时器
    this.scheduleOnce(() => {

    }, 1);

}
