/**
 * Created by zhangmaliang on 2017/6/9.
 */


export default class ArrayUtil {

    /**
     * 将数组中指定元素移除,若元素为对象，需要指定判断对象是否相等的key
     * **/
    static remove(array, item, key) {
        if (!array || !item) return;
        let hasKey = key.length > 0;
        for (let i = 0, l = array.length; i < l; i++) {
            if (hasKey) {
                if (item[key] === array[i][key]) {
                    array.splice(i, 1);
                    break;
                }
            } else {
                if (item === array[i]) {
                    array.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * 获取数组中的某一个对象，根据对象的key，获取数组中的某一个对象
     * **/
    static obtain(array,item,key){
        if (!array || !item) return null;
        let hasKey = key.length > 0;
        for (let i = 0, l = array.length; i < l; i++) {
            if (hasKey) {
                if (item[key] === array[i][key]) return array[i];
            } else {
                if (item === array[i]) return array[i];
            }
        }
        return null;
    }

    /**
     * 数组中是否包含指定元素, 若元素为对象，需要指定判断对象是否相等的key
     * **/
    static contain(array, item, key) {
        if (!array || !item) return false;
        let hasKey = key.length > 0;
        for (let i = 0, l = array.length; i < l; i++) {
            if (hasKey) {
                if (item[key] === array[i][key]) return true;
            } else {
                if (item === array[i]) return true;
            }
        }
        return false;
    }

    /**
     * 对数组进行排序。RN中，数组的排序sort方法相当不好使，自己写
     * compareFunc函数返回值必须是bool类型
     * **/
    static sort(array, compareFunc) {
        if (!array || !compareFunc) return;
        let i, j, COUNT = array.length;
        for (j = 0; j < COUNT - 1; j++) {
            for (i = 0; i < COUNT - 1 - j; i++) {
                if (compareFunc(array[i], array[i + 1])) {
                    let tmp = array[i];
                    array[i] = array[i + 1];
                    array[i + 1] = tmp;
                }
            }
        }
    }
}