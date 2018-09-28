(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Global.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ccbdbz4xYJOtJdax0OemaT/', 'Global', __filename);
// Script/Global.js

'use strict';

module.exports = {
    game: null,
    gameInfo: {
        state: 'over',
        // 衰减时候计算总数
        countToatal: 0,
        // 兽人总数
        total: 20,
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
        // 复活接力分数
        reviveScore: 0,
        // 游戏中金币
        money: 0,
        // 最小兽人数量
        minNumber: 10
    },
    shareInfo: {
        title: '',
        url: ''
    }
};
function commonlyUse() {
    // 加载 or 预加载
    cc.director.loadScene('name');
    cc.director.preloadScene('name', function () {
        return console.log('预加载游戏场景成功');
    });
    // 暂停 or 开始
    cc.director.pause();
    cc.director.resume();
    // 图片加载
    cc.loader.loadRes(src, cc.SpriteFrame, function (err, res) {
        node.getComponent(cc.Sprite).spriteFrame = res;
    });
    // 克隆
    cc.instantiate(node);

    // 定时器
    this.scheduleOnce(function () {}, 1);

    //碰撞系统（不需要）
    var managerCollis = cc.director.getCollisionManager();
    managerCollis.enabled = true;
    // 开启碰撞系统的调试线框绘制
    managerCollis.enabledDebugDraw = true;
    managerCollis.enabledDrawBoundingBox = true;

    // 物理系统
    var managerPhysics = cc.director.getPhysicsManager();
    managerPhysics.enabled = true;
    managerPhysics.enabledAccumulator = true; // 未知作用
    // 开启物理系统的调试线框绘制
    managerPhysics.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit | cc.PhysicsManager.DrawBits.e_pairBit | cc.PhysicsManager.DrawBits.e_centerOfMassBit | cc.PhysicsManager.DrawBits.e_jointBit | cc.PhysicsManager.DrawBits.e_shapeBit;
}

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
        