/**
 * Created by zhangmaliang on 2017/7/19.
 */

import React, {Component} from 'react';
import {Dimensions, StyleSheet, PixelRatio, Platform} from 'react-native';
import Styles from './Styles'
import Colors from './Colors'
import Font from './Fonts'
import Px2pd from './Px2pd'

const {height, width} = Dimensions.get('window');


global.iOS = (Platform.OS === 'ios');

global.Android = (Platform.OS === 'android');

global.SCREEN_WIDTH = width;

global.SCREEN_HEIGHT = height;

global.PixelRatio = PixelRatio.get();

global.CommonStyles = Styles;

global.CommonColors = Colors;

global.FontSize = Font;

global.px = Px2pd;              // 屏幕上的view宽度根据屏幕适配

global.defaultFun = () => {
};


// 此外，还有个isContected属性，代表有无网络