/**
 * Created by zhangmaliang on 2017/7/24.
 */

import Toast from 'react-native-root-toast';


let toast;

export default class ToastView{

    static show(content, duration = 0.8, onShow, onShown, onHide, onHidden){

        if (toast !== undefined) {
            Toast.hide(toast);
        }

        toast = Toast.show(content.toString(), {
            duration: duration * 1000,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onShow: onShow,
            onShown: onShown,
        })
    }
}