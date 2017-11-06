/**
 * Created by zhangmaliang on 2017/7/27.
 */

import {Platform} from 'react-native';

const basePx = Platform.OS === 'ios' ? 750 : 720;    // 根据设计图来修改

const Px2pd = (px) =>{
    return px / basePx * SCREEN_HEIGHT;
};

export default Px2pd;