/**
 * Created by zhangmaliang on 2017/6/14.
 */

import React, {PureComponent, PropTypes} from 'react';
import{ActivityIndicator, Text, StyleSheet, View, Modal}from 'react-native';

export default class LoadingView extends PureComponent {

    static propTypes = {
        text: PropTypes.string,
        backgroundColor: PropTypes.string,
        opacity: PropTypes.number,
        indicatorColor: PropTypes.string,
        visible:PropTypes.bool
    };

    static defaultProps = {
        text: '数据加载中...',
        backgroundColor: 'black',
        opacity: 0.6,
        indicatorColor: 'white',
        visible:false
    };

    render() {
        return (
            <Modal
                animationType="fade"
                visible={this.props.visible}
                transparent>
                <View style={[styles.loading,{backgroundColor:this.props.backgroundColor,opacity:this.props.opacity}]}>
                    <ActivityIndicator size="large" color={this.props.indicatorColor}/>
                    <Text style={styles.loadingText}>{this.props.text}</Text>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        textAlign: 'center',
        color:'white'
    }
});
