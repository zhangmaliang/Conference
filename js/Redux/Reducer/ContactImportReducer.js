/**
 * Created by zhangmaliang on 2017/7/20.
 */

import {ListView} from 'react-native';
import * as types from '../ActionTypes';
import {ContactDao} from '../../Storage/Contact'
import ObjectUtil from '../../Utils/ObjectUtil'
import ArrayUtil from '../../Utils/ArrayUtil'

const initialState = {
    data: {},                            // ListView的数据源，{dataBlob,sectionIds,rowIds}
    selectContacts: [],
    selectNum: 0,                        // 当前选择的人数个数
    canSelectAll: true,                  // 当选择人数没有达到上限时为true

    dataSource: new ListView.DataSource({
        getSectionData: (dataBlob, sectionID) => dataBlob[sectionID],
        getRowData: (dataBlob, sectionID, rowID) => dataBlob[sectionID + ":" + rowID],
        rowHasChanged: (r1, r2) => r1.isSelect !== r2.isSelect,     // 点击item，单行刷新
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
};


export default function ContactImportReducer(state = initialState, action) {

    switch (action.type) {

        case types.CONTACT_ITEMCLICKED: {

            let newDataBlob = {};                     // 重新生成对象，列表才会刷新
            let dataBlob = state.data.dataBlob;

            state.selectContacts = [];
            let keys = Object.keys(dataBlob);
            let contactAllNum = 0, key, contact;
            for (let i = 0, l = keys.length; i < l; i++) {
                key = keys[i];
                contact = dataBlob[key];
                newDataBlob[key] = contact;
                if (typeof contact == 'string') continue;
                if (contact.isImport) continue;
                contactAllNum++;
                if (contact.identifier == action.contact.identifier) {
                    let deepContact = ObjectUtil.deepCopy(contact);     // 单行点击事件，只需要深拷贝该行数据即可
                    deepContact.isSelect = !contact.isSelect;
                    newDataBlob[key] = deepContact;
                    if (deepContact.isSelect) {
                        state.selectContacts.push(deepContact);
                    }
                } else {
                    if (contact.isSelect) {
                        state.selectContacts.push(contact);
                    }
                }
            }
            state.data.dataBlob = newDataBlob;

            state.canSelectAll = contactAllNum != state.selectContacts.length;
            action.callBack(state.canSelectAll, state.selectContacts.length);

            return Object.assign({}, state, {
                dataSource: state.dataSource.cloneWithRowsAndSections(newDataBlob, state.data.sectionIds, state.data.rowIds),
                selectContacts: state.selectContacts
            });
        }

        case types.CONTACT_LOADDATA: {
            const {dataBlob, sectionIds, rowIds} = action.data;
            return Object.assign({}, initialState, {
                dataSource: state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
                data: action.data,
            });
        }

        case types.CONTACT_SUREBTNCLICKED: {
            ContactDao.saveImportContacts(state.selectContacts, action.callBack);
            // 注意，页面退出时，若不清理store，则下次进入该页面还会显示旧的数据，有时会有显示问题。同理，加载数据时也最好用initialState
            return initialState;
        }

        case types.CONTACT_CANCELORSELECTALL: {

            let newDataBlob = {};
            let dataBlob = state.data.dataBlob;

            state.canSelectAll = !state.canSelectAll;
            let canSelectAll = state.canSelectAll;

            state.selectContacts = [];
            let keys = Object.keys(dataBlob);
            let key, contact;
            for (let i = 0, l = keys.length; i < l; i++) {
                key = keys[i];
                contact = dataBlob[key];
                newDataBlob[key] = contact;
                if (typeof contact == 'string') continue;
                if (contact.isImport) continue;

                // 此处深拷贝的原则是，只拷贝那些状态前后改变了的对象，为了性能
                if (canSelectAll) {
                    if (contact.isSelect) {
                        let deepContact = ObjectUtil.deepCopy(contact);
                        deepContact.isSelect = false;
                        newDataBlob[key] = deepContact
                    }
                } else {
                    if (!contact.isSelect) {
                        let deepContact = ObjectUtil.deepCopy(contact);
                        deepContact.isSelect = true;
                        newDataBlob[key] = deepContact
                    }
                }

                if (!canSelectAll) {
                    state.selectContacts.push(contact);
                }
            }

            state.data.dataBlob = newDataBlob;

            action.callBack(canSelectAll, state.selectContacts.length);

            return Object.assign({}, state, {
                dataSource: state.dataSource.cloneWithRowsAndSections(newDataBlob, state.data.sectionIds, state.data.rowIds)
            });
        }

        default:
            return state;
    }
}