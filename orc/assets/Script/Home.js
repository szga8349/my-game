const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    openGame() {
        cc.director.loadScene('Game');
    },
    openRank () {
        cc.director.loadScene('Rank');
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.preloadScene('Game', () => console.log('预加载游戏场景成功'));
    },

    start () {
        if (window.wx) {
            // 检测用户是否授权过
            wx.getUserInfo({
                success(res) {
                    console.log('用户授权信息====>', res);
                },
                fail() {
                    let _w = wx.getSystemInfoSync().windowWidth, 
                        _h = wx.getSystemInfoSync().windowHeight;
                    console.warn('创建获取用户信息按钮');
                    // 创建获取用户信息按钮
                    let loginBtn = wx.createUserInfoButton({
                        type: 'text',
                        text: '',
                        style: {
                            left: 0,
                            top: 0,
                            width: _w,
                            height: _h,
                            lineHeight: _h,
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            color: 'rgba(0, 0, 0, 0)',
                            textAlign: 'center',
                            fontSize: 16,
                            borderRadius: 4
                        }
                    });
                    // 监听点击事件
                    loginBtn.onTap(res => {
                        console.log('用户授权数据：', res);
                        if (res.errMsg != 'getUserInfo:ok') return;
                        loginBtn.destroy();
                    });
                }
            });
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

    // update (dt) {},
});
