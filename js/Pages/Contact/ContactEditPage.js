/**
 * Created by zhangmaliang on 2017/6/23.
 */

import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import {ContactDao} from '../../Storage/Contact'
import PopView from '../../Component/PopView'
import {NavLeftAndRightTextItem, NavBackArrowItem} from '../../Common/CommonView'

export default class ContactEditPage extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.contact.name,
        headerRight: (
            <NavLeftAndRightTextItem title='完成' onPress={navigation.state.params.navRightClicked}/>
        ),
        headerLeft: (
            <NavBackArrowItem onPress={navigation.state.params.navLeftClicked}/>
        )
    });

    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
        this.params = this.props.navigation.state.params;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            navLeftClicked: this._goBack,
            navRightClicked: () => {
                this.state.text.length > 0 ? this._showPopView() : this._goBack();
            }
        });
        this.timer = setTimeout(() => {
            this.refs.textInput.focus();
        }, 700)
    }

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer)
    }

    render() {
        return (
            <View style={{backgroundColor:'rgb(244,244,244)'}}>
                <Text style={{marginLeft:15,marginTop:15}}>联系人详情</Text>
                <View style={Styles.textViewStyle}>
                    <Text style={{marginLeft: 15, fontSize:16}}>公司:</Text>
                    <TextInput ref="textInput"
                               style={Styles.textInputStyle}
                               placeholder={this.params.contact.detailMessage}
                               clearButtonMode={'while-editing'}
                               onChangeText={text=>this.setState({text})}
                    />
                </View>
            </View>
        )
    }

    _showPopView=()=>{
        PopView.show({
            message: "联系人详情修改成功",
            sureBlock:()=>{
                Keyboard.dismiss();
                let {contact} = this.params;
                this.params.editDidCompletion(contact);
                contact.detailMessage = this.state.text;
                ContactDao.updateContact(this.params.contact);
                this.props.navigation.goBack();
            }
        })
    };

    _goBack = () => {
        Keyboard.dismiss();
        this.timer = setTimeout(() => {
            this.props.navigation.goBack();
        }, 250);
    };
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