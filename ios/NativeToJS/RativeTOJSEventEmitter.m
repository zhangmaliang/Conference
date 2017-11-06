//
//  RativeTOJSEventEmitter.m
//  Redux_Teleconference
//
//  Created by zhangmaliang on 2017/8/14.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RativeTOJSEventEmitter.h"

NSString *const TableDeleteRowEvent = @"TableDeleteRowEvent";
NSString *const TableRowClickedEvent = @"TableRowClickedEvent";

#define EmitEventNames @[TableDeleteRowEvent,TableRowClickedEvent]
#define NotificationCenter [NSNotificationCenter defaultCenter]

@implementation RativeTOJSEventEmitter

RCT_EXPORT_MODULE();

#pragma mark - 必须重写的父类方法

- (NSArray<NSString *> *)supportedEvents {
  return EmitEventNames; // 返回所有原生端发往js端的消息名字
}

- (void)startObserving{
  for(NSString *emit in self.supportedEvents){
      [NotificationCenter addObserver:self selector:@selector(emit:) name:emit object:nil];
  }
}

- (void)stopObserving{
  [NotificationCenter removeObserver:self];
}

#pragma mark - 自定义方法

- (void)emit:(NSNotification *)notification{
  NSString *emitName = notification.userInfo[@"emitName"];
  [self sendEventWithName:emitName body:notification.userInfo[@"index"]];
}

+ (void)emit:(NSString *)emitName index:(NSInteger)index{
  NSDictionary *dict = @{
                          @"emitName":emitName,
                          @"index":@(index)
                         };
  [NotificationCenter postNotificationName:emitName object:self userInfo:dict];
}

@end
