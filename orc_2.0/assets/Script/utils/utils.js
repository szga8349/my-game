
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
    wx.showModal({
        title: title,
        content: content,
        showCancel: false,
        success(res) {
            if (typeof callback === 'function') callback();
        }
    });
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
module.exports = {
    saveData,
    fetchData,
    showLoading,
    hideLoading,
    showToast,
    showAlert,
    showConfirm,
    timeFormat
}