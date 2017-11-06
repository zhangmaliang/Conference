/**
 * Created by zhangmaliang on 2017/7/19.
 */

import React from 'react';
import {View, Text, Modal} from 'react-native';


// 想让页面以modal的形式出现，方式二种
// 1、在Navigation的Tab中细分另外的navigationStack，但是这样，会跟导航器方法reset冲突
// 2、直接用modal的形式弹出页面，而非导航栏push的方式
export default class ModalPage extends React.PureComponent {

    show(){
        this.setState({isPop:true})
    }

    dismiss(){
        this.setState({isPop:false})
    }

    state = {
        isPop: false
    };

    render() {
        return (
            <Modal
                animationType="slide"
                visible={this.state.isPop}>

                <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'gray'}}>
                    <Text style={{color:'red',fontSize:18}}>我是modal出来的页面，ios中的modal效果</Text>

                    <Text onPress={()=>this.dismiss()} style={{color:'red',fontSize:18, marginTop:100}}>点我退出</Text>
                </View>
            </Modal>
        );
    }
}