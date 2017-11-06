/**
 * Created by zhangmaliang on 2017/6/23.
 */

import React, {PureComponent} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import SearchBar from '../../Component/SearchBar'
import Button from '../../Component/Button'
import {ContactDao} from '../../Storage/Contact'
import {ContactSectionHeader, ContactNameFlagView, NavLeftAndRightImageItem} from '../../Common/CommonView'
import IndexListView from '../../Component/IndexListView'


export default class ContactPage extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        headerTitle: '联系人',
        headerRight: (
            <NavLeftAndRightImageItem
                onPress={()=>navigation.state.params.navRightClicked()}
                image={require('../../../Resources/Images/Contact/navigationRightIcon.png')}
            />
        )
    });

    constructor(props) {
        super(props);
        this.state = {
            hasContacts: undefined,
            dataSource: new IndexListView.DataSource({
                getSectionData: (dataBlob, sectionID) => dataBlob[sectionID],
                getRowData: (dataBlob, sectionID, rowID) => dataBlob[sectionID + ":" + rowID],
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            })
        }
    }

    componentDidMount() {
        // 这行代码会导致页面刷新，重新调用render方法
        this.props.navigation.setParams({navRightClicked: this._goContactImportPage});
        this._loadData();
    }

    render() {
        if (this.state.hasContacts == undefined) return null;
        return (
            <View style={{flex:1, backgroundColor:'rgb(233,233,233)'}}>
                {this.state.hasContacts
                    ? this._renderListView()
                    : <NoContactImportDataView importContact={this._goContactImportPage}/>}
            </View>
        )
    }

    _renderListView() {
        return (
            <IndexListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                renderSectionHeader={this._renderSectionHeader}
                renderHeader={this._renderHeader}
                enableEmptySections={true}
                removeClippedSubviews={false}
                pageSize={10}
            />
        )
    }

    _renderHeader = () => {
        return <SearchBar onTextChange={(text)=>this.setState({searchText:text})}/>
    };

    _renderSectionHeader = (sectionData) => {
        return <ContactSectionHeader title={sectionData}/>
    };

    _renderRow = (contact) => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={()=>{this._goToDetailPage(contact)}}>
                <View style={{flex:1}}>
                    <View style={Styles.rowViewStyle}>
                        <ContactNameFlagView contact={contact} style={{marginLeft:15}}/>
                        <Text style={{fontSize:17,marginLeft:8}}>{contact.name}</Text>
                    </View>
                    <View style={{width:SCREEN_WIDTH, backgroundColor:'rgb(248,248,248)'}}>
                        {contact.mobileArray.map((mobile, i) => {
                            return (
                                <View key={i}>
                                    <Text style={Styles.rowPhoneTextStyle}>{mobile}</Text>
                                    {i == contact.mobileArray.length - 1 ? null :
                                        <View
                                            style={[CommonStyles.lineViewStyle,{marginLeft:54,width:SCREEN_WIDTH-69}]}/>}
                                </View>
                            )
                        })}
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    _loadData() {
        ContactDao.getListViewDataOfImportContacts().then(data => {
            if (data.sectionIds.length == 0) {
                this.setState({hasContacts: false});
                return;
            }
            this.setState({
                hasContacts: true,
                dataSource: this.state.dataSource.cloneWithRowsAndSections(data.dataBlob, data.sectionIds, data.rowIds)
            })
        })
    }

    _goToDetailPage(contact) {
        this.props.navigation.navigate('ContactDetailPage', {contact: contact});
    }

    _goContactImportPage = () => {
        this.props.navigation.navigate('ContactImportPage', {
            importContactCallBack: () => {
                this._loadData();
            }
        });
    };
}


const NoContactImportDataView = ({importContact}) => {
    return (
        <View style={{alignItems:'center', flex:1}}>
            <Image style={Styles.iconStyle}
                   source={require('../../../Resources/Images/Contact/main_NoConference.png')}/>
            <Text style={Styles.tipTextStyle}>你还没有导入或添加联系人</Text>
            <Button text='导入联系人'
                    containerStyle={Styles.importBtnContainerStyle}
                    style={Styles.importBtnTextStyle}
                    onPress={()=>importContact()}
            />
        </View>
    )
};


const Styles = StyleSheet.create({
    rowViewStyle: {
        width: SCREEN_WIDTH,
        height: 55,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center'
    },
    rowFlagViewStyle: {
        width: 32,
        height: 32,
        borderRadius: 4,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    },
    rowPhoneTextStyle: {
        marginLeft: 54,
        marginTop: 15,
        marginBottom: 15,
        fontSize: 20,
        color: 'rgb(177,177,177)'
    },
    iconStyle: {
        marginTop: SCREEN_HEIGHT * 0.3
    },
    tipTextStyle: {
        color: 'rgb(177,177,177)',
        fontSize: FontSize(17),
        textAlign: 'center',
        marginTop: 15
    },
    importBtnContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'blue',
        borderWidth: 1,
        borderRadius: 4,
        marginTop: 15,
        width: px(212),
        height: px(40)
    },
    importBtnTextStyle: {
        color: 'blue',
        fontSize: FontSize(17)
    }
});