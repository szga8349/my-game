const Global = require('Global');

// 按钮 UI 类

cc.Class({
    extends: cc.Component,

    properties: {
        // 摁下去缩放值
        touchScale: 0.85,
        // 动画过渡时间
        transDuration: 0.1,
        // 摁下去的透明度
        touchOpacity: 255,
        // 是否需要点击动画
        isClick: false,
        // 按钮变灰
        isThin: false,
        // 点击音效
        clickAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // 点击动画
    clickMove() {
        this.node.stopAllActions();
        let seq = cc.sequence(cc.scaleTo(0.1, 1.1, 1.1), cc.scaleTo(0.1, 0.8, 0.8), cc.scaleTo(0.1, 1.2, 1.2), cc.scaleTo(0.1, 1, 1));
        this.node.runAction(seq);
    },

    onTouchDown(e) {
        // cc.log('摁下');
        if (this.isThin) {
            this.node.color = cc.hexToColor('#8c8c8c');
        } else {
            this.node.stopAllActions();
            this.node.runAction(cc.scaleTo(this.transDuration, this.touchScale));
            this.node.opacity = this.touchOpacity;
        }

        if (!Global.musicInfo.state) {
            if (this.clickAudio) cc.audioEngine.play(this.clickAudio);
        }
    },

    onTouchUp(e) {
        // cc.log('松开');
        if (this.isThin) {
            this.node.color = cc.hexToColor('#ffffff');
        } else {
            this.node.stopAllActions();
            this.node.runAction(cc.scaleTo(this.transDuration, this.initScale));
            this.node.opacity = this.initOpacity;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (!this.isClick) {
            this.initScale = this.node.scale;
            this.initOpacity = this.node.opacity;
            // console.log('透明度', this.initOpacity);
            this.node.on('touchstart', this.onTouchDown, this);
            this.node.on('touchend', this.onTouchUp, this);
            this.node.on('touchcancel', this.onTouchUp, this);
        }
    },

    // start () {},

    // update (dt) {},
});
