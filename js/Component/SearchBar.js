/**
 * Created by zhangmaliang on 2017/6/14.
 */

import React, {Component, PropTypes} from 'react';
import {
    ViewPropTypes,
    Text,
    TouchableWithoutFeedback,
    Image,
    TextInput,
    StyleSheet,
    View,
    Dimensions,
    Animated
}from 'react-native';

let searchIcon = require('../../Resources/Images/Contact/conact_searchIcon.png');
const {width} = Dimensions.get('window');
const searchBoxWidth = width - 2 * 8;
const defaulticonLeftMargin = 177;

// 跟原生的差距很大。。。
export default class SearchBar extends Component {

    static propTypes = {
        placeholder: PropTypes.string,
        onTextChange: PropTypes.func,
        onSearchButtonPress: PropTypes.func,
    };

    static defaultProps = {
        placeholder: '搜索',
        onTextChange: (text) => {},
        onSearchButtonPress: () => {}
    };

    constructor(props) {
        super(props);
        this.state = {
            onfocus: false,
            iconLeftMargin: new Animated.Value(defaulticonLeftMargin)
        };
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <View style={styles.searchBox}>
                    <Animated.Image source={searchIcon}
                                    style={[styles.searchIcon,{transform:[{translateX:this.state.iconLeftMargin}]}]}/>
                    <TextInput ref="textInput"
                               style={[styles.inputText,{textAlign:this.state.onfocus ? 'left': 'center'}]}
                               keyboardType='web-search'
                               placeholder={this.props.placeholder}
                               placeholderTextColor={'blue'}
                               clearButtonMode={'while-editing'}
                               onFocus={()=>this._onfocus()}
                               onBlur={()=>this._onBlur()}
                               onChangeText={text=>this.props.onTextChange(text)}
                               onSubmitEditing={()=>this.props.onSearchButtonPress()}
                    />
                </View>
            </View>
        )
    }

    _onfocus() {
        this.setState({onfocus: true});
        Animated.timing(this.state.iconLeftMargin, {
            toValue: 6,
            duration: 50
        }).start();
    }

    _onBlur() {
        this.refs.textInput.clear();
        Animated.timing(this.state.iconLeftMargin, {
            toValue: defaulticonLeftMargin,
            duration: 50
        }).start(() => this.setState({onfocus: false}));
    }
}


const styles = StyleSheet.create({
    containerStyle: {
        width: width,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(244,244,244)'
    },
    searchBox: {
        height: 30,
        width: searchBoxWidth,
        flexDirection: 'row',
        borderRadius: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 8,
    },
    searchIcon: {},
    inputText: {
        backgroundColor: 'transparent',
        fontSize: 13,
        width: searchBoxWidth - 20,
        marginLeft: 10,
        color: 'blue'
    }
});