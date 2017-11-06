/**
 * Created by zhangmaliang on 2017/6/23.
 */

import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import {DateUtil} from '../../Utils'


export default class ConferenceTimePage extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.conferenceTitle,
    });

    params = this.props.navigation.state.params;

    render() {
        return (
            <View style={{backgroundColor:'rgb(244,244,244)'}}>
                <Text style={{marginLeft:15,marginTop:15}}>{this.params.conferenceTitle}</Text>
                <View style={Styles.textViewStyle}>
                    <Text style={{marginLeft: 15, fontSize:16}}>
                        {DateUtil.format(new Date(this.params.conferenceTime * 1000), 'yyyy-MM-dd')}
                    </Text>
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    textViewStyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginTop: 10,
        width: SCREEN_WIDTH,
        height: 50,
        alignItems: 'center'
    },
    textInputStyle: {
        marginLeft: 10,
        marginRight: 15,
        width: SCREEN_WIDTH - 75
    },
});