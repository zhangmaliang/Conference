/**
 * Created by zhangmaliang on 2017/7/19.
 */

import React from'react';
import {Text, View, TouchableOpacity, Image, ListView, StyleSheet, RefreshControl} from 'react-native';
import Swipeout from 'react-native-swipeout'
import {addMinePageNum} from '../../Redux/Actions/APPAction'
import {connect} from 'react-redux';
import {setupData} from '../../Redux/Actions/APPAction'
import {
    loadConferenceListData,
    loadUserPermission,
    createConferenceGroup,
    deleteConferenceItem
} from '../../Redux/Actions/ConferenceListAction'
import {NavLeftAndRightImageItem} from '../../Common/CommonView'
import PopView from '../../Component/PopView'
import {Contact} from '../../Storage/Contact'
import {DateUtil} from '../../Utils'
import ToastView from '../../Component/ToastView'


class ConferencePage extends React.PureComponent {

    static navigationOptions = ({navigation}) => ({
        headerTitle: '电话会议',
        headerRight: (
            <NavLeftAndRightImageItem
                onPress={()=>navigation.state.params.navRightClicked()}
                image={require('../../../Resources/Images/Contact/navigationRightIcon.png')}
            />
        )
    });

    /*************************   生命周期  *******************************/

    componentDidMount() {

        // setupData在这里调用，则不管登录，还是已经登录，或者退出再登录等，都会填充数据
        // 注意，这个方法是异步的，若想拿到初始化后的数据，可以在componentWillReceiveProps方法中取得
        this.props.setupData();

        // 这里必须要后置执行，否则会陷入死循环，可能跟这是navigation第一个组件有关
        requestAnimationFrame(() => {
            this.props.navigation.setParams({
                navRightClicked: () => {
                    this.props.permission ? this._showPermissionView() : this._showNoPermissionView()
                }
            });
        })
    }


    componentWillReceiveProps(nextProp) {
        if (nextProp.app.user && nextProp.app.sessionId && !this.isFirstLoad) {
            this.phone = nextProp.app.user.phone;
            this.props.loadUserPermission(this.phone);
            this._loadConferenceListData(false);
            this.isFirstLoad = true;
        }
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:'rgb(244,244,244)'}}>
                <ListView
                    dataSource={this.props.dataSource}
                    renderRow={this._renderRow}
                    enableEmptySections={true}
                    removeClippedSubviews={false}
                    renderFooter={() => this._renderFooter()}
                    onEndReachedThreshold={-10}
                    onEndReached={() => {
                        // 首次加载的时候，该方法总是会被调用，需要屏蔽
                        if(this.isFirstLoadMore){
                            this._loadConferenceListData(true)
                        }
                        this.isFirstLoadMore = true;
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.refreshing}
                            onRefresh={()=>this._loadConferenceListData(false)}
                        />
                    }
                />
            </View>
        )
    }

    /*************************    页面渲染  *******************************/

    _renderFooter = () => {
        if (this.props.lists.length == 0 || this.props.noMoreData) return null;
        return (
            <View style={{backgroundColor:'gray',width:SCREEN_WIDTH,height:35}}>
                <Text style={{color:'red'}}>我是上啦刷新尾巴</Text>
            </View>
        )
    };

    _renderRow = (rowData) => {
        const swipeoutBtns = [{
            text: '删除',
            backgroundColor: 'red',
            onPress: () => {
                this.props.deleteConferenceItem(rowData)
            }
        }];
        return (
            <Swipeout autoClose={true} right={swipeoutBtns}>
                <TouchableOpacity activeOpacity={0.8} onPress={()=>this._goConferenceDetailPage(rowData.id)}>
                    <ConferenceRow rowData={rowData} phone={this.phone}/>
                </TouchableOpacity>
            </Swipeout>
        )
    };

    /*************************    事件触发  *******************************/

    _loadConferenceListData = (isLoadMore) => {
        this.props.loadConferenceListData({...this.props, phone: this.phone, isLoadMore})
    };

    _showPermissionView = () => {
        PopView.show({
            title: '输入会议名称',
            message: '',
            isSingleBtn: false,
            isInputText: true,
            sureBlock: title => {
                this.props.createConferenceGroup(title, this.phone, (groupId) => {
                    if (groupId) {
                        this._goConferencePeopleSelectPage(groupId)
                    } else {
                        // 延后，等PopView这个窗口消失再弹出下一个，否则PopView将不能消失
                        requestAnimationFrame(() => {
                            ToastView.show('会议标题不符合规则', 1.5)
                        })
                    }
                })
            }
        })
    };

    _showNoPermissionView = () => {
        PopView.show({
            message: '你没有权限'
        })
    };

    /*************************    页面跳转  *******************************/

    _goConferenceDetailPage = (groupId) => {

        let defaultContact = Contact.defaultMineContact(this.phone);
        this.props.navigation.navigate('ConferenceDetailPage', {
            groupId,
            contacts: [defaultContact],
            fromConferenceListPage: true
        })
    };

    _goConferencePeopleSelectPage = (groupId) => {
        let defaultContact = Contact.defaultMineContact(this.phone);
        this.props.navigation.navigate('ConferencePeopleSelectPage', {
            groupId,
            addedContacts: [defaultContact]
        })
    };
}


