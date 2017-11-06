/**
 * Created by zhangmaliang on 2017/7/19.
 */

import React from'react';
import {Text, View, TouchableOpacity, StyleSheet, Modal, NativeModules} from 'react-native';


export default class ConferenceCallPage extends React.PureComponent {

    show(params) {
        this.sessionId = params.sessionId;
        this._createConference(params);
        this.setState({
            isPop: true,
            text: '正在准备创建会议'
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            isPop: false,
            text: null
        };
        this.confId = null;
        this.sessionId = null;
    }

    render() {
        return (
            <Modal animationType="slide" visible={this.state.isPop}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'red',fontSize:18,width:300}}>{this.state.text}</Text>
                    <Text onPress={()=>this._dismissConference()} style={{color:'red',fontSize:18, marginTop:100}}>点我取消会议</Text>
                </View>
            </Modal>
        );
    }

    _createConference = ({detail, sessionId, phone}) => {

        const {members, id, topic, creatorPhone} = detail;

        let memberList = members.map(member => {
            return {
                'jnickname': 'ucspaas',
                'number': member.phone,
                'role': member.phone == phone ? '2' : '1',
            }
        });

        let params = {
            'groupId': id,
            'creatorPhone': creatorPhone,
            'confTopic': topic,
            'maxMember': 10,
            'duration': 1440,
            'playTone': 1,
            'memberList': JSON.stringify(memberList),
            'showNumber': ''
        };

        NativeModules.TCP.createConference(params, sessionId, (err, res) => {
            if (res.state == 2) {
                this.setState({text: '创建会议成功'});
                this.confId = res.confId;
            } else if (res.state == 3) {
                this.setState({text: '创建会议失败，原因:' + res.desc})
            }
        })
    };


    _dismissConference = () => {

        let params = {
            'confId': this.confId
        };

        NativeModules.TCP.dismissConference(params, this.sessionId, (err, res) => {
            this.setState({text: '解散会议成功'});
            this.setState({isPop: false});
        })
    }
}