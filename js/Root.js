/**
 * Created by zhangmaliang on 2017/7/19.
 */

import {AppRegistry, ToastAndroid, BackHandler} from 'react-native';
import React, {PureComponent} from 'react';
import './Common/Global'
import {Provider} from 'react-redux';
import configureStore from './Redux/ConfigureStore'
import AppWithNavigationState from './APP'
import codePush from 'react-native-code-push'
import SplashScreen from 'react-native-splash-screen'
import NetInfo from './Utils/NetInfo'

if (!__DEV__) {
    global.console = {
        log: () => {
        }
    };
}


/*

 教程： http://www.jianshu.com/p/9e3b4a133bcc
 按照教程，将key添加到xcode中，我没有成功，只能在plist中手动填写

 codePush : Deployment Key
 Production : hzv2TZ50wNZm215ReaG10GoglM-xb8562e15-203e-49cf-97a1-99ccfc8d9073
 Staging    : _7pbIaUrUQa8ZDYSHHadJc5I0Muhb8562e15-203e-49cf-97a1-99ccfc8d9073


 js和图片打包命令(先创建好bundles文件夹，打包后导入到xcode时选择引用关系)
 react-native bundle --entry-file index.ios.js --bundle-output ./bundles/main.jsbundle --platform ios --assets-dest ./bundles --dev false

 自动发布命令：code-push release-react Redux_Teleconference ios
 code-push release-react Redux_Teleconference ios  --t 1.0.1 --dev false --d Staging --des "1.优化操作流程" --m true
 */

export default class Root extends PureComponent {

    componentDidMount() {
        codePush.sync();
        SplashScreen.hide();
        NetInfo.addNetworkStateEventListener(this._networkStateDidChange);
        BackHandler.addEventListener('hardwareBackPress', this._onBackAndroid);
    }

    componentWillUnmount() {
        NetInfo.removeNetworkStateEventListener(this._networkStateDidChange);
        BackHandler.removeEventListener('hardwareBackPress', this._onBackAndroid)
    }

    _networkStateDidChange = (isContected) => {
        global.isContected = isContected;
    };

    lastBackPressed;
    _onBackAndroid = () => {
        let now = new Date().getTime();
        if (now - this.lastBackPressed < 2500) {
            return false;
        }
        this.lastBackPressed = now;
        ToastAndroid.show('再点击一次退出应用', ToastAndroid.SHORT);
        return true;
    };

    render() {
        return (
            <Provider store={configureStore()}>
                <AppWithNavigationState />
            </Provider>
        )
    }
};


AppRegistry.registerComponent('Redux_Teleconference', () => Root);