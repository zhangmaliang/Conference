/**
 * Created by zhangmaliang on 2017/7/27.
 */

import * as types from '../ActionTypes';
import {ListView} from 'react-native';
import {ObjectUtil, ArrayUtil} from '../../Utils'

const initialState = {
    page: 1,      // 页码
    pageSize: 10, // 每次请求一页多少数据
    topic: '',    // 会议名称，用于搜索时

    refreshing: false,  // 是否正在下拉刷新
    loadMore: false,    // 是否正在上拉刷新

    lists: [],            // 列表页码所有数据
    total: 0,             // 总共多少条数据
    noMoreData:false,     // 当数据加载完毕后为true
    permission: false,    // 是否有创建会议的权限
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => (r1 !== r2)}),
};


export default function ConferenceListReducer(state = initialState, action) {
    switch (action.type) {
        case types.CONFERENCE_LIST_LOADDATA_SUCCESS:

            let lists = action.lists;
            let newLists = [];

            // action.page == 1 表明是下拉刷新，否则为加载更多
            newLists = action.page == 1 ? lists : state.lists.concat(lists);

            return Object.assign({}, state, {
                total: action.total,
                refreshing: false,
                loadMore:false,
                page:action.page,
                lists:newLists,
                noMoreData:newLists.length >= state.total,
                dataSource: state.dataSource.cloneWithRows(newLists)
            });

        case types.CONFERENCE_LIST_LOADDATA_ERROR:{
            return Object.assign({}, state, {
                refreshing: false,
                loadMore:false,
                page:action.page,
            });
        }

        case types.CONFERENCE_LIST_LOADDATA_REFRESH: {

            return Object.assign({}, state, {
                refreshing: true,
                loadMore:false,
                page:action.page,
            });
        }

        case types.CONFERENCE_LIST_LOADDATA_LOADMORE: {
            return Object.assign({}, state, {
                refreshing: false,
                loadMore:true,
                page:action.page,
            });
        }

        case types.CONFERENCE_LIST_PERMISSION:

            return Object.assign({}, state, {
                permission: action.permission
            });

        case types.CONFERENCE_LIST_DELETEITEM:

            let {rowData} = action;
            let newList = ObjectUtil.deepCopy(state.lists);
            ArrayUtil.remove(newList, rowData, 'id');
            ArrayUtil.remove(state.lists, rowData, 'id');

            return Object.assign({}, state, {
                dataSource: state.dataSource.cloneWithRows(newList),
            });

        default:
            return state;
    }
}
