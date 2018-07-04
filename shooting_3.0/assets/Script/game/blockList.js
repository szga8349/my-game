const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 生成的方块资源
        blockPrefab: {
            default: null,
            type: cc.Prefab
        },
    },
    /**
     * 重置方块属性
     * @param {*} el 元素
     * @param {*} sum 总数
     * @param {*} index 位置
     */
    resetBlock(el, sum, index) {
        let spacing = 10;
        let height = 100;
        let num = sum / 2;
        let score = Global.computeScore().score;
        let _w = (this.node.width - (num + 1) * spacing) / num;
        let _x = index < num ? index * (_w + spacing) + spacing : (index - num) * (_w + spacing) + spacing;
        let _y = index < num ? 0 : height + spacing;
        let type = parseInt(2 * Math.random()) + 1;
        // 设置宽高
        el.width = _w;
        el.height = height;
        // 随机给一个颜色类型
        el.datatype = type;
        // 设置碰撞包围
        el.getComponent(cc.BoxCollider).size.width = _w;
        el.getComponent(cc.BoxCollider).size.height = height;
        el.getComponent(cc.BoxCollider).offset.x = _w / 2;
        el.getComponent(cc.BoxCollider).offset.y = -(height / 2);
        // 重置分数
        el.getChildByName('boxtext').getComponent(cc.Label).string = score;
        // 重置颜色
        el.color = new cc.Color(Global.randomColor(score, type, Global.computeScore().maxNum));
        // 重置位置
        el.setPosition(_x, _y);
    },
    // 创建方块
    createBlock(sum, index) {
        let block = cc.instantiate(this.blockPrefab);
        this.resetBlock(block, sum, index);
        block.parent = this.node;
        if (index > 4) block.active = false;
    },
    // 生成一列方块
    createBlockList() {
        let num = 10;
        for (let i = 0; i < num; i++) {
            this.createBlock(num, i)
        }
    },
    // 重置回到顶部
    resetTop() {
        let children = this.node.children.filter(item => item.name == 'block');
        let type = Global.gameData.level > 1 ? parseInt(4 * Math.random()) + 1 : 0;
        // 让列表回到最上方
        this.node.setPosition(0, 3 * Global.gameData.listSpacing + this.node.height);
        // 重置回到顶部的所有子元素
        for (let i = 0; i < children.length; i++) {
            children[i].active = true;
            children[i].stopAllActions();
            this.resetBlock(children[i], children.length, i);
        }
        // 设置移动方块
        switch (type) {
            case 1:
                // cc.log('执行第一种移动方案');
                children[0].active = children[4].active = false;
                this.blockMove(1, 3, children);
                break;
            case 2:
                // cc.log('执行第二种移动方案');
                children[1].active = children[8].active = false;
                this.blockMove(9, 0, children);
                break;
            case 3:
                // cc.log('执行第三种移动方案');
                children[5].active = children[9].active = false;
                this.blockMove(6, 8, children);
                break;
            case 4:
                // cc.log('执行第四种移动方案');
                children[3].active = children[6].active = false;
                this.blockMove(4, 5, children);
                break;
        }
    },
    // 随机移动
    blockMove(num1, num2, els) {
        let toLeft = cc.moveTo(1, els[num2].x, els[num2].y),
            toRight = cc.moveTo(1, els[num2].x + els[num2].width + 10, els[num2].y),
            leftTo = cc.moveTo(1, els[num1].x - els[num1].width + 10, els[num1].y),
            rightTo = cc.moveTo(1, els[num1].x, els[num1].y);
        let seq = cc.repeatForever(cc.sequence(toRight, toLeft)),
            seq2 = cc.repeatForever(cc.sequence(leftTo, rightTo));
        els[num2].runAction(seq);
        els[num1].runAction(seq2);
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.createBlockList()
    },

    update(dt) {
        if (this.node.y <= -50) {
            Global.gameData.level = Global.gameData.level += 1;
            console.log('难度系数：', Global.gameData.level);
            this.resetTop();
        } else {
            this.node.y -= 3
        }
    },
});
