/**
 * Created by zhangmaliang on 2017/8/2.
 */

/*      某个表中修改字段名. 添加字段，删除字段需要合并操作，在schemas添加一行，版本依次递增
 *       添加，删除表不用合并，直接在schemas最后那行的schema数组中添加删除即可
 * */

import Realm from 'realm'

const UserSchema = {  // 保存所有曾经登录过的用户
    name: 'User',
    primaryKey: 'phone',
    properties: {
        phone: 'string',
        password4: 'string',         // 版本变化，该变量从password->password2->password3->password4
    }
};

const CurrentUserSchema = {   // 保存当前登录用户，至多只有一个数据
    name: 'CurrentUser',
    primaryKey: 'phone',
    properties: {
        phone: 'string'
    }
};

const schemas = [
    {schema: [UserSchema, CurrentUserSchema], schemaVersion: 1},
    {schema: [UserSchema, CurrentUserSchema], schemaVersion: 2, migration: migration_1To2},
    {schema: [UserSchema, CurrentUserSchema], schemaVersion: 3, migration: migration_2To3},
    {schema: [UserSchema, CurrentUserSchema], schemaVersion: 4},
];

// try语法，防止合并过程中出现异常导致程序崩溃。这样，如果出错，只会造成数据丢失，程序照样运行
// 表结构变化时，数据库会自动将不变字段的值保留，而那些修改的/删除的/新增的字段的值可以在这里面赋予
function migration_1To2(oldRealm, newRealm) {
    try {
        let oldObjects = oldRealm.objects('User');
        let newObjects = newRealm.objects('User');
        for (let i = 0; i < oldObjects.length; i++) {
            newObjects[i].password2 = oldObjects[i].password;
        }
    } catch (e) {
        console.log(e);
    }
}

function migration_2To3(oldRealm, newRealm) {
    try {
        let oldObjects = oldRealm.objects('User');
        let newObjects = newRealm.objects('User');
        for (let i = 0; i < oldObjects.length; i++) {
            newObjects[i].password3 = oldObjects[i].password2;
        }
    }catch (e) {
        console.log(e);
    }
}


/*  初始化数据库，完成所有版本迁移合并工作,在项目启动时调用
 *
 *   currentVersion,程序首次运行返回值为-1,否则返回当前数据库版本
 * */
let currentVersion = Realm.schemaVersion(Realm.defaultPath);
while (currentVersion != -1 && currentVersion < schemas.length) {
    let migratedRealm = new Realm(schemas[currentVersion++]);
    migratedRealm.close();
}

export default realm = new Realm(schemas[schemas.length - 1]);