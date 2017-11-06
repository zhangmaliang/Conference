/**
 * Created by zhangmaliang on 2017/7/21.
 */

import RNFetchBlob from 'react-native-fetch-blob';
import ToastView from '../Component/ToastView'

/**
 *  使用RNFetchBlob可以取消请求，设置超时时间等
 *  let *request = Request.get(url,(data)=>{}... request.cancel();
 * */

// 这个类似于oc中的单例
const Request = {

    BaseURL:'http://120.25.219.213:19999/',
    CONFERENCE_DETAIL:'hlc-telmeeting/conferenceGroup/detail',            // 会议详情页面
    CREATE_GROUP_ADD:'hlc-telmeeting/conferenceGroupMember/group/add',    // 往创建好的会议组中添加成员
    CREATE_PERSSION:'hlc-telmeeting/conferenceCreator/isAllow',           // 是否有创建会议的权限
    CREATE_GROUP:'hlc-telmeeting/conferenceGroup/add',                    // 创建会议组
    CONFERENCE_LIST:'hlc-telmeeting/conferenceGroup/query',               // 创建过的会议列表
    CONFERENCE_LIST_DELETE:'hlc-telmeeting/conferenceGroup/delete',       // 会议列表删除某一项


    Header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'APP-Version':'1.0.0',
        'App-Type':'ios'
    },

    Config: {
        indicator: true,             // 指示器,iOS专属
        timeout: 15000,
        // fileCache : bool,         缓存
        // path : string,            缓存地址
    },


    get:(url, params:Object = {}, successCallBack, failCallBack) =>{

        if(!isContected){
            ToastView.show('无网络，请稍后再试',1.5);
            failCallBack(new Error('无网络'));
            return;
        }

        if(params){
            url = url + '?' + Object.keys(params).map(key=>`${key}=${params[key]}`).join('&');
        }

        // url转码，防止url中有中文报错
        url = encodeURI(Request.BaseURL + url);

        console.log(url);

        return RNFetchBlob
            .config(Request.Config)
            .fetch('GET',url,Request.Header)
            .then((response) => {
                if (response.respInfo.status === 200){
                    return response.json();
                }else {
                    return failCallBack(response.json());
                }
            })
            .then((response)=>{
                successCallBack(response);
            })
            .catch((error)=>{
                failCallBack(error);
            })
    },


    // react-native-fetch-blob的post请求body不会写，服务器拿不到数据，可能服务器需要特殊处理才行。
    // 不可用，采用NetworkUtil
    post:(url, body, successCallBack, failCallBack) =>{

        url = Request.BaseURL + url;

        return RNFetchBlob
            .config(Request.Config)
            .fetch('POST',url,Request.Header,body)
            .then((response) => {
                if (response.respInfo.status === 200){
                    return response.json();
                }else {
                    return failCallBack(response.json());
                }
            })
            .then((response)=>{
                successCallBack(response);
            })
            .catch((error)=>{
                failCallBack(error);
            })
    },
};

export default Request;