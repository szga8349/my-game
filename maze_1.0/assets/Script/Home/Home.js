const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 轮播图的按钮容器
        swiperContent: {
            default: null,
            type: cc.Node
        },
        // 对应按钮
        levelBtn: {
            default: null,
            type: cc.Prefab
        },
        // 当前关卡位置
        levelIndex: {
            default: null,
            type: cc.Label
        },
        // 按钮点击提示条
        bar: {
            default: null,
            type: cc.Node
        },
        // 阻止重复点击
        isClick: false,
        explain: {
            default: null,
            type: cc.Node
        }
    },
    openGame() {
        cc.director.loadScene('Game');
        if (Global.home.timer) clearTimeout(Global.home.timer);
    },
    openRank() {
        cc.director.loadScene('Rank');
        if (Global.home.timer) clearTimeout(Global.home.timer);
    },
    switchExplain() {
        this.explain.active = !this.explain.active;
    },
    closrBar () {
        let h = this.bar.height;
        let hide = cc.moveBy(0.3, cc.p(0, h));
        this.bar.runAction(hide);
        this.isClick = false;
        if (this.timer) clearTimeout(Global.home.timer);
    },
    // 输出按钮
    outPutBtn () {
        // 关卡列表
        const list = Global.levels;
        // 关卡对应文字颜色
        const colors = [
            { r: 41, g: 182, b: 247 },
            { r: 41, g: 182, b: 247 },
            { r: 132, g: 206, b: 82 },
            { r: 255, g: 166, b: 0 },
            { r: 255, g: 101, b: 49 },
            { r: 255, g: 65, b: 123 },
            { r: 214, g: 57, b: 239 },
            { r: 74, g: 146, b: 255 },
            { r: 140, g: 210, b: 90 },
            { r: 255, g: 166, b: 0 },
            { r: 255, g: 101, b: 58 },
            { r: 132, g: 223, b: 33 },
        ];
        // 创建按钮
        let createBtn = (index, num, _node) => {
            let btn = cc.instantiate(this.levelBtn);
            let w = btn.width; 
            btn.dataNum = num;
            btn.getChildByName('num').getComponent(cc.Label).string = num + 1;
            btn.getChildByName('num').color = new cc.Color(colors[index]);
            btn.x = index >= 4 ? (index - 4 * parseInt(index / 4)) * (w + 36) + 86 : index * (w + 36) + 86;
            btn.y = -Math.ceil((index + 1) / 4) * (w + 40) + 80;
            // 判断关卡有没有解锁
            if (num == Global.gameInfo.saveLevel) {
                btn.getChildByName('index').active = true;
            } else if (num > Global.gameInfo.saveLevel) {
                btn.getChildByName('lock').active = true;
            }
            btn.parent = _node;
        }
        // 创建滑动页
        let createPage = (index) => {
            let page = new cc.Node('page');
            page.width = 580;
            page.height = 450;
            page.anchorX = 0;
            page.anchorY = 1;
            page.x = page.y = 0;
            page.parent = this.swiperContent;
            this.swiperContent.width = page.width * (index + 1);
            // 生成对应的按钮到该滑动页
            for (let i = 0; i < 12; i++) {
                if (!list[i + index * 12]) break;
                createBtn(i, i + index * 12, page);
            }
        }
        for (let i = 0; i < Math.ceil(list.length / 12); i++) {
            createPage(i);
        }
        // console.log(list.length, this.swiperContent.width);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.home = this;
        this.levelIndex.string = `当前玩到第：${Global.gameInfo.level + 1} 关`;
        cc.director.preloadScene('Game', () => console.log('预加载游戏场景成功'));
        this.outPutBtn();
    },

    start() {

    },

    // update (dt) {},
});