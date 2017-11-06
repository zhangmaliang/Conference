//
//  WatchDog.h
//  UC_Demo_1.0.0
//
//  Created by Barry on 15/5/22.
//  Copyright (c) 2015年 Barry. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Reachability.h"

@interface WatchDog : NSObject

@property (nonatomic) bool haveNetWork; //yes有网

@property (strong, nonatomic) Reachability * hostReach; //监控类

+ (instancetype)sharedWatchDog;

- (void)watchNetReachbility;

@end
