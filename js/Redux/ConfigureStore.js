/**
 * Created by zhangmaliang on 2017/7/19.
 */

import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';                       // 中间件组件，没有则Action不能使用异步操作
import RootReducer from './Reducer/RootReducer'


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export default function configureStore(initialState){
    return createStoreWithMiddleware(RootReducer,initialState);
}
