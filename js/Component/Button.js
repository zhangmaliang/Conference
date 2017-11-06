/**
 * Created by zhangmaliang on 2017/6/14.
 */

import React, {PureComponent, PropTypes} from 'react';
import {ViewPropTypes, Text, TouchableOpacity, Image, StyleSheet, View}from 'react-native';


/*
 *  CommonButton比下面那个Button更具有包容性，以后项目中，所有能点击的东西都统一用这个。  本项目因为东西太多难以改变，没有使用
 *
 * */

export class CommonButton extends PureComponent {
    static propTypes = {
        children: PropTypes.node.isRequired,
        onPress: PropTypes.func,
        style: PropTypes.any,
        textStyle: PropTypes.any,                       // children 为文字时的文本样式
        disabled: PropTypes.bool,                       // 禁用状态
    };

    static defaultProps = {
        disabled: false
    };

    render() {
        let {style, disabled} = this.props;
        let disabledStyle = disabled ? styles.disabledStyle : {};
        return (
            <TouchableOpacity disabled={disabled} onPress={this.props.onPress}>
                <View style={[styles.containerStyle,disabledStyle,style]}>
                    {this._renderChildren()}
                </View>
            </TouchableOpacity>
        )
    }

    _renderChildren() {
        const {children} = this.props;
        let isString = typeof children === 'string';
        return isString ? <Text style={[styles.textStyle,this.props.textStyle]}>{children}</Text> : children
    }
}

const styles = StyleSheet.create({
    textStyle: {
        textAlign: 'center',
        color: '#0A60FE',
        fontSize: 14
    },
    containerStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    disabledStyle: {
        opacity: 0.4
    }
});


export default class Button extends PureComponent {

    static propTypes = {
        onPress: PropTypes.func,
        disabled: PropTypes.bool,
        style: Text.propTypes.style,
        containerStyle: ViewPropTypes.style,
        text: PropTypes.string,
        activeOpacity: PropTypes.number,
    };

    static defaultProps = {
        onPress: () => {
        },
        disabled: false,
        activeOpacity: 0.8
    };

    render() {
        return (
            <TouchableOpacity
                style={this.props.containerStyle}
                onPress={this.props.onPress}
                disabled={this.props.disabled}
                activeOpacity={this.props.activeOpacity}
            >
                <Text style={this.props.style}>
                    {this.props.text}
                </Text>
            </TouchableOpacity>
        )
    }
}


export class CountDownButton extends PureComponent {

    static propTypes = {
        normalText: PropTypes.string.isRequired,   // 正常情况下文本内容
        onPress: PropTypes.func.isRequired,        // 若函数返回false，则本次按钮点击无效
        textStyle: Text.propTypes.style,
        disableTextStyle: Text.propTypes.style,
        containerStyle: ViewPropTypes.style,
        disableContainerStyle: ViewPropTypes.style,
        sendingText: PropTypes.string,           // 发送状态下文本内容，默认是'正在发送中'
        activeOpacity: PropTypes.number,
        countDownNum: PropTypes.number,         // 倒计时总时常，默认1min
        interval: PropTypes.number,             // 倒计时间隔，默认1s
        sendState: PropTypes.number             // 0普通状态，1正在发送，2发送成功开始倒计时,-1发送失败
    };

    static defaultProps = {
        activeOpacity: 0.8,
        countDownNum: 60,
        interval: 1000,
        sendingText: '正在发送中',
        sendState: 0
    };

    componentWillUnmount() {
        this._clearTimer();
    }

    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            countDownNum: props.countDownNum,
            sendState: props.sendState
        };
    }

    componentWillReceiveProps(nextProp) {
        const sendState = nextProp.sendState;
        if (sendState == this.state.sendState) return;
        sendState == 2 ? this._startTimer() : this._clearTimer();
        this.setState({sendState})
    }

    render() {

        let sendState = this.state.sendState;
        let disable = sendState == 1 || sendState == 2;
        let defaultContainerStyle = {justifyContent: 'center', alignItems: 'center'};
        let containerStyle = disable ? this.props.disableContainerStyle : this.props.containerStyle;
        let textStyle = disable ? this.props.disableTextStyle : this.props.textStyle;
        if (!textStyle) {
            textStyle = disable ? {color: 'rgb(177,177,177)'} : {color: 'rgb(77,77,77)'};
        }
        let text = !disable ? this.props.normalText : (sendState == 1 ? this.props.sendingText : this.state.countDownNum + '秒后重发');
        return (
            <TouchableOpacity
                style={[defaultContainerStyle,containerStyle ? containerStyle : this.props.containerStyle]}
                onPress={()=>this.props.onPress && this.props.onPress()}
                disabled={disable}
                activeOpacity={this.props.activeOpacity}
            >
                <Text style={textStyle}>{text}</Text>
            </TouchableOpacity>
        )
    }

    _startTimer() {
        if (this.timer) this._clearTimer();
        this.timer = setInterval(() => {
            let count = this.state.countDownNum - 1;
            if (count <= 0) {
                this._clearTimer();
                return;
            }
            this.setState({countDownNum: count})
        }, this.props.interval)
    }

    _clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            this.setState({
                sendState: 0,
                countDownNum: this.props.countDownNum
            });
        }
    }
}