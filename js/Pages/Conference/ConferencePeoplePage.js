/**
 * Created by zhangmaliang on 2017/6/23.
 */

import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {ContactNameFlagView,NavLeftAndRightTextItem} from '../../Common/CommonView'

const colNum = 5;
const margin = 15;
const itemW = (SCREEN_WIDTH - (colNum + 1) * margin) / colNum;

export default class ConferencePeoplePage extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        title: '会议人员',
        headerRight: (
            <NavLeftAndRightTextItem title='编辑' onPress={navigation.state.params.navRightClicked}/>
        )
    });

    params = this.props.navigation.state.params;

    componentDidMount() {
        this.props.navigation.setParams({navRightClicked: ()=>{
            this.props.navigation.goBack();
        }});
    }

    render() {
        return (
            <ScrollView
                contentContainerStyle={Styles.scrollViewStyle}
                automaticallyAdjustContentInsets={false}>
                {this.params.contacts.map((contact, index) => {
                    return (
                        <View key={index} style={{marginLeft:margin,width:itemW, marginTop:margin}}>
                            <ContactNameFlagView contact={contact} textFont={16} style={{width:itemW,height:itemW}}/>
                            <Text numberOfLines={1} style={Styles.textStyle}>{contact.name}</Text>
                        </View>
                    )
                })}
            </ScrollView>
        )
    }
}


const Styles = StyleSheet.create({
    scrollViewStyle: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgb(242,242,242)',
        flexWrap: 'wrap',
        // flexWrap一定要和flex-start才能恰好正确，否则，格子不能准确的换行
        // 表现为，比如一行有5个item，那么当6个item时并不会换行，而需要7个item才能换行
        alignItems: 'flex-start'
    },
    textStyle:{
        width:itemW,
        textAlign:'center',
        marginTop:5
    }
});