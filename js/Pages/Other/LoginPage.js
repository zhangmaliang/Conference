/**
 * Created by zhangmaliang on 2017/7/19.
 */

import React, {Component} from 'react';
import {StyleSheet, View, Image, Animated, Text, TextInput, ScrollView, Keyboard} from 'react-native';
import NavigationUtil from '../../Utils/NavigationUtil'
import Button from '../../Component/Button'
import PopView from '../../Component/PopView'
import {CountDownButton} from '../../Component/Button'
import LoadingView from '../../Component/LoadingView'
import {connect} from 'react-redux';
import {
    login,
    phoneOrPasswordChanged,
    sendVertifyCode,
    getSendVertifyCodeState,
    getLoginState
} from '../../Redux/Actions/LoginAction'


// 登录页面还有个bug，就是一旦验证码发送完毕，状态置为2，则倒计时结束并没有还原。因要动封装组件，没必要就没改了
// 登录页面这种，最好别用redux
class LoginPage extends React.PureComponent {

    static navigationOptions = {
        header: null
    };

    componentWillReceiveProps(nextProp) {
        if (nextProp.loginState == 2) {
            NavigationUtil.reset(this.props.navigation, 'ConferencePage');
            this._resetState();
        }
    }

    render() {
        const textInput = (placeholderText, ref) => {
            let isPhone = ref == 'phoneInput';
            return (
                <TextInput
                    ref={ref}
                    placeholder={placeholderText}
                    placeholderTextColor={'gray'}
                    value={isPhone ? this.props.phone : this.props.password}
                    style={{ flex:1,fontSize:15,marginLeft:20}}
                    clearButtonMode='while-editing'
                    keyboardType='phone-pad'
                    onChangeText={text=>{
                        let [phone,password] = isPhone ? [text,this.props.password] : [this.props.phone,text];
                        this.props.phoneOrPasswordChanged(phone,password)
                    }}
                />
            )
        };

        const {loginState, canLogin, vertifyCodeState} = this.props;
        const promptMes = loginState == 1 ? '登录中...' : '验证码发送中...';

        return (
            <ScrollView
                alwaysBounceVertical={false}
                style={{flex:1}}
                keyboardShouldPersistTaps='always'
            >

                <View
                    style={{alignItems:'center',flex:1,height:SCREEN_HEIGHT}}
                    onStartShouldSetResponder={(event)=>this._onStartShouldSetResponder(event)}
                >
                    <Image source={require('../../../Resources/Images/Login/loginLogoImg.png')}
                           style={styles.imageStyle}/>
                    <Text style={styles.titleStyle}>云之讯</Text>

                    <View style={styles.inputViewStyle}>
                        <Text style={{fontSize:16}}>手机号码</Text>
                        {textInput('请输入手机号码', 'phoneInput')}
                        <View style={[CommonStyles.lineViewStyle,styles.lineViewStyle]}/>
                    </View>

                    <View style={styles.inputViewStyle}>
                        <Text style={{fontSize:16}}>验证码</Text>
                        {textInput('请输入验证码', 'passwordInput')}

                        <CountDownButton
                            normalText='发送验证码'
                            textStyle={{color:'blue'}}
                            sendState={vertifyCodeState}
                            onPress={()=>this.props.sendVertifyCode(this.props.phone)}
                            onLayout={event=>this._addEvent(event)}
                        />

                        <View style={[CommonStyles.lineViewStyle,styles.lineViewStyle]}/>
                    </View>

                    <Button
                        ref="button"
                        text='登陆'
                        containerStyle={[styles.loginBtnStyle,{backgroundColor:canLogin ? 'blue' :'rgb(200,200,200)'}]}
                        style={{color:'white',fontSize:17}}
                        disabled={!canLogin}
                        onPress={()=>this._login()}
                        onLayout={event=>this._addEvent(event)}
                    />

                    <LoadingView visible={vertifyCodeState == 1 || loginState == 1} text={promptMes}/>

                    <PopView
                        isPop={loginState == -1 || vertifyCodeState ==-1}
                        message='请输入正确的手机号码'
                        sureBlock={()=>this._resetState()}
                    />
                </View>
            </ScrollView>
        )
    }

    _resetState = () => {
        // 让状态还原，避免状态状态一直返回-1，页面无法刷新
        this.props.getSendVertifyCodeState(0);
        this.props.getLoginState(0)
    };

    _login() {
        this.props.login(this.props.phone, this.props.password);
    }


    events = [];
    // 该方法未执行，因为onLayout不是定义在真正响应事件的那里。若想，则要对Button再封装，将其传递到里面才行
    _addEvent = (event) => {
        this.events.push(event.nativeEvent.target)
    };

    _onStartShouldSetResponder(event) {
        let target = event.nativeEvent.target;
        if (!this.events.includes(target)) {
            Keyboard.dismiss()
        }
        return false;
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        width: 120,
        height: 120,
        marginTop: 60
    },
    titleStyle: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: 'bold'
    },
    inputViewStyle: {
        flexDirection: 'row',
        width: SCREEN_WIDTH * 0.9,
        marginTop: 20,
        height: 40,
        alignItems: 'center'
    },
    lineViewStyle: {
        width: SCREEN_WIDTH * 0.9,
        position: 'absolute',
        bottom: 0
    },
    loginBtnStyle: {
        width: SCREEN_WIDTH * 0.9,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        borderRadius: 5,
    }
});


export default connect((store) => {
    const {phone, password, canLogin, loginState, vertifyCodeState} = store.LoginReducer;
    return {
        phone, password, canLogin, loginState, vertifyCodeState,
    }
}, {login, phoneOrPasswordChanged, sendVertifyCode, getSendVertifyCodeState, getLoginState})(LoginPage);