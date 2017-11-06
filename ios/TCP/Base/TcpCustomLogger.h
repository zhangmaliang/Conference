//
//  TcpCustomLogger.h
//  ucstcplib
//
//  Created by Barry on 15/9/28.
//  Copyright © 2015年 ucpaas. All rights reserved.
//

#import <Foundation/Foundation.h>





@interface TcpCustomLogger : NSObject

/*!
 *  @author barry, 15-09-28 11:09:31
 *
 *  @brief  文件名,不设置就使用默认文件名
 */
@property (nonatomic, copy) NSString * fileName;


+(instancetype)sharedInstance;



/*!
 *  @author barry, 15-09-28 11:09:24
 *
 *  @brief  保存log消息到沙盒中
 *
 *  @param log <#log description#>
 */
- (void)saveLog:(NSString *) log;

@end
