/**
 * Created by zhangmaliang on 2017/7/27.
 */

import {APP} from '../../APP';

const recentlyVisitedRoutes = new Set();

const NavReducer = (state, action) => {

    if (action.type === 'Navigation/NAVIGATE') {  //防止连点出现多次navigate

        if (recentlyVisitedRoutes.has(action.routeName)) {
            return state;
        }
        recentlyVisitedRoutes.add(action.routeName);
        setTimeout(() => {
            recentlyVisitedRoutes.delete(action.routeName);
        }, 400);
    }
    const newState = APP.router.getStateForAction(action, state);  // 实现导航到指定router
    return newState || state;
};

export default NavReducer;