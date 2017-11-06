/**
 * Created by zhangmaliang on 2017/7/19.
 */

import React, {Component} from 'react';
import {Image, Text, Platform} from 'react-native';
import {connect} from 'react-redux';
import {StackNavigator, TabNavigator, addNavigationHelpers} from 'react-navigation';
import Splash from './Pages/Other/Splash'
import GuidePage from './Pages/Other/GuidePage'
import LoginPage from './Pages/Other/LoginPage'
import ConferencePage from './Pages/Conference/ConferencePage'
import ContactPage from './Pages/Contact/ContactPage'
import MinePage from './Pages/Mine/MinePage'
import MineRemindPage from './Pages/Mine/MineRemindPage'
import ContactImportPage from './Pages/Contact/ContactImportPage'
import ContactDetailPage from './Pages/Contact/ContactDetailPage'
import ContactEditPage from './Pages/Contact/ContactEditPage'
import ConferencePeopleSelectPage from './Pages/Conference/ConferencePeopleSelectPage'
import ConferenceDetailPage from './Pages/Conference/ConferenceDetailPage'
import ConferenceTitlePage from './Pages/Conference/ConferenceTitlePage'
import ConferenceTimePage from './Pages/Conference/ConferenceTimePage'
import ConferencePeoplePage from './Pages/Conference/ConferencePeoplePage'
import ModalPage from './Pages/Other/ModalPage'
import {NavBackArrowItem} from './Common/CommonView'

const tabbarIcon_Mine = require('../Resources/Images/Tabbar/tab_MineNormal@3x.png');
const tabbarIcon_Phone = require('../Resources/Images/Tabbar/tab_PhoneNormal@3x.png');
const tabbarIcon_AddressBook = require('../Resources/Images/Tabbar/tab_AddressBookNormal@3x.png');

const TabOptions = (title, icon) => {
    const tabBarLabel = title;
    const tabBarIcon = (({tintColor}) => {
        return <Image source={icon} style={{height:25,width:25,tintColor: tintColor}}/>
    });
    return {tabBarLabel, tabBarIcon};
};

// 我的页面，modal出页面方式。现在使用问题：项目无法再使用导航栏的reset功能
const MineStack = StackNavigator({
    MinePage: {
        screen: MinePage,
        navigationOptions: {
            ...TabOptions('我的', tabbarIcon_Mine)
        }
    },
    ModalPage: {
        screen: ModalPage,
        navigationOptions: {
            gesturesEnabled: false,    // gesturesEnabled属性，只在具体的某个组件处设置才有效
            tabBarVisible: false
        }
    },
}, {
    mode: 'modal',
});

const HomeTabBar = TabNavigator({
    ConferencePage: {
        screen: ConferencePage,
        navigationOptions: {
            ...TabOptions('电话会议', tabbarIcon_Phone)
        }
    },
    ContactPage: {
        screen: ContactPage,
        navigationOptions: {
            ...TabOptions('联系人', tabbarIcon_AddressBook)
        }
    },
    MinePage: {
        // screen: MineStack,
        // navigationOptions: {
        //     header:null
        // }
        screen: MinePage,
        navigationOptions: {
            ...TabOptions('我的', tabbarIcon_Mine)
        }
    }
}, {
    lazy: true,              // 多个tabbar懒加载效果
    animationEnabled: false, // 切换页面时不显示动画
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 禁止左右滑动
    backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
    tabBarOptions: {
        activeTintColor: '#0F9C00', // 文字和图片选中颜色
        inactiveTintColor: '#999', // 文字和图片默认颜色
        showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
        indicatorStyle: {height: 0}, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了， 不知道还有没有其它方法隐藏？？？
        style: {
            backgroundColor: '#fff', // TabBar 背景色
        },
        labelStyle: {
            fontSize: 12, // 文字大小
        },
    },
});


const FirstPageNames = ['ConferencePage', 'ContactPage', 'MinePage'];
export const APP = StackNavigator({
    Splash: {screen: Splash},
    GuidePage: {screen: GuidePage},
    ConferencePage: {screen: HomeTabBar},
    LoginPage: {screen: LoginPage},
    MineRemindPage: {screen: MineRemindPage},
    ContactImportPage: {screen: ContactImportPage},
    ContactEditPage: {screen: ContactEditPage},
    ContactDetailPage: {screen: ContactDetailPage},
    ConferencePeopleSelectPage: {screen: ConferencePeopleSelectPage},
    ConferenceDetailPage: {screen: ConferenceDetailPage},
    ConferenceTitlePage: {screen: ConferenceTitlePage},
    ConferenceTimePage: {screen: ConferenceTimePage},
    ConferencePeoplePage: {screen: ConferencePeoplePage},
}, {

    headerMode: 'screen',  // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    mode: 'card',          // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)

    navigationOptions: ({navigation}) => {
        let isFirstPage = FirstPageNames.includes(navigation.state.routeName);
        return {
            headerStyle: {
                backgroundColor: '#3e9ce9',
                borderBottomWidth:0,    // ios
                elevation: 0,           // android
                shadowOpacity:0
            },
            headerTitleStyle: {
                color: '#fff',
                fontSize: 20,
                alignSelf: 'center'       // android标题居中
            },
            headerTintColor: '#fff',
            headerLeft: isFirstPage ? null : <NavBackArrowItem onPress={()=>navigation.goBack()}/>
        }
    },
});


class AppWithNavigationState extends Component {
    render() {
        const {dispatch, NavReducer} = this.props;
        return (
            <APP navigation={addNavigationHelpers({
                dispatch: dispatch,
                state: NavReducer
            })}/>
        );
    }
}

export default connect(store => {
    return {
        NavReducer: store.NavReducer
    }
})(AppWithNavigationState);