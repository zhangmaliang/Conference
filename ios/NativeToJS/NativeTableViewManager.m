//
//  NativeTableViewManager.m
//  Redux_Teleconference
//
//  Created by zhangmaliang on 2017/8/14.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "NativeTableViewManager.h"
#import "NativeTableView.h"
#import <React/RCTEventDispatcher.h>
#import <React/RCTUIManager.h>

@implementation NativeTableViewManager

RCT_EXPORT_MODULE()
// 暴露该管理类管理的视图的属性给js，js设置该属性时会调用其setter方法
RCT_EXPORT_VIEW_PROPERTY(datas, NSArray)

RCT_EXPORT_METHOD(changeBackgroundColor:(NSString *)colorName
                  viewTag:(NSInteger)tag
                  resolve:(RCTPromiseResolveBlock) resolve
                  reject:(RCTPromiseRejectBlock)reject){
  
  NativeTableView *view = (NativeTableView *)[self.bridge.uiManager viewForReactTag:@(tag)];
  BOOL success = NO;
  if([view isKindOfClass:[NativeTableView class]]){
    success = [view changeBackgroundColor:colorName];
  }
  success ? resolve(@(YES)) : reject(@"1000", @"修改失败", nil);
}

#pragma mark - 重写父类方法

/// 重写这个方法，返回将要提供给RN使用的视图
- (UIView *)view {
//  return [NativeTableViewController new].view;   这样不行。。。。
  return [[NativeTableView alloc] initWithFrame:[UIScreen mainScreen].bounds];
}

- (dispatch_queue_t)methodQueue{
  return dispatch_get_main_queue();
}


@end
