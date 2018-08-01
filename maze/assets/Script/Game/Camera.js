const Global = require("Global")

cc.Class({
    extends: cc.Component,

    properties: {
        // 设置一个目标为摄像机的中心点
        target: {
            default: null,
            type: cc.Node
        },
        // 旋转终点值
        endValue: 0,
        // 画面旋转速度
        speed: 5,
    },
    // 暂停 & 继续
    stateSwitch() {
        if (!Global.game.gameover) {
            this.node.getChildByName('pause').getChildByName('Label').getComponent(cc.Label).string = '开始';
            // cc.director.pause();
        } else {
            this.node.getChildByName('pause').getChildByName('Label').getComponent(cc.Label).string = '暂停';
            // cc.director.resume();
        }
        Global.game.gameover = !Global.game.gameover;
    },
    // 整个画面旋转
    canvasRotate() {
        let value = this.node.rotation;
        if (value == this.endValue) return;
        if (this.endValue > value) {
            this.node.rotation += this.speed;
            if (this.node.rotation > this.endValue) this.node.rotation = this.endValue;
        } else {
            this.node.rotation -= this.speed;
            if (this.node.rotation < this.endValue) this.node.rotation = this.endValue;
        }
    },
    // 随机旋转值
    randomRotate() {
        let value = this.node.rotation;
        let random = () => {
            let abs = parseInt(1 * Math.random()) == 1 ? 1 : -1;
            if (this.endValue < 0) abs = 1;
            let max = 180, min = 45;
            let num = (parseInt(Math.random() * (max - min + 1) + min)) * abs;
            if (Math.abs(num) == value) {
                return random();
            } else {
                return num;
            }
        }
        this.schedule(() => {
            if (Global.game.gameover) return;
            this.endValue = random();
        }, 3);
        // console.log(value);
    },
    // 点击旋转
    clickRotate() {
        let values = [0, 90, 180, -90];
        switch (Global.game.direction) {
            case 'left':
                this.endValue = values[1];
                break;
            case 'right':
                this.endValue = values[3];
                break;
            case 'top':
                this.endValue = values[0];
                break;
            case 'down':
                this.endValue = values[2];
                break;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    /**
     * 当组件的 enabled 属性从 false 变为 true 时，或者所在节点的 active 属性从 false 变为 true 时，会激活 onEnable 回调。
     * 倘若节点第一次被创建且 enabled 为 true，则会在 onLoad 之后，start 之前被调用。
     */
    onEnable () {
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
    },

    /**
     * 当组件的 enabled 属性从 true 变为 false 时，或者所在节点的 active 属性从 true 变为 false 时，会激活 onDisable 回调。
     */
    onDisable () {
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    },

    onLoad () {
        this.camera = this.getComponent(cc.Camera);
        // this.randomRotate();
    },

    start () {

    },

    update (dt) {
        if (Global.game.gameover) return;
        // 监测目标设为中心点
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
        // 上下移动时候
        // let ratio = targetPos.y / cc.winSize.height;
        // this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;

        // 摄像机旋转过渡
        this.canvasRotate();
    },

    // lateUpdate(dt) {},
});
