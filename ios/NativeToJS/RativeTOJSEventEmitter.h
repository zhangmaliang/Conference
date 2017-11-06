//
//  RativeTOJSEventEmitter.h
//  Redux_Teleconference
//
//  Created by zhangmaliang on 2017/8/14.
//  Copyright © 2017年 Facebook. All rights reserved.
//  原生端传递事件和数据给js，原生->js。 这里是原生事件为驱动
//  RCT_EXPORT_METHOD导出方法让js调用，那是js事件为驱动

#import <React/RCTEventEmitter.h>

extern NSString *const TableDeleteRowEvent;
extern NSString *const TableRowClickedEvent;

@interface RativeTOJSEventEmitter : RCTEventEmitter<RCTBridgeModule>

// emitName只能是上面两个导出常量之一
+ (void)emit:(NSString *)emitName index:(NSInteger)index;

@end
