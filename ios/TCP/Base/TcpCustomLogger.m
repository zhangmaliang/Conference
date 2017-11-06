//
//  TcpCustomLogger.m
//  ucstcplib
//
//  Created by Barry on 15/9/28.
//  Copyright © 2015年 ucpaas. All rights reserved.
//

#import "TcpCustomLogger.h"

@implementation TcpCustomLogger


static id _instace;

+(instancetype)sharedInstance
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instace = [[self alloc] init];
    });
    return _instace;
}




/*!
 *  @brief  保存tcp信息到沙盒
 *
 *  @param str <#str description#>
 */
- (void)WriteToSandBox:(NSString *)str
{
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *fileName;
    if (_fileName) {
        fileName = [_fileName copy];
    }else{
        fileName = @"tcpConnectionLog.log";
    }
    NSString *filePath=[documentsDirectory stringByAppendingPathComponent:fileName];
    NSString * allStr = [NSString string];
    if ([[NSFileManager defaultManager]fileExistsAtPath:filePath])
    {
        NSString *lastStr = [[NSString alloc] initWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
        allStr  = [NSString stringWithFormat:@"%@\n%@", lastStr, str];
    }
    [allStr writeToFile:filePath atomically:YES encoding:NSUTF8StringEncoding error:nil];
}


- (void)saveLog:(NSString *) log{
    
    NSString * string = [NSString stringWithFormat:@"时间%@  方法: %@", [self getNowTime], log];
    
    if (1) {
        [self WriteToSandBox:string];
    }
}

- (NSString *)getNowTime
{
    NSDate * date = [NSDate date];
    NSDateFormatter * formatter = [[NSDateFormatter alloc] init];
    formatter.dateFormat = @"yyyy-MM-dd HH:mm:ss";
    NSString * dateStr = [formatter stringFromDate:date];
    return dateStr;
}

@end
