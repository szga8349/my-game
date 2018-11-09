module.exports = {
    game: null,
    gameInfo: {
        score: 0,
        level: 0,
        state: 'none',
        // 是否复活过
        revive: false,
        // 主题
        theme: 1,
        // 主题资源
        images: null,
        // 针对全面屏手机做的节点增加
        isMaxPhone: 0,
        // 金身时间
        forceTime: 5,
        // 翻转方向时间
        reverseTime: 5,
        // 皮肤骨骼名字列表
        skinName: ['player', 'huahua', 'gongzhu', 'jiewu', 'hongpi'],
    },
    // 音效系统
    musicInfo: {
        // bgm
        bgm: null,
        // bgm播放
        bgmState: false,
        // 静音状态
        state: false,
    },
    // 重置数据
    restData() {
        this.gameInfo.score = 0;
        this.gameInfo.state = 'none';
        this.gameInfo.forceTime = 5;
        this.gameInfo.reverseTime = 5;
    },
    // 用户数据
    userData: {
        // 宝石数量
        gem: 0,
        // 最大分数
        maxScore: 0,
        // 地图主题
        theme: 1,
        // 皮肤
        skin: 0, 
        // 拥有皮肤列表
        skinList: [0],
        signDay: 0,
        signTime: 'xxx'
    },
    shareInfo: {
        title: '',
        url: ''
    },
    // 图片加载
    loadImg(node, src) {
        cc.loader.loadRes('images/' + src, cc.SpriteFrame, (err, res) => {
            node.getComponent(cc.Sprite).spriteFrame = res;
        });
    },
    // 保存数据
    saveData() {
        window.localStorage.setItem('dashUserInfo', JSON.stringify(this.userData));
    },
    // 获取数据
    fetchData() {
        let data = window.localStorage.getItem('dashUserInfo') ? JSON.parse(window.localStorage.getItem('dashUserInfo')) : null;
        return data;
    },
    // 清除本地数据
    removeData() {
        window.localStorage.clear();
    },
    // 格式化时间
    timeFormat(num = 0) {
        let _Appoint, month, day, date;
        if (num > 0) {
            _Appoint = new Date(new Date().getTime() + (num * 24 * 3600 * 1000));
        } else {
            _Appoint = new Date(new Date() - (num * 24 * 3600 * 1000));
        }
        month = ('0' + (_Appoint.getMonth() + 1)).slice(-2);
        day = ('0' + _Appoint.getDate()).slice(-2);
        date = `${_Appoint.getFullYear()}-${month}-${day}`
        return date;
    },
}
function commonlyUse() {
    // 加载 or 预加载
    cc.director.loadScene('name');
    cc.director.preloadScene('name', () => console.log('预加载游戏场景成功'));
    
    // 获取游戏暂停状态
    cc.director.isPaused();

    // 暂停 or 开始
    cc.director.pause();
    cc.director.resume();

    // 颜色更换
    cc.hexToColor('#ffffff');
    new cc.Color({ r: 74, g: 172, b: 255 });

    // 图片加载
    cc.loader.loadRes(src, cc.SpriteFrame, (err, res) => {
        node.getComponent(cc.Sprite).spriteFrame = res;
    });
    
    // 加载网络图片（需要同源策略） src => { url: 'xxx', type: 'png' }
    cc.loader.load(src, (err, res) => {
        node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
    });

    // 克隆
    cc.instantiate(node);

    // 定时器
    this.scheduleOnce(() => {

    }, 1);

    // 龙骨播放动画
    node.getComponent(dragonBones.ArmatureDisplay).playAnimation('name', 1); // 0 是无限循环

    //碰撞系统
    const MC = cc.director.getCollisionManager();
    MC.enabled = true;
    // 开启碰撞系统的调试线框绘制
    MC.enabledDebugDraw = true;
    MC.enabledDrawBoundingBox = true;

    // 物理系统
    const MP = cc.director.getPhysicsManager();
    MP.enabled = true;
    // 未知作用
    MP.enabledAccumulator = true; 
    // 开启物理系统的调试线框绘制
    MP.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit | cc.PhysicsManager.DrawBits.e_pairBit | cc.PhysicsManager.DrawBits.e_centerOfMassBit | cc.PhysicsManager.DrawBits.e_jointBit | cc.PhysicsManager.DrawBits.e_shapeBit;
}
