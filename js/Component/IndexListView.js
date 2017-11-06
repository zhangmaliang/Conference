/**
 * Created by zhangmaliang on 2017/7/4.
 */
import React, {Component, PropTypes} from 'react';
import {View, ListView}from 'react-native';
import IndexView from './IndexView'

// 该类是对分组ListView的扩展，让其右侧带有索引列表
export default class IndexListView extends ListView {

    indexSectionSizes = [];

    render() {
        let size = 0;
        let indexDatas = [];

        // 下面的取值方法是打印调试出来的，非正式API
        let dataBlob = this.props.dataSource['_dataBlob'];
        if(!dataBlob) return null;

        let keys = Object.keys(dataBlob);
        if(keys.length == 0) return super.render();

        keys.forEach(k => {
            let v = dataBlob[k];
            if (typeof v == 'string') {
                indexDatas.push(v);
            }
        });

        let rowIds = this.props.dataSource['rowIdentities'];
        rowIds.forEach(ids => {
            this.indexSectionSizes.push(size);
            size += ids.length;
        });

        return (
            <View style={{flex:1}}>
                {super.render()}
                <IndexView sections={indexDatas} onSectionSelect={this._onSectionselect}/>
            </View>
        )
    }

    _onSectionselect = (section, index) => {

        // 这个方法官方有实现，但是没办法知道每个item的高度啊。。。
        super.scrollTo({x: 0, y: index * 100, animate: true});
    };
}