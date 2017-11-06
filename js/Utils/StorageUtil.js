/**
 * Created by zhangmaliang on 2017/6/15.
 */

import React from 'react';
import {AsyncStorage} from 'react-native';


export default class StorageUtil {

    static save(key, value, callBack = defaultFun) {
        return AsyncStorage.setItem(key, JSON.stringify(value), (err) => callBack(err));
    }

    static get(key) {
        return AsyncStorage.getItem(key).then((value) => {
            return JSON.parse(value);
        });
    }

    static delete(key, callBack = defaultFun) {
        return AsyncStorage.removeItem(key, err => callBack(err));
    }
}
