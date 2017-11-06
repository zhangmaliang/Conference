/**
 * Created by zhangmaliang on 2017/7/19.
 */


import {NativeModules} from 'react-native';
import * as types from '../ActionTypes';
import {UserDao, User} from '../../Storage/User'
import ToastView from '../../Component/ToastView'
import StorageUtil from '../../Utils/StorageUtil'

const TCP = NativeModules.TCP;

export function login(phone, password) {

    return dispatch => {

        if (!_regexPhone(phone)) {
            dispatch(getLoginState(-1));
            return;
        }

        dispatch(getLoginState(1));

        let mes = {
            'phone': phone,
            'veryfyCode': password,
        };

        TCP.login(mes, (err, res, exta) => {

            if(res.status == 0 || res.desc == '登录成功'){
                UserDao.save(new User(phone, password));
                StorageUtil.save('sessionId',exta.sessionId);

                // 上面两个保存都是异步操作，无法同时保证一起被存储好。这里是因为采用的两种数据存储方式导致
                setTimeout(()=>{
                    dispatch(getLoginState(2));
                },1000)

            }else {
                dispatch(getLoginState(-1));
            }

            ToastView.show(res.desc,1.5)
        })
    }
}


export function sendVertifyCode(phone) {
    return dispatch => {

        if (!_regexPhone(phone)) {
            dispatch(getSendVertifyCodeState(-1));
            return;
        }

        dispatch(getSendVertifyCodeState(1));

        let mes = {'phone':phone};
        TCP.senderSecurityCode(mes, (err, res) => {
            if (res.desc == '验证码发送成功' || res.state == 1) {
                dispatch(getSendVertifyCodeState(2));
            } else {

            }
        });
    }
}

export function phoneOrPasswordChanged(phone, password) {
    if (phone.length > 11) {
        phone = phone.substring(0, 11);
    }
    if (password.length > 4) {
        password = password.substring(0, 4);
    }
    return {
        type: types.LOGIN_PHONE_PWD_DIDCHANGED,
        phone,
        password,
        canLogin: phone.length == 11 && password.length == 4
    }
}

export function getLoginState(loginState) {
    return {
        type: types.LOGIN_LOGIN,
        loginState
    }
}

export function getSendVertifyCodeState(vertifyCodeState) {
    return {
        type: types.LOGIN_SENDVERTIFYCODE,
        vertifyCodeState
    }
}

// 正则匹配手机格式
function _regexPhone(phone) {
    const regex = /^1\d{10}$/;
    return regex.test(phone);
}