const ConferenceRow = ({rowData, phone}) => {
    return (
        <View style={Styles.rowContainerStyle}>
            <View style={Styles.rowStyle}>
                <View style={Styles.rowLeftViewStyle}>
                    <Image style={{marginTop:28}}
                           source={require('../../../Resources/Images/Conference/main_conferenceMember.png')}/>
                    <Text style={{color:'gray'}}>{`${rowData.members.length}人`}</Text>
                </View>

                <View style={Styles.rowSeperatorLineStyle}/>

                <View style={Styles.rowMiddleViewStyle}>
                    <Text style={Styles.rowTopicStyle}>{rowData.topic}</Text>
                    <Text style={Styles.rowPhoneStyle} numberOfLines={1}>
                        {rowData.members.map(member => member == phone ? '我' : member).join('、')}
                    </Text>
                    <Text style={Styles.rowMesStyle}>由我发起的会议待进行</Text>
                    <Text
                        style={Styles.rowTimeStyle}>{DateUtil.format(new Date(rowData.createTime * 1000), 'yyyy-MM-dd hh:mm')}</Text>
                </View>

                <View style={Styles.rowRightViewStyle}>
                    <Image source={require('../../../Resources/Images/Arrow/main_rightImg.png')}/>
                </View>
            </View>
        </View>
    )
};

const Styles = StyleSheet.create({
    rowContainerStyle: {
        width: SCREEN_WIDTH, height: 113, backgroundColor: 'rgb(244,244,244)'
    },
    rowStyle: {
        marginTop: 13,
        marginLeft: 17,
        marginRight: 17,
        backgroundColor: 'white',
        width: SCREEN_WIDTH - 34,
        height: 100,
        flexDirection: 'row'
    },
    rowLeftViewStyle: {
        width: 52, height: 100, alignItems: 'center'
    },
    rowSeperatorLineStyle: {
        width: 1, height: 42, marginTop: 29, backgroundColor: 'rgb(200,200,200)'
    },
    rowMiddleViewStyle: {
        marginLeft: 13, height: 100, width: SCREEN_WIDTH - 34 - 66 - 35
    },
    rowTopicStyle: {
        fontSize: 17, color: 'black', marginTop: 10
    },
    rowPhoneStyle: {
        fontSize: 13, color: 'gray', marginTop: 5
    },
    rowMesStyle: {
        color: 'green', fontSize: 13, marginTop: 8
    },
    rowTimeStyle: {
        color: 'rgb(133,133,133)', fontSize: 13, marginTop: 5
    },
    rowRightViewStyle: {
        width: 35, height: 100, justifyContent: 'center', alignItems: 'center'
    }
});


export default connect(store => {
    return {
        app: store.APPReducer,
        ...store.ConferenceListReducer
    }
}, {
    setupData,
    loadConferenceListData,
    loadUserPermission,
    createConferenceGroup,
    deleteConferenceItem
})(ConferencePage);