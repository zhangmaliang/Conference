/**
 * Created by zhangmaliang on 2017/7/20.
 */

import * as types from '../ActionTypes';
import {ContactDao} from '../../Storage/Contact'



export function loadImportContacts() {
    return dispatch => {
        ContactDao.getListViewDataOfImportContacts().then(data => {
            dispatch({ // 异步操作必须用dispatch
                type: types.CONFERENCE_LOADDATA,
                data: data,
            })
        })
    }
}

export function itemClicked(clickedContact) {
    return{
        type: types.CONFERENCE_ITEMCLICKED,
        clickedContact
    }
}

export function mobileClicked(clickedContact, mobile) {
    return{
        type: types.CONFERENCE_MOBILELICKED,
        clickedContact,
        mobile
    }
}
