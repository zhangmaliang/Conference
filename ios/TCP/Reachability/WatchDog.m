//
//  WatchDog.m
//  UC_Demo_1.0.0
//
//  Created by Barry on 15/5/22.
//  Copyright (c) 2015年 Barry. All rights reserved.
//

#import "WatchDog.h"

@implementation WatchDog

static WatchDog *_instance;

+ (id)allocWithZone:(struct _NSZone *)zone
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [super allocWithZone:zone];
    });
    
    return _instance;
}

+ (instancetype)sharedWatchDog
{
    if (_instance == nil) {
        _instance = [[self alloc] init];
    }
    
    return _instance;
}

- (void)dealloc{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:kReachabilityChangedNotification object:nil];
}


/**
 *  Reachbility开始监控网络
 */
- (void)watchNetReachbility{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(reachabilityChanged:)
                                                 name: kReachabilityChangedNotification
                                               object: nil];
    self.hostReach = [Reachability reachabilityWithHostName:@"www.ucpaas.com"];
    [self.hostReach startNotifier];
    [self updateInterfaceWithReachability:self.hostReach];
}

- (void)updateInterfaceWithReachability:(Reachability *)reachability
{
    NetworkStatus netStatus = [reachability currentReachabilityStatus];
    switch (netStatus) {
        case NotReachable:
            self.haveNetWork = NO;
            break;
        case ReachableViaWiFi:
            self.haveNetWork = YES;
            break;
        case ReachableViaWWAN:
            self.haveNetWork = YES;
            break;
    }
}


#pragma mark - 监测网络情况，当网络发生改变时会调用
- (void)reachabilityChanged:(NSNotification *)note {
    Reachability* curReach = [note object];
    NSParameterAssert([curReach isKindOfClass: [Reachability class]]);
    NetworkStatus status = [curReach currentReachabilityStatus];
    switch (status) {
        case NotReachable:
            self.haveNetWork = NO; //断开连接
            break;
        case ReachableViaWiFi:
            self.haveNetWork = YES; //wifi
            break;
        case ReachableViaWWAN:
            self.haveNetWork = YES; //流量
            break;
        default:
            break;
    }
    
}



@end
