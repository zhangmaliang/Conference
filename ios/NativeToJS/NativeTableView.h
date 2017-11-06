//
//  NativeTableView.h
//  Redux_Teleconference
//
//  Created by zhangmaliang on 2017/8/14.
//  Copyright © 2017年 Facebook. All rights reserved.
//  为了暴露原生端控制器给js，需要一个UIView做中转

#import <UIKit/UIKit.h>

@interface NativeTableView : UIView

@property (nonatomic, strong) NSArray *datas;

- (BOOL)changeBackgroundColor:(NSString *)color;

@end
