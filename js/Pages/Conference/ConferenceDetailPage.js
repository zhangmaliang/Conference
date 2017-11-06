/**
 * Created by zhangmaliang on 2017/6/23.
 */

import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Switch} from 'react-native';
import {connect} from 'react-redux';
import Button from '../../Component/Button'
import {ContactNameFlagView, NavBackArrowItem} from '../../Common/CommonView'
import ConferenceTitlePage from './ConferenceTitlePage'
import ConferenceTimePage from './ConferenceTimePage'
import ToastView from '../../Component/ToastView'
import Request from '../../Utils/Request'
import ConferenceCallPage from './ConferenceCallPage'

const rightArrow = require('../../../Resources/Images/Arrow/main_rightImg.png');
const addIcon = require('../../../Resources/Images/Conference/confDeatilAdd.png');


class ConferenceDetailPage extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        title: '会议详情',
        headerLeft: <NavBackArrowItem onPress={()=>navigation.state.params.navLeftClicked()}/>
    });

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.state = {
            contacts: this.params.contacts,
            detail: null
        };
    }

    componentDidMount() {
        const {setParams, goBack} = this.props.navigation;
        setParams({
            // 导航A->B->C ，从C->A
            navLeftClicked: () => {
                if (this.params.fromConferenceListPage) {
                    goBack()
                } else {
                    let length = this.props.routes.length;
                    goBack(this.props.routes[length - 2].key)
                }
            }
        });

        this._loadConferenceDetail();
    }

    render() {
        if (!this.state.detail) return null;
        let topView = (
            <View style={{backgroundColor:'white'}}>
                {this._renderItemRow('会议名称', this.state.detail.topic, false, this._goConferenceTitlePage)}
                <View style={CommonStyles.lineViewStyle}/>
                <View style={{flexDirection:'row',flexWrap:'wrap',alignItems: 'flex-start'}}>
                    {this._renderAllFlagView()}
                </View>
            </View>
        );

        const showTitle = this.state.detail.isTop == 0 ? '会议置顶成功' : '会议取消置顶';
        let middenView = (
            <View style={{backgroundColor:'white', width:SCREEN_WIDTH,height:100,marginTop:15}}>
                {this._renderItemRow('会议置顶', '', true, () => ToastView.show(showTitle))}
                <View style={CommonStyles.lineViewStyle}/>
                {this._renderItemRow('会议明细', '', false, this._goConferenceTimePage)}
            </View>
        );

        let bottomView = (
            <Button
                text="发起会议"
                style={{color:'blue',fontSize:16}}
                containerStyle={Styles.conferenceBtnStyle}
                onPress={()=>{
                    this.refs.conferenceCallPage.show({
                        detail:this.state.detail,
                        phone:this.props.app.user.phone,
                        sessionId:this.props.app.sessionId
                    })
                }}
            />
        );

        return (
            <View style={{flex:1,backgroundColor:'rgb(233,233,233)'}}>
                {topView}
                {middenView}
                {bottomView}

                <ConferenceCallPage ref="conferenceCallPage"/>
            </View>
        )
    }

    _renderItemRow(leftMessage, rightMessage, isSwitch, callBack) {
        return (
            <TouchableOpacity activeOpacity={0.9} style={Styles.rowStyle} onPress={() => !isSwitch ? callBack() : null}>
                <Text style={{marginLeft:15}}>{leftMessage}</Text>
                <Text style={{position:'absolute',right:30,color:'gray'}}>{rightMessage}</Text>
                {isSwitch ? this._renderSwitch(callBack) :
                    <Image source={rightArrow} style={{position:'absolute',right:15}}/>}
            </TouchableOpacity>
        )
    }

    _renderAllFlagView() {
        let flagViews = [];
        let count = this.state.contacts.length;
        for (let i = 0, l = count + 2; i < l; i++) {
            if (i < count) {
                let contact = this.state.contacts[i];
                flagViews.push(
                    <TouchableOpacity key={i} activeOpacity={0.9}
                                      style={{marginLeft:15,marginTop:15,marginBottom:15}}
                                      onPress={()=>this._goConferencePeoplePage()}>
                        <ContactNameFlagView contact={contact} style={{width:64,height:64}} textFont={16}/>
                        <Text numberOfLines={1} style={{width:64,textAlign:'center',marginTop:4}}>{contact.name}</Text>
                    </TouchableOpacity>
                )
            } else {
                let callBack = i == count ? this._goConferencePeopleSelectPage : this._goConferencePeopleSelectPage;
                flagViews.push(
                    <TouchableOpacity key={i} activeOpacity={0.9} style={{marginLeft:15,marginTop:15,marginBottom:15}}
                                      onPress={()=>callBack()}>
                        <Image source={i == count ? addIcon : addIcon} style={{width:64,height:64}}/>
                    </TouchableOpacity>
                )
            }
        }
        return flagViews;
    }

    _renderSwitch(callBack) {
        return (
            <Switch
                style={{position:'absolute',right:15}}
                value={this.state.detail.isTop == 1}
                onValueChange={(switchIsOn)=>{
                    this.setState({switchIsOn});
                    let detail = this.state.detail;
                    detail.isTop = switchIsOn;
                    this.setState({detail});
                    callBack();
                }}
            />
        )
    }

    _goConferenceTimePage = () => {
        this.props.navigation.navigate('ConferenceTimePage', {
            conferenceTitle: this.state.detail.topic,
            conferenceTime: this.state.detail.createTime,
        });
    };

    _goConferenceTitlePage = () => {
        this.props.navigation.navigate('ConferenceTitlePage', {
            conferenceTitle: this.state.detail.topic,
            editDidCompletion: (conferenceTitle) => {
                let detail = this.state.detail;
                detail.topic = conferenceTitle;
                this.setState({detail})
            }
        });
    };

    _goConferencePeoplePage() {
        this.props.navigation.navigate('ConferencePeoplePage', {
            contacts: this.state.contacts
        });
    }

    _goConferencePeopleSelectPage = () => {
        this.props.navigation.navigate('ConferencePeopleSelectPage', {
            addedContacts: this.state.contacts,
            fromConferenceDetailPage: true,
            groupId: this.params.groupId,
            callBack: (contacts) => {
                this.setState({contacts})
            }
        });
    };

    _loadConferenceDetail = () => {
        let params = {'id': this.params.groupId};
        Request.get(Request.CONFERENCE_DETAIL, params, res => {
            this.setState({detail: res.result})
        }, err => {

        })
    };
}


const Styles = StyleSheet.create({
    rowStyle: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        height: 49,
        alignItems: 'center'
    },
    conferenceBtnStyle: {
        width: 150,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: (SCREEN_WIDTH - 150) / 2
    }
});

export default connect((store) => {
    return {
        routes: store.NavReducer.routes,
        app: store.APPReducer,
    }
})(ConferenceDetailPage);