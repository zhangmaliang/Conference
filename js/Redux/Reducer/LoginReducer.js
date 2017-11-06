/**
 * Created by zhangmaliang on 2017/7/19.
 */

import * as types from '../ActionTypes';


const initialState = {
    phone: '',
    password: '',
    canLogin: false,
    loginState:0,               // 0未登录。 1登录中。 2已登录. -1手机号码格式不对
    vertifyCodeState:0          // 验证码发送状态。 0未发送，1发送中，2已发送，-1手机号码格式不对
};


/*
*   Reducer注意点：连续两次回调的内容如果是一样的，并不会触发store改变，页面不会刷新
*                 比如此处，若手机号码填写错误连续点击发送验证码两次，因为回调都是-1，没有改变状态，页面不会刷新
*                 此处采用弹出提示框确认后将vertifyCodeState修改回0的方法处理。具体见登录页面PopView点击确认方法
* */
export default function LoginReducer(state = initialState, action){
    switch (action.type) {

        case types.LOGIN_SENDVERTIFYCODE:
            return Object.assign({}, state, {
                vertifyCodeState: action.vertifyCodeState,
            });

        case types.LOGIN_LOGIN:
            return Object.assign({}, state, {
                loginState: action.loginState,
            });

        case types.LOGIN_PHONE_PWD_DIDCHANGED:
            return Object.assign({}, state, {
                phone: action.phone,
                password: action.password,
                canLogin: action.canLogin,
            });

        default:
            return state;
    }
}
