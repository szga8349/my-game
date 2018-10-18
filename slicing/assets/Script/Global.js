module.exports = {
    game: null,
    gameInfo: {
        state: '',
        // 难度
        level: 1,
        // 难度计数
        level_count: 0,
        // 连接计数
        hit: 0,
        // 是否切割中(点击)
        click: false,
        // 游戏方块的移动速度 0 - 1
        speed: 1,
        // 时钟出现间隔(秒)
        clockTime: 45,
        // 三重割线出现间隔(秒)
        skillTime: 20,
        // 三倍切割
        triple: false,
        // 血量
        hp: 3,
        // 分数
        score: 0,
        // 试玩皮肤
        theme: 'none'
    },
    // 重置数据
    restData() {
        this.gameInfo.state = 'none';
        this.gameInfo.level = 1;
        this.gameInfo.level_count = 0;
        this.gameInfo.hit = 0;
        this.gameInfo.click = false;
        this.gameInfo.speed = 1;
        this.gameInfo.triple = false;
        this.gameInfo.hp = 3;
        this.gameInfo.score = 0;
        this.gameInfo.theme = 'none';
    },
    // 用户信息
    userInfo: {
        // 第一次玩
        first: true,
        // 最大分数
        maxScore: 0,
        // 主题（素材更换）
        theme: 'box-white',
        // 主题列表
        themeList: ['box-white'],
        // 金币
        money: 30,
        // 免费抽奖次数
        free: 1,
        // 签到时间
        signDate: '',   
        // 签到天数
        signDay: 1,     
    },
    // 盒子命名列表
    boxList: ['box-white',
        'fruit-1', 'fruit-2', 'fruit-3', 'fruit-4', 'fruit',
        'cartoon-1', 'cartoon-2', 'cartoon-3', 'cartoon-4', 'cartoon',
        'universe-1', 'universe-2', 'universe-3', 'universe-4', 'universe',
        'office-1'],
    // 本地储存数据
    saveData() {
        // console.log(this.userInfo);
        window.localStorage.setItem('boxUserInfo', JSON.stringify(this.userInfo));
    },
    // 获取本地数据
    fetchData() {
        let data = window.localStorage.getItem('boxUserInfo') ? JSON.parse(window.localStorage.getItem('boxUserInfo')) : null;
        return data;
    },
    // 清除本地数据
    removeData() {
        window.localStorage.clear();
    },
    // 分享数据
    shareInfo: {
        title: '',
        url: ''
    }
}
function commonlyUse() {
    // 修改颜色
    cc.hexToColor('#ffffff');
    new cc.Color({ r: 74, g: 172, b: 255 });
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

    //碰撞系统（不需要）
    const managerCollis = cc.director.getCollisionManager();
    managerCollis.enabled = true;
    // 开启碰撞系统的调试线框绘制
    managerCollis.enabledDebugDraw = true;
    managerCollis.enabledDrawBoundingBox = true;

    // 物理系统
    const managerPhysics = cc.director.getPhysicsManager();
    managerPhysics.enabled = true;
    managerPhysics.enabledAccumulator = true; // 未知作用
    // 开启物理系统的调试线框绘制
    managerPhysics.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit | cc.PhysicsManager.DrawBits.e_pairBit | cc.PhysicsManager.DrawBits.e_centerOfMassBit | cc.PhysicsManager.DrawBits.e_jointBit | cc.PhysicsManager.DrawBits.e_shapeBit;
}
