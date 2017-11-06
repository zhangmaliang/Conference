/**
 * Created by zhangmaliang on 2017/6/23.
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import PopView from '../../Component/PopView'
import {UserDao} from '../../Storage/User'
import {Contact} from '../../Storage/Contact'
import {NavLeftAndRightTextItem} from '../../Common/CommonView'
import ConferencePeopleSelectPage from '../Conference/ConferencePeopleSelectPage'
import Request from '../../Utils/Request'


// 在这里不能用PureComponent,因为编辑页面回调的是一个对象，纯组件时回调时不会刷新页面
export default class ContactDetailPage extends Component {

    static navigationOptions = ({navigation}) => ({
        headerTitle: '联系人详情',
        headerRight: (
            <NavLeftAndRightTextItem title='编辑' onPress={()=>navigation.state.params.navRightClicked()}/>
        ),
    });

    constructor(props) {
        super(props);
        this.state = {
            contact: props.navigation.state.params.contact,
        };
        this.clickedMoblie = null;
        this.permission = false;
        this.user = null;
    }

    componentDidMount() {
        this.props.navigation.setParams({navRightClicked: this._goContactEditPage});
        this._loadUserPermission();
    }

    render() {
        let hasDetail = this.state.contact.detailMessage.length > 0;
        let detailText = hasDetail ? this.state.contact.detailMessage : '请编辑详情';
        let detailColor = hasDetail ? 'black' : 'rgb(222,222,222)';
        let hasIcon = this.state.contact.iconPath.length > 0;
        let icon = hasIcon ? {uri: this.state.contact.iconPath} : require('../../../Resources/Images/Mine/mineIcon.png');
        return (
            <View style={{backgroundColor:'rgb(244,244,244)'}}>
                <View style={Styles.headerViewStyle}>
                    <Image source={icon} style={Styles.iconStyle}/>
                    <Text style={Styles.nameStyle}>{this.state.contact.name}</Text>
                </View>

                <ScrollView>
                    <View style={{backgroundColor:'rgb(244,244,244)',width:SCREEN_WIDTH,height:SCREEN_HEIGHT-236}}>
                        {this._renderPhoneView()}
                        <View style={Styles.detailViewStyle}>
                            <Text style={Styles.detailContactStyle}>联系人详情</Text>
                            <Text style={[Styles.detailTextStyle,{color:detailColor}]}>{detailText}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }

    _renderPhoneView() {
        let contact = this.state.contact;
        if (!contact.mobileArray || contact.mobileArray.length == 0) return null;
        let phoneViews = [];
        for (let i = 0, l = contact.mobileArray.length; i < l; i++) {
            let mobile = contact.mobileArray[i];
            phoneViews.push(
                <TouchableOpacity key={i} style={Styles.phoneCellStyle} activeOpacity={0.8}
                                  onPress={()=>this._phoneItemClicked(mobile)}>
                    <Text style={{marginLeft:15,fontSize:16}}>{mobile}</Text>
                    <Image style={{position:'absolute',right:15}}
                           source={require('../../../Resources/Images/Contact/contact_createConference.png.png')}/>
                </TouchableOpacity>
            )
        }
        return (
            <View style={Styles.phoneViewStyle}>
                <Text style={Styles.phoneTextStyle}>联系方式</Text>
                {phoneViews}
            </View>
        )
    }

    _phoneItemClicked(clickedMoblie) {
        this.clickedMoblie = clickedMoblie;
        this.permission ? this._showPerssionPop() : this._showNoPerssionPop()
    }

    _showNoPerssionPop = () => {
        PopView.show({
            message: "对不起，您没有权限，请联系后台管理员"
        })
    };

    _showPerssionPop = () => {
        PopView.show({
            title: "输入会议名称",
            isInputText: true,
            isSingleBtn: false,
            sureBlock: (text) => this._createConferenceGroup(text)
        })
    };

    _goConferencePeopleSelectPage = (groupId) => {

        let defaultContact = Contact.defaultMineContact(this.user.phone);

        this.state.contact.isAdded = true;
        this.state.contact.addedMobile = this.clickedMoblie;

        this.props.navigation.navigate('ConferencePeopleSelectPage', {
            groupId,
            addedContacts: [defaultContact, this.state.contact],
        })
    };

    _goContactEditPage = () => {
        this.props.navigation.navigate('ContactEditPage', {
            contact: this.state.contact,
            editDidCompletion: (editedContact) => {
                this.setState({contact: editedContact})
            }
        })
    };

    // 网络请求，获取该用户是否有发起电话会议权限
    _loadUserPermission() {
        UserDao.getCurrentUser().then(user => {
            this.user = user;
            let params = {'phone':user.phone};

            Request.get(Request.CREATE_PERSSION,params, res => {

                this.permission = res.result.statCode == 0;
            }, err => {

            })
        })
    }

    // 创建会议组
    _createConferenceGroup = (title) => {
        let params = {'creatorPhone':this.user.phone,'topic':title};
        Request.get(Request.CREATE_GROUP,params, res => {
            this._goConferencePeopleSelectPage(res.result)
        }, err => {
            alert(err)
        })
    };
}

const Styles = StyleSheet.create({
    headerViewStyle: {
        width: SCREEN_WIDTH,
        height: 172,
        alignItems: 'center',
        backgroundColor: '#3e9ce9',
    },
    iconStyle: {
        borderRadius: 5,
        resizeMode: 'contain',
        marginTop: 32,
        width: 60,
        height: 60,
        backgroundColor: 'white'
    },
    nameStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 15
    },
    phoneViewStyle: {
        backgroundColor: 'white',
        width: SCREEN_WIDTH,
        marginTop: 15
    },
    phoneCellStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: 54,
    },
    phoneTextStyle: {
        color: 'blue',
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 10
    },
    detailViewStyle: {
        backgroundColor: 'white',
        width: SCREEN_WIDTH,
        marginTop: 15
    },
    detailContactStyle: {
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 10,
        color: 'blue'
    },
    detailTextStyle: {
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 15,
        fontSize: 16,
        width: SCREEN_WIDTH - 30
    }
});