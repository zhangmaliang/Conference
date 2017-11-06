/**
 * Created by zhangmaliang on 2017/7/4.
 */


export default class DateUtil{

    // date: 通过new Date()生成的日期对象
    // fmt:  类似'yyyy-MM-dd hh:mm:ss'这样的格式
    static format(date,fmt){
        const o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(),      //日
            "h+": date.getHours(),      //小时
            "m+": date.getMinutes(),    //分
            "s+": date.getSeconds(),     //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)){  // 匹配年。因为只有年可能是超出两位，单独匹配
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
        }
        for (let k in o){// 匹配其他的
            if (new RegExp("(" + k + ")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
}



/*    别用下面这种给原生组件扩展方法，弊端
        1、可能跟别人定义冲突 2、可能跟系统名字冲突 3、bug定位难 4、污染全局
Date.prototype.Format = function (fmt) {

        。。。。。
};
*/