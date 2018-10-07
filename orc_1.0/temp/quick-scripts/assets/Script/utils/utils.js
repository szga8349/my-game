(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/utils/utils.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fc3dbSXtGNNzoy77cUuteSg', 'utils', __filename);
// Script/utils/utils.js

'use strict';

// 本地储存数据
function saveData(key, data) {
    window.localStorage.setItem(key, JSON.stringify(data));
}
// 获取本地数据
function fetchData(name) {
    var data = window.localStorage.getItem(name) ? JSON.parse(window.localStorage.getItem(name)) : null;
    return data;
}
// 显示 loading
function showLoading(title) {
    if (wx.showLoading) {
        wx.showLoading({
            title: title,
            mask: true
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
function showToast() {
    var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '提示';
    var icon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'none';
    var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2000;

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
function showAlert(content) {
    var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '提示';
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    wx.showModal({
        title: title,
        content: content,
        showCancel: false,
        success: function success(res) {
            if (typeof callback === 'function') callback();
        }
    });
}
// 确认弹窗
function showConfirm(content) {
    var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '确认提醒';
    var successCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var failCallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    wx.showModal({
        title: title,
        content: content,
        showCancel: true,
        success: function success(res) {
            if (res.confirm) {
                if (typeof successCallback === 'function') successCallback();
            } else if (res.cancel) {
                if (typeof failCallback === 'function') failCallback();
            }
        }
    });
}
/**
 * 时间戳生成
 * 指定天数 num: 1时为明天，-1为昨天，以此类推
*/
function timeFormat() {
    var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    var _Appoint = void 0,
        month = void 0,
        day = void 0,
        hour = void 0,
        minute = void 0,
        second = void 0,
        date = void 0;
    if (num > 0) {
        _Appoint = new Date(new Date().getTime() + num * 24 * 3600 * 1000);
    } else {
        _Appoint = new Date(new Date() - num * 24 * 3600 * 1000);
    }
    month = ('0' + (_Appoint.getMonth() + 1)).slice(-2);
    day = ('0' + _Appoint.getDate()).slice(-2);
    hour = ('0' + _Appoint.getHours()).slice(-2);
    minute = ('0' + _Appoint.getMinutes()).slice(-2);
    second = ('0' + _Appoint.getSeconds()).slice(-2);
    date = _Appoint.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return date;
}
module.exports = {
    saveData: saveData,
    fetchData: fetchData,
    showLoading: showLoading,
    hideLoading: hideLoading,
    showToast: showToast,
    showAlert: showAlert,
    showConfirm: showConfirm,
    timeFormat: timeFormat
};

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
        //# sourceMappingURL=utils.js.map
        