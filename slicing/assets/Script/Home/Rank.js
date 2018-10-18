

cc.Class({
    extends: cc.Component,

    properties: {
        friendButton: {
            default: null,
            type: cc.Node
        },
        wordButton: {
            default: null,
            type: cc.Node
        }
    },

    friendBtn() {
        if (this.btnType == 'friend') return;
        this.btnType = 'friend';
        this.friendButton.color = cc.hexToColor('#FFFFFF');
        cc.find('text', this.friendButton).color = cc.hexToColor('#6E9AB2');
        this.wordButton.color = cc.hexToColor('#1A7DED');
        cc.find('text', this.wordButton).color = cc.hexToColor('#FFFFFF');
        
    },

    wordBtn() {
        if (this.btnType == 'word') return;
        this.btnType = 'word';
        this.wordButton.color = cc.hexToColor('#FFFFFF');
        cc.find('text', this.wordButton).color = cc.hexToColor('#6E9AB2');
        this.friendButton.color = cc.hexToColor('#1A7DED');
        cc.find('text', this.friendButton).color = cc.hexToColor('#FFFFFF');
    },
    
    openShare() {
        wx.shareAppMessage({
            title: Global.shareInfo.title,
            imageUrl: Global.shareInfo.url,
            success(res) {
                console.log('分享成功回调===>', res);
                
            },
            fail(err) {
                console.log('分享失败信息===>', res);
            }
        });
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.btnType = 'friend';
    },

    // start () {},

    // update (dt) {},
});
