/**
 * Created by zhangmaliang on 2017/7/19.
 */


import * as types from '../ActionTypes';
import Request from '../../Utils/Request'

// 加载会议列表
export function loadConferenceListData({page, pageSize, topic, phone, isLoadMore = false}) {

    let orignalPage = page;

    isLoadMore ? page++ : page = 1;

    let params = {page, pageSize, topic, phone};

    return dispatch => {

        dispatch({
            type: isLoadMore ? types.CONFERENCE_LIST_LOADDATA_LOADMORE : types.CONFERENCE_LIST_LOADDATA_REFRESH,
            page
        });

        Request.get(Request.CONFERENCE_LIST, params, res => {

            dispatch({
                type: types.CONFERENCE_LIST_LOADDATA_SUCCESS,
                lists: res.result,
                total: res.total,
                page
            })

        }, err => {
            dispatch({
                type: types.CONFERENCE_LIST_LOADDATA_ERROR,
                page: orignalPage    // 如果本次请求失败，则页数回归原先的
            });
        })
    }
}


// 查看用户是否有创建会议权限
export function loadUserPermission(phone) {
    let params = {phone};

    return dispatch => {
        Request.get(Request.CREATE_PERSSION, params, res => {
            console.log(res);
            dispatch({
                type: types.CONFERENCE_LIST_PERMISSION,
                permission: res.result.statCode == 0
            })
        }, err => {

        })
    }
}

// 删除某一项会议item
export function deleteConferenceItem(rowData) {
    let params = {
        'id': rowData.id
    };
    return dispatch => {
        Request.get(Request.CONFERENCE_LIST_DELETE, params, res => {
            dispatch({
                type: types.CONFERENCE_LIST_DELETEITEM,
                rowData
            })
        }, err => {

        })
    }
}


// 创建会议组
export function createConferenceGroup(topic, creatorPhone, callBack) {
    let params = {topic, creatorPhone};
    return dispatch => {
        Request.get(Request.CREATE_GROUP, params, res => {

            callBack(res.result)
        }, err => {
            console.log(err);
        })
    }
}


