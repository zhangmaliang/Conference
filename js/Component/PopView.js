/**
 * Created by zhangmaliang on 2017/6/26.
 */

import React, {PureComponent, PropTypes} from 'react';
import{Text, StyleSheet, View, TouchableOpacity, Modal, TextInput}from 'react-native';
import RootSiblings from 'react-native-root-siblings';

let lastPopView;

export default class PopView extends PureComponent{

    static show = (options = {

        title: '提示',
        message: '我是默认内容',
        cancelTitle: '取消',
        sureTitle: '确定',
        cancelBlock: null,
        sureBlock:null,
        isInputText: false,
        isSingleBtn: true,

    }) => {
        
        if(lastPopView != undefined){
            PopView.hide(lastPopView);
        }
        lastPopView = new RootSiblings(<PopViewContainer {...options} isPop={true}/>);
        return lastPopView;
    };

    static hide = popView => {
        if (popView instanceof RootSiblings) {
            popView.destroy();
        } else {
            console.warn(`popView.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof popView}\` instead.`);
        }
    };

    _popView = null;

    componentWillMount = () => {
        this._popView = new RootSiblings(<PopViewContainer{...this.props}/>);
    };

    componentWillReceiveProps = nextProps => {
        this._popView.update(<PopViewContainer{...nextProps}/>);
    };

    componentWillUnmount = () => {
        this._popView.destroy();
    };

    render() {
        return null;
    }
}

class PopViewContainer extends PureComponent {

    static propTypes = {
        title: PropTypes.string,
        message: PropTypes.string,
        isInputText: PropTypes.bool,         // 是否带输入框
        isSingleBtn: PropTypes.bool,         // 下方是否是一个按钮
        cancelTitle: PropTypes.string,
        sureTitle: PropTypes.string,
        cancelBlock: PropTypes.func,
        sureBlock: PropTypes.func,
        isPop: PropTypes.bool,
    };

    static defaultProps = {
        title: '提示',
        message: '我是默认内容',
        cancelTitle: '取消',
        sureTitle: '确定',
        cancelBlock: null,
        sureBlock:null,
        isInputText: false,
        isSingleBtn: true,
        isPop:false
    };

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            isPop:props.isPop
        };
    }

    componentWillReceiveProps(nextProp) {
        if(nextProp.isPop != this.state.isPop){
            this.setState({isPop:nextProp.isPop})
        }
    }
    
    render() {
        if(!this.state.isPop) return null;
        let content = this.props.isInputText ? (
                <TextInput
                    style={Styles.textInputStyle}
                    clearButtonMode={'while-editing'}
                    onChangeText={text=>this.setState({text})}
                />) : (
                <Text style={Styles.mesStyle}>{this.props.message}</Text>
            );

        return (
            <Modal animationType="fade"  transparent>
                <View style={Styles.containerStyle}>
                    <View style={[Styles.innerStyle,{height:this.props.isInputText ? 190 : 165}]}>
                        <Text style={Styles.titleStyle}>{this.props.title}</Text>
                        {content}
                        <View style={Styles.buttonContainerStyle}>
                            {!this.props.isSingleBtn ? this._button(this.props.cancelTitle, this.props.cancelBlock, false) : null}
                            {this._button(this.props.sureTitle, this.props.sureBlock, true)}
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    _button(text, callBack, sureBtn) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={()=>{
                this.setState({isPop:false});
                callBack && callBack(this.state.text);
            }}>
                <View style={[
                    Styles.buttonViewStyle,
                    {backgroundColor:sureBtn ? 'red' : 'white',
                     borderColor: sureBtn ? 'red' : 'gray',
                    }]}
                >
                    <Text style={{color: sureBtn ? 'white': 'gray'}}>{text}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const Styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerStyle: {
        width: 290,
        backgroundColor: 'white',
        borderRadius: 8
    },
    titleStyle: {
        fontSize: 20,
        marginTop: 30,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    mesStyle: {
        fontSize: 16,
        marginTop: 15,
        textAlign: 'center',
        color: 'gray'
    },
    textInputStyle: {
        width: 290 - 20 * 2,
        height: 40,
        marginLeft: 20,
        marginTop: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        paddingLeft:8
    },
    buttonContainerStyle: {
        marginTop: 20,
        width: 290,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    buttonViewStyle: {
        width: 110,
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1
    }
});