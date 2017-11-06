import React, {Component} from 'react';
import {View, requireNativeComponent} from 'react-native';


//  原生端 我的提醒页面 表格视图( 为了cell能够左滑删除 )
export default class NativeMyRemindView extends React.Component {

    // 对应原生端暴露的属性
    static propTypes = {
        datas: React.PropTypes.array,
    };

    render() {
        return <NativeTableView {...this.props} />
    }
}

/**
 *  字符串和原生端RCTViewManager子类中RCT_EXPORT_MODULE()括号中的参数一致,
 *  如果没有参数,应为RCTViewManager子类的类名去掉manager
 */
const NativeTableView = requireNativeComponent('NativeTableView', NativeMyRemindView);
