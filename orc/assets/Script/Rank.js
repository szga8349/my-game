

cc.Class({
    extends: cc.Component,

    properties: {
        // 子项目容器
        subBox: {
            default: null,
            type: cc.Sprite
        }
    },
    openShare() {
        wx.shareAppMessage({
            title: Global.shareInfo.title,
            imageUrl: Global.shareInfo.url
        });
    },
    backGame() {
        if (window.wx) wx.postMessage({ action: 'hide' });
        cc.director.loadScene('Game');
    },
    backHome() {
        cc.director.loadScene('Home');
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (window.wx) {
            wx.postMessage({ 
                action: 'show'
            });
        }
    },

    start () {
        if (window.wx) {
            // 设置一个子项目canvas
            this.sub = new cc.Texture2D();
            // 显示分享按钮
            wx.showShareMenu();
            // 设置转发分内容
            wx.onShareAppMessage(res => {
                return {
                    title: Global.shareInfo.title,
                    imageUrl: Global.shareInfo.url,
                }
            });
        }
    },

    updaetSubDomainCanvas() {
        if (!this.sub) return;
        let openDataContext = wx.getOpenDataContext();
        let sharedCanvas = openDataContext.canvas;
        this.sub.initWithElement(sharedCanvas);
        this.sub.handleLoadedTexture();
        this.subBox.spriteFrame = new cc.SpriteFrame(this.sub);
    },
    
    update (dt) {
        this.updaetSubDomainCanvas();
    },
});
