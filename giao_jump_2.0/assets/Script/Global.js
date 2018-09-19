module.exports = {
    game: null,
    gameInfo: {
        over: true,     // 游戏结束状态
        state: null,    // 游戏状态  normal / space /

        topScore: 0,        // 跳跃的高度  

        plateMinHeight: 0,  // 添加跳板的起始高度
        progressVal: 0,     // 道具收集状态
        level: 1,           // 难度系数   
        distance: 300,      // 弹跳的高度
        speed: 0.2,         // 弹跳的速度（要和 player 的碰撞体积做相应的增大）

        first: true         // 是否第一次玩
    },
    // 格式化单位数值
    numFormat(num) {
        let result = parseInt(num) + 'm';
        return result;
    },
    shareInfo: {
        title: '熊猫跳跃',
        url: ''
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

    // 修改颜色
    cc.hexToColor('#4141ff');
    new cc.Color({ r: 74, g: 172, b: 255 });

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
