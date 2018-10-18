const CusBase64 = require('base64');
// 域名
const baseUrl = 'http://192.168.1.120:8082';

// 共用参数
let openId = '';
let appid = 'wx7e07d11620f9b62d';
let appkey = '513dcfad4e014a5ed5d7842f09777904';

// 公用请求
function baseRequest(method, url, data, success, fail) {
    wx.request({
        url: baseUrl + url,
        method: method,
        header: {
            'content-type': 'application/json'
        },
        data: data,
        success(res) {
            if (typeof success === 'function') success(res.data);
        },
        fail(err) {
            if (typeof fail === 'function') fail(err);
            wx.showModal({
                title: '数据请求提示',
                content: '请求出错了~',
                showCancel: false,
                success(res) {
                    console.log(res);
                }
            });
        }
    });
}

// 获取openId
function getOpenId(info, loginInfo, successCB, errCB) {
    let str = { 
        encryptedData: info.encryptedData, 
        iv:  info.iv, 
        code: loginInfo.code, 
        wxspAppid: appid, 
        wxspSecret: appkey
    };
    let base64 = CusBase64.CusBASE64.encoder(JSON.stringify(str)); 
    baseRequest('POST', '/wxsplogin/decodeUserInfo', {
        'object': base64
    }, res => {
        console.log('获取openId成功=====>', res);
        if (res.code == 0) {
            openId = res.openId;
            if (typeof successCB === 'function') successCB(res);
        } else {
            if (typeof errCB === 'function') errCB();
        }
    }, err => {
        console.log('获取openId失败=====>', err);
        if (typeof errCB === 'function') errCB();
    });
}

// 保存数据
function saveData(userData, successCB, errCB) {
    let str = {
        openId: openId,
        appid: appid,
        gameTime: new Date(),
        dataJson: JSON.stringify(userData)
    }
    let base64 = CusBase64.CusBASE64.encoder(JSON.stringify(str)); 
    baseRequest('POST', '/usergamedata/archiving', {
        'object': base64
    }, res => {
        if (typeof successCB === 'function') successCB(res);
    }, err => {
        if (typeof errCB === 'function') errCB(err);
    });
}

// 获取数据
function fetchData(successCB, errCB) {
    let str = {
        openId: openId,
        appid: appid
    }
    let base64 = CusBase64.CusBASE64.encoder(JSON.stringify(str)); 
    baseRequest('POST', '/usergamedata/reading', {
        "object": base64
    }, res => {
        if (typeof successCB === 'function') successCB(res);
    }, err => {
        if (typeof errCB === 'function') errCB(err);
    });
}
module.exports = { 
    getOpenId,
    saveData,
    fetchData
}