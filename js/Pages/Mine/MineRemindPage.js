/**
 * Created by zhangmaliang on 2017/6/26.
 */

import React, {PureComponent} from 'react';
import {View,NativeModules, NativeEventEmitter,findNodeHandle} from 'react-native';
import ModalPage from '../Other/ModalPage'
import NativeMyRemindView from './NativeMyRemindView'
import {NavLeftAndRightTextItem} from '../../Common/CommonView'

const NativeEvents = new NativeEventEmitter(NativeModules.RativeTOJSEventEmitter);
const NativeModule = NativeModules.NativeTableViewManager;


export default class MineRemindPage extends PureComponent {

    static navigationOptions = ({navigation}) => ({
        headerTitle: '我的提醒',
        headerRight: (
            <NavLeftAndRightTextItem title='改变' onPress={()=>navigation.state.params.navRightClicked()}/>
        ),
    });

    state = {
        datas:[]
    };

    componentDidMount() {
        this._loadData();
        this._nativeHandler();
    }

    componentWillUnmount() {
        this.deleteSubscription.remove();
        this.clickedSubscription.remove();
    }

    render(){
        return(
            <View style={{flex:1}}>
                <NativeMyRemindView
                    style={{width: SCREEN_WIDTH,height:SCREEN_HEIGHT - 64}}
                    datas={this.state.datas}
                    ref="NativeMyRemindView"
                />
                <ModalPage ref="modalPage"/>
            </View>
        )
    }

    _loadData() {
        let datas = [];
        for (let i = 0; i < 50; i++) {
            datas.push({
                title: '左滑删除',
                content: '原生端实现'+i
            })
        }
        this.setState({datas})
    }

    _nativeHandler = ()=>{
        // 监听原生端cell的删除事件
        this.deleteSubscription = NativeEvents.addListener('TableDeleteRowEvent',(index)=>{
            let datas = [...this.state.datas];
            datas.splice(index,1);
            this.setState({datas})
        });

        // 监听原生端cell的点击事件
        this.clickedSubscription = NativeEvents.addListener('TableRowClickedEvent',(index)=>{
            this.refs.modalPage.show()
        });

        // 改变原生端cell背景颜色
        this.props.navigation.setParams({navRightClicked: ()=>{
            let tag = findNodeHandle(this.refs.NativeMyRemindView);
            NativeModule.changeBackgroundColor('red',tag).then(success=>{
                success ? alert('改变原生端cell背景颜色成功') : alert('改变失败')
            });
        }});
    };
}