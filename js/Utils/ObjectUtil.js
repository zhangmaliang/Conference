/**
 * Created by zhangmaliang on 2017/7/21.
 */

export default class ObjectUtil{
    static deepCopy(obj){
        return JSON.parse(JSON.stringify(obj));
    }
}