/**
 * Created by zhangmaliang on 2017/7/20.
 */

import * as types from '../ActionTypes';
import AdressBookManager from '../../Utils/AdressBookManager'
import {ContactDao,Contact} from '../../Storage/Contact'


export function loadAddressBookData() {
    return dispatch => {

        let importContactPromise = ContactDao.getAllImportContacts();
        let addressBookPromise = AdressBookManager.getListViewDataWithAdressBook();

        // Promise.all,相当于OC中的dispatch_group。。。多个任务全部完成后回调
        Promise.all([importContactPromise, addressBookPromise]).then(([importContacts, data]) => {

            let importIdentifierSet = new Set(importContacts.map(contact => contact.identifier));
            let dataBlob = data.dataBlob;
            let keys = Object.keys(dataBlob);
            for (let key of keys) {
                let contact = dataBlob[key];
                if (!contact instanceof Contact) continue;
                if (importIdentifierSet.has(contact.identifier)) {
                    contact.isImport = true;
                }
            }
            dispatch({ // 异步操作必须用dispatch
                type: types.CONTACT_LOADDATA,
                data,
            })
        });
    }
}

export function clickedItem(contact, callBack) {
    return {
        type: types.CONTACT_ITEMCLICKED,
        contact,
        callBack
    }
}

export function cancelAndSelectAll(callBack) {
    return {
        type: types.CONTACT_CANCELORSELECTALL,
        callBack
    }
}

export function sureBtnClicked(callBack) {
    return {
        type: types.CONTACT_SUREBTNCLICKED,
        callBack
    }
}