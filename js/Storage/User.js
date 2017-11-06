/**
 * Created by zhangmaliang on 2017/7/20.
 */

import realm from './index'

export class User {
    constructor(phone, password) {
        this.phone = phone;
        this.password = password;
    }
}

export class UserDao {

    static save(user) {
        realm.write(()=>{
            realm.create('User',{phone:user.phone,password4:user.password},true);
            realm.create('CurrentUser',{phone:user.phone},true);
        })
    }

    // 获取当前登陆的用户user
    static getCurrentUser() {
        return new Promise((resolve, reject) => {
           let result = realm.objects('CurrentUser');
           result ? resolve(result[0]) : resolve(null)
        });
    }

    // 删除当前登录用户的信息，退出登录时调用
    static deleteCurrentUser() {
        let result = realm.objects('CurrentUser');
        if(!result) return;
        realm.write(()=>{
            realm.delete(result[0]);
        })
    }

    // 获取曾经登陆过的所有账号信息:[user,user...]
    static getAllUsers() {
        return new Promise((resolve, reject) => {
            let result = realm.objects('User');
            result ? resolve(result) : resolve(null)
        });
    }
}