/**
 * Created by zhangmaliang on 2017/7/26.
 */


import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const Styles = {

    lineViewStyle: {
        marginLeft: 15,
        height: StyleSheet.hairlineWidth,
        width: width - 30,
        backgroundColor: 'rgb(222,222,222)'
    },
};


export default Styles;