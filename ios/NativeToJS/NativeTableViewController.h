//
//  NativeTableViewController.h
//  Redux_Teleconference
//
//  Created by zhangmaliang on 2017/8/14.
//  Copyright © 2017年 Facebook. All rights reserved.
//  原生端控制器

#import <UIKit/UIKit.h>

@interface NativeTableViewController : UITableViewController

@property (nonatomic, strong) NSArray *datas;

- (BOOL)changeBackgroundColor:(NSString *)color;

@end
