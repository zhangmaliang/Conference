/**
 * Created by zhangmaliang on 2017/6/28.
 */


import {NativeModules} from 'react-native';
import {Contact} from '../Storage/Contact'

export default class AdressBookManager {
    /*
     addressBooks的数据结构如下. 最外层必须是数组，否则无法保证key的顺序
     [
     {'A': [
     {
     name:'jack',
     mobileArray:[18682091931,18788331122],
     iconPath: 图片在沙盒路径,
     identifier:'唯一标示'
     },
     ...
     ],
     },
     {'H':[
     {
     name:'jack',
     mobileArray:[18682091931,18788331122],
     iconPath: 图片在沙盒路径,
     identifier:'唯一标示'
     },
     ...
     ]
     }
     ];
     */


    static getAddressBooks(){
        let addressBooks = [];
        let letters = ['A','B','C','D','E','F','G','H','I','J','K'];
        letters.forEach(letter=>{
            let obj = {};
            let arr = [];
            for(let i =0;i<1000;i++){
                let mobileArray = [];
                for(let j =0;j<i%4 + 1;j++){
                    mobileArray.push(this.randomNum());
                }
                arr.push({
                    name:'jack' + letter + i,
                    mobileArray:mobileArray,
                    identifier:'jack' + letter + i,
                    iconPath: '',
                })
            }
            obj[letter] = arr;
            addressBooks.push(obj);
        })
        return addressBooks;
    }

    static randomNum(){
        let randomCount = Math.floor(Math.random() * 10000000000);
        return randomCount + 10000000000;
    }

    static getSortedAdressBook() {
        return new Promise((resolve, reject) => {
            resolve(this.getAddressBooks());
        });
    }

    // static getSortedAdressBook() {
    //     return new Promise((resolve, reject) => {
    //         NativeModules.AdressBookManager.getSortedAdressBook((err, addressBooks) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(addressBooks);
    //             }
    //         })
    //     });
    // }

    // 从原生端获取能直接被ListView显示的电话薄数据
    static getListViewDataWithAdressBook() {
        return new Promise((resolve, reject) => {
            this.getSortedAdressBook().then(addressBooks => {
                if (addressBooks) {
                    resolve(this._convertToListViewData(addressBooks))
                } else {
                    reject('获取到空的电话博');
                }
            });
        }).catch(err => {
            reject(err);
        });
    }

    // 电话薄数据转换为ListView能直接显示的数据
    static _convertToListViewData(addressBooks) {
        let dataBlob = {}, sectionIds = [], rowIds = [];
        for (let i = 0, l = addressBooks.length; i < l; i++) {
            let addressBook = addressBooks[i];
            for (firstLetter in addressBook) {      // addressBook对象仅有一个key
                sectionIds.push(i);
                rowIds[i] = [];
                dataBlob[i] = firstLetter;
                let contacts = addressBook[firstLetter];
                for (let j = 0, ls = contacts.length; j < ls; j++) {
                    rowIds[i].push(j);
                    let contact = contacts[j];
                    dataBlob[i + ':' + j] = new Contact(contact.identifier, firstLetter, contact.name, contact.mobileArray, contact.iconPath);
                }
            }
        }
        return {dataBlob,sectionIds,rowIds}
    }

    // 从原生端获取能直接被sectionList显示的电话薄数据
    static getSectionListDataWithAdressBook() {
        return new Promise((resolve, reject) => {
            this.getSortedAdressBook().then(addressBooks => {
                if (addressBooks) {
                    resolve(this._convertToSectionListData(addressBooks));
                } else {
                    reject('获取到空的电话博');
                }
            });
        }).catch(err => {
            reject(err);
        });
    }

    // 对上面所示的电话薄数据格式，转换为sectionList能直接显示的数据源
    static _convertToSectionListData(addressBooks) {
        let sectionListData = [];
        for (let i = 0; i < addressBooks.length; i++) {
            let addressBook = addressBooks[i];
            for (firstLetter in addressBook) {      // addressBook对象仅有一个key
                let contacts = addressBook[firstLetter];
                let datas = [];
                for (let j = 0; j < contacts.length; j++) {
                    let contact = contacts[j];
                    datas.push(new Contact(contact.identifier, firstLetter, contact.name, contact.mobileArray, contact.iconPath));
                }
                sectionListData.push({  // SectionList要求填充数据按照这样的格式
                    key: firstLetter,
                    data: datas
                });
            }
        }
        return sectionListData;
    }
}