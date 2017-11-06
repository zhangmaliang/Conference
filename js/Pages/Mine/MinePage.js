/**
 * Created by zhangmaliang on 2017/7/19.
 */

import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, Image, Modal, TouchableOpacity} from 'react-native';
import PopView from '../../Component/PopView'
import {CommonButton} from '../../Component/Button'
import {UserDao} from '../../Storage/User'
import NavigationUtil from '../../Utils/NavigationUtil'


const MyRemindImage = require('../../../Resources/Images/Mine/mine_MyRemind.png');
const AboutUsImage = require('../../../Resources/Images/Mine/mine_AboutUs.png');


export default class MinePage extends React.PureComponent {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            user: '',
        };
    }

    componentDidMount() {
        UserDao.getCurrentUser().then(user => this.setState({user}));
    }

    render() {
        return (
            <View style={Styles.containerStyle}>

                <View style={Styles.headerViewStyle}>
                    <Text style={Styles.titleStyle}>个人中心</Text>
                    <Image source={require('../../../Resources/Images/Mine/mineIcon.png')}
                           style={Styles.iconStyle}/>
                    <Text style={Styles.phoneStyle}>{this.state.user.phone}</Text>
                </View>

                <View style={{marginTop:10}}>
                    {this._renderRow(MyRemindImage, '我的提醒', () => {
                        this.props.navigation.navigate('MineRemindPage')
                    })}
                    {this._renderRow(AboutUsImage, '关于我们', () => {
                        alert(222)
                    })}
                </View>

                <CommonButton
                    style={Styles.logoutBtnContainerStyle}
                    textStyle={{color: 'red', fontSize: 17}}
                    onPress={()=>this._showPopView()}
                >
                    退出登录
                </CommonButton>

            </View>
        )
    }

    _renderRow(image, title, callBack) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={()=>callBack()}>
                <View style={Styles.rowStyle}>
                    <Image source={image} style={Styles.rowLeftIconStyle}/>
                    <Text style={Styles.rowTitleStyle}>{title}</Text>
                    <Image source={require('../../../Resources/Images/Arrow/main_rightImg.png')}
                           style={Styles.rowRightIconStyle}/>
                </View>
            </TouchableOpacity>
        )
    }

    _showPopView=()=>{
        PopView.show({
            isSingleBtn:false,
            message:'确定退出登录？',
            sureBlock:()=>this._logout()
        })
    };

    _logout() {
        // realm数据库，增删改操作时，数据库会做一个被修改的标记，此前所有数据库的查询操作结果，下一次使用时都会重新去查询一次。
        // 在该处，因为已经删除了数据库信息，假若此时刷新页面，导致查询结果user.phone被使用，则会重新去数据库查询,造成崩溃
        UserDao.deleteCurrentUser();
        NavigationUtil.reset(this.props.navigation, 'LoginPage');
    }
}


const Styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: 'rgb(222,222,222)'
    },
    headerViewStyle: {
        width: SCREEN_WIDTH,
        height: 230,
        alignItems: 'center',
        backgroundColor: '#3e9ce9',
    },
    titleStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 30
    },
    iconStyle: {
        borderRadius: 5,
        resizeMode: 'contain',
        marginTop: 45,
    },
    phoneStyle: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 15
    },
    rowStyle: {
        width: SCREEN_WIDTH,
        height: 50,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center'
    },
    rowLeftIconStyle: {
        marginLeft: 15,
    },
    rowTitleStyle: {
        fontSize: 17,
        marginLeft: 8
    },
    rowRightIconStyle: {
        position: 'absolute',
        right: 15
    },
    logoutBtnContainerStyle: {
        marginTop: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: 50,
    }
});