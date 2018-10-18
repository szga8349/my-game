// 本地储存数据
function saveData(key, data) {
    window.localStorage.setItem(key, JSON.stringify(data));
}
// 获取本地数据
function fetchData(name) {
    let data = window.localStorage.getItem(name) ? JSON.parse(window.localStorage.getItem(name)) : null;
    return data;
}
// 显示 loading
function showLoading(title) {
    if (wx.showLoading) {
        wx.showLoading({
            title: title,
            mask: true,
        });
    }
}
// 隐藏 loading
function hideLoading() {
    if (wx.hideLoading) wx.hideLoading();
}
/**
 * 显示 toast
 * @param {string} title 提示文字
 * @param {string} icon type: 'success', 'loading', 'none'
 * @param {number} time 时间
 */
function showToast(title = '提示', icon = 'none', time = 2000) {
    if (window.wx) {
        // wx.showToast
        wx.showToast({
            title: title,
            icon: icon,
            duration: time
        });
    } else {
        alert(title);
    }
}
// 弹窗
function showAlert(content, title = '提示', callback = null) {
    if (window.wx) {
        wx.showModal({
            title: title,
            content: content,
            showCancel: false,
            success(res) {
                if (typeof callback === 'function') callback();
            }
        });
    } else {
        alert(content);
    }
    
}
// 确认弹窗
function showConfirm(content, title = '确认提醒', successCallback = null, failCallback = null) {
    wx.showModal({
        title: title,
        content: content,
        showCancel: true,
        success(res) {
            if (res.confirm) {
                if (typeof successCallback === 'function') successCallback();
            } else if (res.cancel) {
                if (typeof failCallback === 'function') failCallback();
            }
        },
    });
}
/**
 * 时间戳生成
 * 指定天数 num: 1时为明天，-1为昨天，以此类推
*/
function timeFormat(num = 0) {
    let _Appoint, month, day, hour, minute, second, date;
    if (num > 0) {
        _Appoint = new Date(new Date().getTime() + (num * 24 * 3600 * 1000));
    } else {
        _Appoint = new Date(new Date() - (num * 24 * 3600 * 1000));
    }
    month = ('0' + (_Appoint.getMonth() + 1)).slice(-2);
    day = ('0' + _Appoint.getDate()).slice(-2);
    hour = ('0' + _Appoint.getHours()).slice(-2);
    minute = ('0' + _Appoint.getMinutes()).slice(-2);
    second = ('0' + _Appoint.getSeconds()).slice(-2);
    date = `${_Appoint.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`
    return date;
}

// 微信接口类：

/**
 * 获取用户信息
 * @param {function} successCB 
 * @param {function} failCB 
 * loginInfo => 登录信息
 * res => 用户信息
 */
function checkLogin(successCB, failCB) {
    wx.login({
        success(loginInfo) {
            wx.getUserInfo({
                success(res) {
                    console.log('用户授权信息====>', res);
                    if (typeof successCB === 'function') successCB(loginInfo, res);
                },
                fail() {
                    let _w = wx.getSystemInfoSync().windowWidth,
                        _h = wx.getSystemInfoSync().windowHeight;
                    console.log('创建获取用户信息按钮');
                    // 创建获取用户信息按钮 （全屏透明）
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
                        if (typeof successCB === 'function') successCB(loginInfo, res);
                        loginBtn.destroy();
                    });
                }
            });
        },
        fail(loginErr) {
            console.log('登录失败=====>', loginErr);
            if (typeof successCB === 'function') failCB(loginErr);
        },
    });
}

/**
 * 观看视频
 * @param {function} callback 成功观看完15秒回调
 * @param {function} cancel 提前关闭回调
 * @param {string} videoId 广告id
 */    
function viewVideo(callback, cancel, videoId) {
    console.log('看视频');
    if (wx.createRewardedVideoAd) {
        console.log('执行广告视频播放');
        // 开打开视频播放
        let videoAd = wx.createRewardedVideoAd({
            adUnitId: videoId
        });
        // console.log('当前版本号', wx.getSystemInfoSync().SDKVersion);
        showLoading('视频加载中');
        videoAd.load().then(() => {
            hideLoading();
            videoAd.show();
        }).catch(err => {
            hideLoading();
            // 出错了
            showAlert('没有广告可播放啦');
            cancel();
        });
        videoAd.onClose(res => {
            if (res == undefined || res.isEnded == undefined || res.isEnded == true) {
                // 广告正常播放完
                callback();
            } else {
                // 提前关闭了广告
                cancel();
            }
        });
    } else {
        // 微信版本不支持广告
        showAlert('当前微信版本不支持播放广告');
        cancel();
    }
}

module.exports = {
    saveData,
    fetchData,
    showLoading,
    hideLoading,
    showToast,
    showAlert,
    showConfirm,
    timeFormat,
    checkLogin,
    viewVideo
}