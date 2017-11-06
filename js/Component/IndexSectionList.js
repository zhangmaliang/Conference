/**
 * Created by zhangmaliang on 2017/7/4.
 */
import React, {Component, PropTypes} from 'react';
import {View, SectionList}from 'react-native';
import IndexView from './IndexView'

// 该类是对SectionList的扩展，让其右侧带有索引列表
export default class IndexSectionList extends SectionList {

    indexSectionSizes = [];

    render() {
        let size = 0;
        let indexDatas = [];
        this.props.sections.forEach(data => {
            indexDatas.push(data.key);
            this.indexSectionSizes.push(size);
            size += data.data.length;
        });

        return (
            <View style={{flex:1}}>
                {super.render()}
                <IndexView sections={indexDatas} onSectionSelect={this._onSectionselect}/>
            </View>
        )
    }

    // RN0.44源码中SectionList没有注册scrollToIndex方法，需要自己手动修改源码
    _onSectionselect = (section, index) => {
        this.scrollToIndex({animated: true, index: this.indexSectionSizes[index]})
    };
}

