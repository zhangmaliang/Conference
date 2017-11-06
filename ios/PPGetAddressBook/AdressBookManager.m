//
//  AdressBookManager.m
//  Reading
//
//  Created by zhangmaliang on 2017/6/27.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "AdressBookManager.h"
#import "PPGetAddressBook.h"

@implementation AdressBookManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getSortedAdressBook:(RCTResponseSenderBlock)success){
  
  // addressBookDict:{'A': [PPPersonModel,PPPersonModel...]}
  [PPGetAddressBook getOrderAddressBook:^(NSDictionary<NSString *,NSArray<PPPersonModel *> *> *addressBookDict, NSArray *nameKeys) {

    NSMutableArray *imagePeoples = @[].mutableCopy;
    NSMutableArray *addressBooks = @[].mutableCopy;
    for (NSString *key in nameKeys) {
      NSMutableDictionary *contactDict = @{}.mutableCopy;
      NSMutableArray *contacts = @[].mutableCopy;
      NSArray *peopleModels = addressBookDict[key];
      for (PPPersonModel *people in peopleModels) {
        if(people.mobileArray.count > 10) continue;   // ios手机上有个垃圾电话记录点..过滤
        if(people.headerImage){
          [imagePeoples addObject:people];
        }
        [contacts addObject:@{
                              @"name":people.name ?: @"",
                              @"mobileArray":people.mobileArray ?: @[],
                              @"iconPath": people.headerImage ? [self pathOfFile:people.identifier] : @"",
                              @"identifier": people.identifier
                              }];
      }
      contactDict[key] = contacts;
      [addressBooks addObject:contactDict];
    }
    [self saveImages:imagePeoples];
    
    // addressBookDict中包含模型对象，js无法辨别。 需要转化为json传递
    !success ?: success(@[[NSNull null],addressBooks]);
    
  } authorizationFailure:^{
      [self alert];
  }];
}

- (void)saveImages:(NSArray *)peoples{
  dispatch_async(dispatch_get_global_queue(0, 0), ^{
    NSString *dirPath= [self pathOfDirectory];
    [self checkDirectory:dirPath];
    for (PPPersonModel *people in peoples) {
      NSString *filePath = [self pathOfFile:people.identifier];
      if([[NSFileManager defaultManager] fileExistsAtPath:filePath]) continue;
      NSData *imgData = UIImageJPEGRepresentation(people.headerImage,0.7);
      [imgData writeToFile:filePath atomically:YES];
    }
  });
}

- (void)checkDirectory:(NSString *)dirPath{
  NSFileManager *mgr = [NSFileManager defaultManager];
  BOOL existDir = NO;
  [mgr fileExistsAtPath:dirPath isDirectory:&existDir];
  if(!existDir){
    [mgr createDirectoryAtPath:dirPath withIntermediateDirectories:YES attributes:nil error:nil];
  }
}

- (NSString *)pathOfFile:(NSString *)fileName{
  return [NSString stringWithFormat:@"%@/%@.jpg",[self pathOfDirectory],fileName];
}

- (NSString *)pathOfDirectory{
  NSString *cachePath = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES).firstObject;
  return [cachePath stringByAppendingPathComponent:@"ContactImages"];
}

- (void)alert{
  [[[UIAlertView alloc] initWithTitle:@"提示"
                              message:@"请在iPhone的“设置-隐私-通讯录”选项中，允许“电话会议”访问您的通讯录"
                             delegate:nil
                    cancelButtonTitle:@"知道了"
                    otherButtonTitles:nil] show];
}

@end
