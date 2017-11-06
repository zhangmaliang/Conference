/**
 * Created by zhangmaliang on 2017/7/19.
 */

import * as types from '../ActionTypes';
import {UserDao} from '../../Storage/User'
import StorageUtil from '../../Utils/StorageUtil'


// 程序初始化/登录时需要加载的数据，比如当前登录用户，session等
export function setupData() {
    return dispatch => {
        UserDao.getCurrentUser().then(user => {
            StorageUtil.get('sessionId').then(sessionId=>{
                dispatch({
                    type: types.APP_SETUPDATA,
                    user,
                    sessionId
                })
            })
        })
    }
}