/**
 * Created by zhangmaliang on 2017/7/20.
 */

import {ListView} from 'react-native';
import * as types from '../ActionTypes';
import ObjectUtil from '../../Utils/ObjectUtil'


const initialState = {
    data: {},                            // ListView的数据源，{dataBlob,sectionIds,rowIds}

    dataSource: new ListView.DataSource({
        getSectionData: (dataBlob, sectionID) => dataBlob[sectionID],
        getRowData: (dataBlob, sectionID, rowID) => dataBlob[sectionID + ":" + rowID],
        rowHasChanged: (r1, r2) => (r1.isAdding !== r2.isAdding || r1.addingMobile !== r2.addingMobile),
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
};


export default function ContactPeopleSelectReducer(state = initialState, action) {

    switch (action.type) {

        case types.CONFERENCE_LOADDATA: {
            const {dataBlob, sectionIds, rowIds} = action.data;
            return Object.assign({}, initialState, {
                dataSource: state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds),
                data: action.data
            });
        }

        case types.CONFERENCE_ITEMCLICKED: {
            let newDataBlob = {};
            let dataBlob = state.data.dataBlob;
            let keys = Object.keys(dataBlob);
            for (let i = 0, l = keys.length; i < l; i++) {
                let key = keys[i];
                let contact = dataBlob[key];
                newDataBlob[key] = contact;
                if (typeof contact == 'string') continue;
                if (contact.identifier == action.clickedContact.identifier) {
                    let deepContact = ObjectUtil.deepCopy(contact);
                    deepContact.isAdding = !contact.isAdding;
                    if (!deepContact.isAdding) {
                        deepContact.addingMobile = null;
                    } else {
                        if (deepContact.mobileArray.length > 0) {
                            deepContact.addingMobile = contact.mobileArray[0];
                        }
                    }
                    newDataBlob[key] = deepContact;
                }
            }
            state.data.dataBlob = newDataBlob;
            return Object.assign({}, state, {
                dataSource: state.dataSource.cloneWithRowsAndSections(newDataBlob, state.data.sectionIds, state.data.rowIds)
            });
        }

        case types.CONFERENCE_MOBILELICKED: {

            const {clickedContact,mobile} = action;
            let newDataBlob = {};
            let dataBlob = state.data.dataBlob;
            let keys = Object.keys(dataBlob);
            for (let i = 0, l = keys.length; i < l; i++) {
                let key = keys[i];
                let contact = dataBlob[key];
                newDataBlob[key] = contact;
                if (typeof contact == 'string') continue;
                if (contact.identifier == clickedContact.identifier) {
                    let deepContact = ObjectUtil.deepCopy(contact);
                    deepContact.isAdding = true;
                    deepContact.addingMobile = mobile;
                    newDataBlob[key] = deepContact;
                }
            }
            state.data.dataBlob = newDataBlob;
            return Object.assign({}, state, {
                dataSource: state.dataSource.cloneWithRowsAndSections(newDataBlob, state.data.sectionIds, state.data.rowIds)
            });
        }

        default:
            return state;
    }
}