/**
 * Created by zhangmaliang on 2017/7/19.
 */

import React from'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, ListView} from 'react-native';
import {connect} from 'react-redux';
import {
    loadAddressBookData,
    clickedItem,
    sureBtnClicked,
    cancelAndSelectAll
} from '../../Redux/Actions/ContactImportAction'
import {ContactSectionHeader, ContactNameFlagView, NavLeftAndRightTextItem} from '../../Common/CommonView'
import SearchBar from '../../Component/SearchBar'
import IndexListView from '../../Component/IndexListView'

const selectIcon = require('../../../Resources/Images/Contact/selectContactBtnSelected.png');
const normalIcon = require('../../../Resources/Images/Contact/selectContactBtnNormal.png');
const disabledIcon = require('../../../Resources/Images/Contact/selectContactBtnNo.png');


class ContactImportPage extends React.PureComponent {

    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.state.params.title ? navigation.state.params.title : '导入联系人',
        headerRight: (
            <NavLeftAndRightTextItem title='确定' onPress={navigation.state.params.navRightClicked}/>
        ),
        headerLeft: (
            <NavLeftAndRightTextItem
                onPress={navigation.state.params.navLeftClicked}
                title={navigation.state.params.leftTitle ? navigation.state.params.leftTitle : '全选'}
                style={{width:88}}
            />)
    });

    componentDidMount() {
        this.props.navigation.setParams({
            navRightClicked: this._sureBtnClicked,
            navLeftClicked: this._selectAllOrCancelAll
        });
        this.props.loadAddressBookData()
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:'rgb(244,244,244)'}}>
                <IndexListView
                    dataSource={this.props.dataSource}
                    renderRow={this._renderRow}
                    renderSectionHeader={this._renderSectionHeader}
                    renderHeader={this._renderHeader}
                    enableEmptySections={true}
                    removeClippedSubviews={true}
                    pageSize={10}
                />
            </View>
        )
    }

    _renderSectionHeader(sectionData) {
        return <ContactSectionHeader title={sectionData}/>
    }

    _renderHeader = () => {
        let searchBar = <SearchBar/>;
        if (this.props.selectContacts.length == 0) return searchBar;
        return (
            <View>
                {searchBar}
                <View
                    style={{width:SCREEN_WIDTH,height:52,backgroundColor:'white', flexDirection:'row', alignItems:'center', overflow:'hidden'}}>
                    {this.props.selectContacts.map((contact, i) => {

                        // 这里要想办法控制性能，比如只显示一部分，折叠视图，下一级视图等
                        if(i>8) return null;
                        return <ContactNameFlagView key={i} contact={contact} style={{marginLeft:i==0?15:6}}/>
                    })}
                </View>
            </View>
        )
    };

    _renderRow = (contact) => {
        let ICON = contact.isImport ? disabledIcon : (contact.isSelect ? selectIcon : normalIcon);
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={()=>this._clickedItem(contact)}>
                <View style={Styles.rowViewStyle}>
                    <Image source={ICON} style={{marginLeft: 15}}/>
                    <ContactNameFlagView contact={contact} style={{marginLeft:15}}/>
                    <Text style={{fontSize:17,marginLeft:8}}>{contact.name}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    _sureBtnClicked = () => {

        // 确认按钮按下，让页面先返回，存储数据回调等异步执行
        const {goBack, state} = this.props.navigation;
        goBack();

        this.props.sureBtnClicked(() => {
            state.params.importContactCallBack();
        })
    };

    _clickedItem = (contact) => {
        if (contact.isImport) return;
        this.props.clickedItem(contact, this._changeNavState)
    };

    _selectAllOrCancelAll = () => {
        // 用属性修改导航栏不能成功，只能回调
        this.props.cancelAndSelectAll(this._changeNavState)
    };

    _changeNavState = (canSelectAll, selectNum) => {

        /*
        *   Navigation集成Redux之后，dispatch的那个方法不能直接传递特殊函数用来回调，否则崩溃
        *   这里特殊函数是指里面使用了Navigation的方法，比如setParams，goBack等
        *   可以用setTimeout解决崩溃，setTimeout作用是将函数执行顺序改变到当前调用堆栈的最末尾
        *   requestAnimationFrame也行，作用是让操作在下一帧再执行
        * */

        setTimeout(()=>{
            this.props.navigation.setParams({
                leftTitle: canSelectAll ? '全选' : '取消全选',
                title: selectNum > 0 ? '已选择' + selectNum + '位' : null
            });
        })
    };
}

const Styles = StyleSheet.create({
    rowViewStyle: {
        width: SCREEN_WIDTH,
        height: 55,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default connect((store) => {
    const {dataSource, selectContacts} = store.ContactImportReducer;
    return {
        dataSource, selectContacts
    }
}, {loadAddressBookData, clickedItem, sureBtnClicked, cancelAndSelectAll})(ContactImportPage);