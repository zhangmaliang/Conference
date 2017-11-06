/**
 * Created by zhangmaliang on 2017/7/21.
 */


import {NetInfo} from 'react-native';


/**
 *
 *    该组件在模拟器上回调经常不准确，但是真机上测试是ok的
 *
 * */

const checkNetworkState = (callback) => {
    NetInfo.isConnected.fetch().done(isContected => callback(isContected))
};

const addNetworkStateEventListener = (handler) => {
    NetInfo.isConnected.addEventListener('change', handler);
};

const removeNetworkStateEventListener = (handler) => {
    NetInfo.isConnected.removeEventListener('change', handler);
};

export default{
    checkNetworkState,
    addNetworkStateEventListener,
    removeNetworkStateEventListener,
};
