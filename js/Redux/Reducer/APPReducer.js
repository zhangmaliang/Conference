/**
 * Created by zhangmaliang on 2017/7/27.
 */

import * as types from '../ActionTypes';


const initialState = {
    user: null,    // 当前登录用户的信息
    sessionId:null
};


export default function APPReducer(state = initialState, action) {
    switch (action.type) {

        case types.APP_SETUPDATA:
            return Object.assign({}, state, {
                user: action.user,
                sessionId:action.sessionId
            });

        default:
            return state;
    }
}
