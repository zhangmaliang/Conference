/**
 * Created by zhangmaliang on 2017/6/23.
 */

import { NavigationActions } from 'react-navigation';

export default class NavigationUtil{

    // Reset方法会清除原来的路由记录，添加上新设置的路由信息, 可以指定多个action，index是指定默认显示的那个路由页面
    static reset(navigation, routeName){
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName:routeName})]
        });
        navigation.dispatch(resetAction);
    }
}