/**
 * Created by zhangmaliang on 2017/7/19.
 */

import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer'
import ContactImportReducer from './ContactImportReducer'
import ConferencePeopleSelectReducer from './ConferencePeopleSelectReducer'
import APPReducer from './APPReducer'
import NavReducer from './NavReducer'
import ConferenceListReducer from './ConferenceListReducer'

const RootReducer = combineReducers({
    APPReducer,
    NavReducer,
    LoginReducer,
    ContactImportReducer,
    ConferencePeopleSelectReducer,
    ConferenceListReducer
});

export default RootReducer;