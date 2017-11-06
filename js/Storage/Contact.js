/**
 * Created by zhangmaliang on 2017/6/27.
 */


import StorageUtil from '../Utils/StorageUtil';
import ArrayUtil from '../Utils/ArrayUtil'

const ImportContactsKey = 'ImportContactsKey222122222212112212322221122322122223212222222';
const randomColors = [
    '#7DDFCA', '#84CC7E', '#45C097', '#91AD70', '#E5BA6A', '#DCAF2D', '#87ADEF',
    '#B69C64', '#B28B3F', '#F4A6A6', '#F58986', '#B19693', '#B66A6B'
];

export class ContactDao{

    // 返回数据库中所有已经导入联系人的数组[Contact,...]
    static getAllImportContacts() {
        return new Promise((resolve, reject) => {
            StorageUtil.get(ImportContactsKey).then(contacts => {
                if (!contacts) {
                    contacts = [];
                }
                resolve(contacts);
            }).catch(err => {
                reject(err);
            })
        });
    }

    // 以分组ListView的datasoruce能直接显示的组装方式，返回数据库中所有已经导入联系人的数据
    static getListViewDataOfImportContacts(){
        return new Promise((resolve, reject) => {
            this.getAllImportContacts().then(contacts => {
                let lastLetter = null;
                let newContacts = [];
                let index = -1;
                for (let i = 0; i < contacts.length; i++) {
                    let contact = contacts[i];
                    if (contact.firstLetter == lastLetter) {
                        newContacts[index].push(contact)
                    } else {
                        newContacts.push([contact]);
                        index++;
                        lastLetter = contact.firstLetter;
                    }
                }
                let dataBlob = {}, sectionIds = [], rowIds = [];
                for (let i = 0; i < newContacts.length; i++) {
                    let contactArr = newContacts[i];
                    sectionIds.push(i);
                    rowIds[i] = [];
                    dataBlob[i] = contactArr[0].firstLetter;
                    for (let j = 0; j < contactArr.length; j++) {
                        rowIds[i].push(j);
                        dataBlob[i + ':' + j] = contactArr[j];
                    }
                }
                resolve({dataBlob,sectionIds,rowIds})
            }).catch(err=>{
                reject(err)
            })
        });
    }

    // contacts是 [Contact,...]。 所有存入数据库中的Contact是按首字母生序排序的有序数组
    // static saveImportContacts(contacts,callBack) {
    //     if (!contacts || contacts.length == 0) {
    //         callBack();
    //         return;
    //     }
    //     this.getAllImportContacts().then(importContacts => {
    //         // concat函数必须接受返回值才是合并后的数组。 splice不用接收
    //         contacts = contacts.concat(importContacts);
    //         this.sort(contacts);
    //         StorageUtil.save(ImportContactsKey, contacts, callBack);
    //     });
    // }


    /*  上面方式的改进版本，适用当contacts数量非常巨大的时候
    *
    *   每次只处理至多1000条数据，若数据过长，则拆分剩余数据到另外一个子任务
    *   setTimeout将任务添加到当前事件队列的末端，这样就将一个耗时很长的任务拆分为多个子任务执行，防止线程长时间堵塞
    * */
    static saveImportContacts(contacts, callBack) {
        if (!contacts || contacts.length == 0) {
            callBack();
            return;
        }
        this.getAllImportContacts().then(importContacts => {
            let firstArr = contacts.splice(0, 1000);
            importContacts = importContacts.concat(firstArr);
            this.sort(importContacts);
            StorageUtil.save(ImportContactsKey, importContacts, callBack);
            if (contacts.length > 0) {
                setTimeout(() => {
                    this.saveImportContacts(contacts, callBack)
                });
            }
        });
    }

    static updateContact(contact) {
        this.getAllImportContacts().then(contacts => {
            for (let i = 0, l = contacts.length; i < l; i++) {
                if (contact.identifier === contacts[i].identifier) {
                    contacts[i] = contact;
                    break;
                }
            }
            StorageUtil.save(ImportContactsKey, contacts);
        })
    }

    static sort(contacts){
        ArrayUtil.sort(contacts, (contact1, contact2) => {
            if(contact1.firstLetter == contact2.firstLetter){
                return contact1.name > contact2.name;
            }
            return contact1.firstLetter > contact2.firstLetter;
        });
    }
}


export class Contact{
    constructor(identifier,firstLetter,name,mobileArray,iconPath) {

        this.key = identifier;                // key用来区分contact对象，仅仅为了添加到数组中不报错需要
        this.identifier = identifier;         // 唯一标示，ios9之后格式为F3334UH-HOP887-... ios9之前为一个整数
        this.firstLetter = firstLetter;       // 'A','C'等通讯人名首字母
        this.name = name;
        this.mobileArray = mobileArray;       // 可能存在的多个电话
        this.iconPath = iconPath;             // 通讯录头像的路径


        /* 以下属性用于导入联系人处 */
        this.isSelect = false;               // 是否处于选中状态
        this.isImport = false;               // 是否已经导入过
        this.randomColor = this._randomColor();             // 随机颜色值
        this.shortName = this._handleWithName(name);    // 得到名字最后两个字母

        /* 以下属性用于联系人详情处 */
        this.detailMessage = '';

        /* 以下属性用于选择参会人员处 */
        this.isAdded = false;             // 是否已经添加，该为true时，addedMobile才有意义
        this.addedMobile = '';            // 已经添加的电话号码
        this.isAdding = false;            // 是否正在添加，该为true时，addingMobile才有意义
        this.addingMobile = '';           // 当前正在添加的电话号码
    }

    // 生成默认的我联系人，代表当前登录用户
    static defaultMineContact = (addedMobile)=>{
        let defaultContact = new Contact();
        defaultContact.shortName = '我';
        defaultContact.name = '我';
        defaultContact.identifier = '我';
        defaultContact.randomColor = 'rgb(99,202,244)';
        defaultContact.isAdded = true;
        defaultContact.addedMobile = addedMobile;
        return defaultContact;
    };

    _handleWithName(name) {
        if(!name) return '';
        let mark = name;
        if (mark.length > 2) {
            mark = mark.substring(mark.length - 2);
        }
        return mark;
    }

    _randomColor() {
        // 若randomColors.length为13，得到0-12之间的随机整数
        let randomCount = Math.floor(Math.random() * randomColors.length);
        return randomColors[randomCount];
    }
}