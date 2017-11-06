/**
 * Created by zhangmaliang on 2017/7/20.
 */

import React, {Component, PropTypes} from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity}from 'react-native';
import {CommonButton} from '../Component/Button'


// 列表段头组件
export const ContactSectionHeader = ({title, height = 25}) => {
    return (
        <View style={[Styles.sectionViewStyle,{height:height}]}>
            <Text style={Styles.sectionTextStyle}>{title}</Text>
        </View>
    )
};

// 姓名缩写字母标记视图小方块
export const ContactNameFlagView = ({contact, style, textFont = 13}) => {
    return (
        <View style={[Styles.flagViewStyle,style,{backgroundColor:contact.randomColor}]}>
            <Text style={{color:'white',fontSize:textFont}}>{contact.shortName}</Text>
        </View>
    )
};

export const NavLeftAndRightTextItem = ({title, onPress = defaultFun, style}) => {
    return(
        <CommonButton
            onPress={()=>onPress()}
            style={[{width:60,height:44,justifyContent:'center',alignItems: 'center'},style]}
            textStyle={{color:'white', fontSize:16}}
        >
            {title}
        </CommonButton>
    )
};

export const NavLeftAndRightImageItem = ({image, onPress = defaultFun, style}) => {
    return(
        <CommonButton
            onPress={()=>onPress()}
            style={[{width:44,height:44,justifyContent:'center',alignItems: 'center'},style]}
        >
            <Image source={image}/>
        </CommonButton>
    )
};

export const NavBackArrowItem = ({onPress = defaultFun}) => {
    return (
        <CommonButton onPress={onPress} style={{width:38,height:44}}>
            <Image source={require('../../Resources/Images/Arrow/navigationBackIcon.png')}/>
        </CommonButton>
    )
};


const Styles = StyleSheet.create({
    sectionViewStyle: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        backgroundColor: 'rgb(233,233,233)'
    },
    sectionTextStyle: {
        fontWeight: 'bold',
        marginLeft: 15,
    },
    flagViewStyle: {
        width: 32,
        height: 32,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
});