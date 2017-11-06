/**
 * Created by zhangmaliang on 2017/7/21.
 */



/*
    在 JavaScript 里使用 typeof 来判断数据类型，只能区分基本类型，即 “number”，”string”，”undefined”，”boolean”，”object” 五种。
    对于数组、函数、对象来说，其关系错综复杂，使用 typeof 都会统一返回 “object” 字符串。
    要想区别对象、数组、函数单纯使用 typeof 是不行的，JavaScript中,通过Object.prototype.toString方法，判断某个对象值属于哪种内置类型。

    使用方法：
        let arr = [1];
        TypeUtil.isArray(arr)        // true
        TypeUtil.isObject(arr)       // false
        TypeUtil.isFunction(arr)...
 */


const jsType = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error"];
const TypeUtil = {};

for (let i = 0; i < jsType.length; i++) {
    (function (k) {
            TypeUtil['is' + jsType[k]] = function (obj) {
                return Object.prototype.toString.call(obj) === '[object ' + jsType[k] + ']';
            };
        })(i);
}


export default TypeUtil;