/**
 * Created by zhangmaliang on 2017/6/23.
 */

import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, InteractionManager} from 'react-native';
import {connect} from 'react-redux';
import {
    loadImportContacts,
    itemClicked,
    mobileClicked,
} from '../../Redux/Actions/ConferencePeopleSelectAction'
import SearchBar from '../../Component/SearchBar'
import ArrayUtil from '../../Utils/ArrayUtil'
import {
    NavBackArrowItem,
    NavLeftAndRightTextItem,
    ContactNameFlagView,
    ContactSectionHeader
} from '../../Common/CommonView'
import IndexListView from '../../Component/IndexListView'
import Request from '../../Utils/Request'


const normalIcon = require('../../../Resources/Images/Contact/selectContactBtnNormal.png');
const selectIcon = require('../../../Resources/Images/Contact/selectContactBtnSelected.png');
const selectDisableIcon = require('../../../Resources/Images/Contact/selectContactBtnNo.png');
const phoneNormalIcon = require('../../../Resources/Images/Conference/selectContactPhoneNoSelect.png');
const phoneSelectIcon = require('../../../Resources/Images/Conference/selectContactPhoneSelected.png');
const phoneDisableIcon = require('../../../Resources/Images/Conference/selectContactPhoneDidSelect.png');


class ConferencePeopleSelectPage extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        headerTitle: '选择参会人员',
        headerRight: (
            <NavLeftAndRightTextItem title='确定' onPress={()=>navigation.state.params.navRightClicked()}/>
        ),
        headerLeft: (
            <NavBackArrowItem onPress={()=>navigation.goBack()}/>
        )
    });

    params = this.props.navigation.state.params;

    componentDidMount() {
        this.props.navigation.setParams({navRightClicked: this._goConferenceDetailPage});
        this.props.loadImportContacts()
    }

    render() {
        return (
            <IndexListView
                dataSource={this.props.dataSource}
                renderRow={this._renderRow}
                renderSectionHeader={this._renderSectionHeader}
                renderHeader={this._renderHeader}
                enableEmptySections={true}
                removeClippedSubviews={true}
                pageSize={10}
                initialListSize={1}  // 防止push时卡顿
            />
        )
    }

    _renderHeader = () => {
        let flagViews = [];
        this.params.addedContacts.forEach(contact => {
            flagViews.push(
                <ContactNameFlagView key={contact.identifier} contact={contact} style={{marginLeft:10}}/>
            )
        });

        const {dataBlob} = this.props.data;
        let keys = Object.keys(dataBlob);
        for (let i = 0, l = keys.length; i < l; i++) {
            let contact = dataBlob[keys[i]];
            if (typeof contact == 'string') continue;
            if (contact.isAdding && !ArrayUtil.contain(this.params.addedContacts, contact, 'identifier')) {
                flagViews.push(
                    <ContactNameFlagView key={contact.identifier} contact={contact} style={{marginLeft:10}}/>
                )
            }
        }

        return (
            <View>
                <SearchBar onTextChange={(text)=>this.setState({searchText:text})}/>
                <View
                    style={{flexDirection:'row',width:SCREEN_WIDTH,height:52,backgroundColor:'white',alignItems:'center'}}>
                    {flagViews}
                </View>
            </View>
        )
    };

    _renderSectionHeader(sectionData) {
        return <ContactSectionHeader title={sectionData}/>
    }

    _renderRow = (contact) => {
        let isSelect = contact.isAdding;
        let isAdded = ArrayUtil.contain(this.params.addedContacts, contact, 'identifier');
        let ICON = isAdded ? selectDisableIcon : (isSelect ? selectIcon : normalIcon);
        return (
            <View style={{flex:1}}>
                <TouchableOpacity style={Styles.rowViewStyle} activeOpacity={0.9}
                                  onPress={()=>this._itemClicked(contact)}>
                    <Image source={ICON} style={{marginLeft:15,marginRight:15}}/>
                    <ContactNameFlagView contact={contact}/>
                    <Text style={{fontSize:17,marginLeft:8}}>{contact.name}</Text>
                    {isAdded ? <Text style={Styles.rowAddedFlagViewStyle}>已添加</Text> : null}
                </TouchableOpacity>
                <View style={{width:SCREEN_WIDTH, backgroundColor:'rgb(248,248,248)'}}>
                    {this._renderPhoneView(contact)}
                </View>
            </View>
        )
    };

    _renderPhoneView(contact) {
        let views = [];
        let ICON = phoneNormalIcon;
        let isAdded = ArrayUtil.contain(this.params.addedContacts, contact, 'identifier');
        for (let i = 0, l = contact.mobileArray.length; i < l; i++) {
            let mobile = contact.mobileArray[i];
            if (isAdded) {
                let tempContact = ArrayUtil.obtain(this.params.addedContacts, contact, 'identifier');
                ICON = (mobile == tempContact.addedMobile || mobile == tempContact.addingMobile) ? phoneSelectIcon : phoneDisableIcon;
            } else {
                if (contact.isAdding) {
                    ICON = mobile == contact.addingMobile ? phoneSelectIcon : phoneDisableIcon;
                }
            }
            views.push(
                <TouchableOpacity key={mobile} activeOpacity={0.9} style={Styles.rowPhoneViewStyle}
                                  onPress={()=>this._mobileItemClicked(contact,mobile)}>
                    <Image source={ICON} style={Styles.rowPhoneIconStyle}/>
                    <Text style={Styles.rowPhoneTextStyle}>{mobile}</Text>
                </TouchableOpacity>
            );
            if (i != l - 1) {
                views.push(
                    <View key={i} style={[CommonStyles.lineViewStyle,{marginLeft:50,width:SCREEN_WIDTH-70}]}></View>
                );
            }
        }
        return views;
    }

    _itemClicked(clickedContact) {
        if (ArrayUtil.contain(this.params.addedContacts, clickedContact, 'identifier')) return;
        this.props.itemClicked(clickedContact)
    }

    _mobileItemClicked(clickedContact, mobile) {
        if (ArrayUtil.contain(this.params.addedContacts, clickedContact, 'identifier')) return;
        this.props.mobileClicked(clickedContact, mobile)
    }

    _goConferenceDetailPage = () => {

        let addingContacts = [];
        const {dataBlob} = this.props.data;
        let keys = Object.keys(dataBlob);
        for (let i = 0, l = keys.length; i < l; i++) {
            let contact = dataBlob[keys[i]];
            if (typeof contact == 'string') continue;
            if (contact.isAdding) {
                addingContacts.push(contact);
            }
        }

        let addedContacts = this.params.addedContacts.concat(addingContacts);
        let contactPhones = addedContacts.map(contact=>contact.addingMobile || contact.addedMobile).join(',');

        let params = {'groupId':this.params.groupId,'memberPhones':contactPhones};

        Request.get(Request.CREATE_GROUP_ADD,params,res=>{

            const {fromConferenceDetailPage, callBack} = this.props.navigation.state.params;

            if (fromConferenceDetailPage) {
                this.props.navigation.goBack();
                callBack(addedContacts);

            } else {
                this.props.navigation.navigate('ConferenceDetailPage', {
                    contacts: addedContacts,
                    groupId:this.params.groupId,
                })
            }
        },err=>{

        })
    };
}


const Styles = StyleSheet.create({
    sectionViewStyle: {
        width: SCREEN_WIDTH,
        height: 25,
        justifyContent: 'center',
        backgroundColor: 'rgb(233,233,233)'
    },
    sectionTextStyle: {
        fontWeight: 'bold',
        marginLeft: 15
    },
    rowViewStyle: {
        width: SCREEN_WIDTH,
        height: 55,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center'
    },
    rowPhoneViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 46
    },
    rowPhoneTextStyle: {
        marginLeft: 15,
        fontSize: 20,
        color: 'rgb(177,177,177)'
    },
    rowPhoneIconStyle: {
        marginLeft: 56,
    },
    rowAddedFlagViewStyle: {
        width: 66,
        height: 20,
        borderColor: 'green',
        borderWidth: 1,
        borderRadius: 10,
        color: 'green',
        paddingLeft: 13,
        paddingTop: 4,
        fontSize: 13,
        right: 26,
        position: 'absolute'
    }
});

export default connect((store) => {
    const {data, dataSource} = store.ConferencePeopleSelectReducer;
    return {
        data, dataSource
    }
}, {loadImportContacts, itemClicked, mobileClicked})(ConferencePeopleSelectPage);
