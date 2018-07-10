import axios from 'axios';

// //页面请求获取签名
// function getSignName(time, data) {
//     if (window.isApp()) {
//         if (window.iosOrAndriod() == 'ios') {
//             return new Promise((resolve, reject) => {
//                 var randomFunc = "callback_" + time;
//                 window[randomFunc] = function(signStr) {
//                     resolve(signStr);
//                 }
//                 window.webkit.messageHandlers.jsiGetSign.postMessage(JSON.stringify({ time: time, data: data, callback: randomFunc }));
//             });
//         } else if (window.iosOrAndriod() == 'android') {


//             return window.signature.jsiGetSign(time + '', JSON.stringify(data));
//         }
//     }
// }

//设置服务器环境
function setServerEnvironment(config) {
    //服务器环境常量
    let serverEnvironment = {
        // 'sst': 'http://10.10.0.53:8081/tps',
        'sst': 'http://10.32.16.131:10901/tps',
        'sit': 'http://10.32.16.107:10901/tps',
        'pre': 'http://10.32.16.18:10901/tps',
        'prd': 'https://api.blackfish.cn/btc/tps'
    }
    let urlType = window.getCookie('serverEnvironment') || 'prd';
    if (!window.isApp()) {
        urlType = 'sit';
    }
    let baseUrl = serverEnvironment[urlType];
    config.url = baseUrl + config.url;
    if (urlType == 'sst' || urlType == 'sit') {
        config.timeout = 30000;
    } else {
        config.timeout = 21000;
    }
    return config;
}
//window原生默认调用
window.BFBridge = window.BFBridge || {}
    // window.BFBridge.canGoBack = function() {

//     return false
// }

//埋点全部处理
import Vue from 'vue';



//请求拦截
axios.interceptors.request.use(async(config) => {
    // let millionTime = new Date().getTime();
    // let signName = await getSignName(millionTime, config.data);

    // config = await setServerEnvironment(config);

    // let token = '';
    // let phone = '';
    // if (window.getCookie('serverEnvironment') == 'sit') {
    //     token = window.getCookie("token") || '';
    //     phone = window.getCookie("phoneNumber") || '';
    // }
    // 在发起请求请做一些业务处理
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // config.headers['BTC-TPS-REQ-MOCK'] = 'mock';
    if (0) {
        alert('app')
        config.data = {
            "baseParams": {
                "platformId": window.iosOrAndriod(), //平台
                "appName": window.getCookie("appName") || '',
                "appType": window.getCookie("appType") || '',
                "appVersion": window.getCookie("appVersion") || '',
                "deviceIdSm": window.getCookie("deviceIdSm") || '',
                "deviceName": window.getCookie("deviceName") || '',
                "deviceToken": window.getCookie("deviceToken") || '',
                "deviceType": window.getCookie("deviceType") || '',
                "fingerPrint": window.getCookie("fingerPrint") || '',
                "locateAddress": window.getCookie("locateAddress") || '',
                "locateCity": window.getCookie("locateCity") || '',
                "locateDistrict": window.getCookie("locateDistrict") || '',
                "locationProvince": window.getCookie("locationProvince") || '',
                "memberSign": window.getCookie("memberSign") || '',
                "network": window.getCookie("network") || '',
                "networkOperator": window.getCookie("networkOperator") || '',
                "os": window.getCookie("os") || '',
                "osVersion": window.getCookie("osVersion") || '',
                "pValue": window.getCookie("pValue") || '',
                "screenHeight": window.getCookie("screenHeight") || '',
                "screenResolution": window.getCookie("screenResolution") || '',
                "serverEnvironment": window.getCookie("serverEnvironment") || '',
                "statusBarHeight": window.getCookie("statusBarHeight") || '',
                "termId": window.getCookie("termId") || '',
                "termModel": window.getCookie("termModel") || '',
                "termSysVersion": window.getCookie("termSysVersion") || '',
                "wifiMac": window.getCookie("wifiMac") || '',
                "wifiSsid": window.getCookie("wifiSsid") || '',
                "position": { //定位信息,可以为空
                    "lon": window.getCookie("lon"), //经度
                    "lat": window.getCookie("lat") //纬度
                }
            },
            "token": window.getCookie("token") || token,
            "phoneNumber": window.getCookie("phoneNumber") || phone,
            "timestamp": String(millionTime), //时间戳
            "sign": signName, //签名
            'bizParams': config.data,

            //模拟数据
            // "mockFlag": '1',
        }
    } else {
        alert('else')
        config.data = {
            "baseParams": {
                "platformId": "ios", //平台
                "termSysVersion": "6.0", //系统版本号
                "termModel": "flyme PRO 6", //设备型号
                "termId": "b42885d1c9d820f1", //设备唯一标识
                "fingerPrint": "7e36f580077c4de9a8e8e3db79ceabc1", //设备指纹,可以为空
                "network": "WIFI", //网络,可以为空
                "networkOperator": "unknown", //网络运营商,可以为空
                "majorAppVersion": "1.3.0", //主APP版本号
                "appType": "", //app类型,可以为空
                "appVersion": "1.3.0", //app版本号
                "pValue": "", //p值
                "deviceType": "APP", //设备类型， app："APP", m站："H5"
                "locationProvince": "江苏", //定位省
                "locateCity": "南京", //定位市
                "locateDistrict": "仙林", //定位区
                "position": //定位信息,可以为空
                {
                    "lon": "111", //经度
                    "lat": "222" //纬度
                }
            },
            clientTypeFlag: 'h5',
            "token": '',
            "phoneNumber": '13812345678',
            "timestamp": "2017-02-10 23:23:12", //时间戳
            "sign": "No Sign", //签名
            'bizParams': config.data,
            //模拟数据
            // "mockFlag": '1',
        }
    }
    return config;
}, function(error) {
    // 对请求失败做处理
    alert('调方法了')
    return Promise.reject(error);
});