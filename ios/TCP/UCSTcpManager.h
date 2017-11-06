//
//  UCSTcpManager.h
//  UCS_Conference_Demo
//
//  Created by 陈怀远 on 15/9/30.
//  Copyright © 2015年 Kohler. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "UCSTcpAsyncSocket.h"
typedef struct _tagIMTCPFrameHead
{
    UInt16 headerLength;
    UInt16 packageLength;
    UInt16 version;
    UInt32 seq;
    UInt16 cmd;
    UInt16 sessionId;
    
    
} ConfTCPFrameHead;

// socket相关
// 心跳
NSString * const UCHeartNotication = @"UCHeartNotication";
// 登录
NSString * const UCLoginRequestNotication = @"UCLoginRequestNotication";
NSString * const UCLoginResponseNotication = @"UCLoginResponseNotication";

// 会议
NSString * const UCCreateConfNotication = @"UCCreateConfNotication";
NSString * const UCConfStateNotication = @"UCConfStateNotication";
NSString * const UCMemberStateNotication = @"UCMemberStateNotication";
NSString * const UCDismissConfNotication = @"UCDismissConfNotication";
NSString * const UCInviteMemberNotication = @"UCInviteMemberNotication";
NSString * const UCDelMemberNotication = @"UCDelMemberNotication";

// 会控
NSString * const UCNoneSayNotication = @"UCNoneSayNotication";
NSString * const UCNoneHearNotication = @"UCNoneHearNotication";
NSString * const UCSetRoleNotication = @"UCSetRoleNotication";
NSString * const UCRecordVoiceNotication = @"UCRecordVoiceNotication";
NSString * const UCPlayVoiceNotication = @"UCPlayVoiceNotication";
NSString * const UCExtendTimeNotication = @"UCExtendTimeNotication";
NSString * const UCConfStateSycNotication = @"UCConfStateSycNotication";
NSString * const UCNConfStateMsgNotication = @"UCNConfStateMsgNotication";

// 验证码
NSString * const UCSecurityCodeNotication = @"UCSecurityCodeNotication";
NSString * const UCSecurityCodeMsgNotication = @"UCSecurityCodeMsgNotication";

// 重连
NSString * const UCReLoginNotication = @"UCReLoginNotication";

// 锁定
NSString * const UCLockConfNotication = @"UCLockConfNotication";

// 全部静音
NSString * const UCMuteAllNotication = @"UCMuteAllNotication";

NSString * const UCSwitchTouchNotication = @"UCSwitchTouchNotication";
NSString * const UCSwitchChangNotication = @"UCSwitchChangNotication";
NSString * const UCConfControlNotication = @"UCConfControlNotication";
NSString * const UCConfEndBackNotication = @"UCConfEndBackNotication";
NSString * const UCRefreshTableViewNotication = @"UCRefreshTableViewNotication";

NSString * const UCDismissConfedNotication = @"UCDismissConfedNotication";


@interface UCSTcpManager : NSObject <UCSTcpAsyncSocketDelegate>
{
    UCSTcpAsyncSocket *_socket;
}
@property int  tcpLoginNetType; /// 登陆的网络类型
@property int  seqnumber;		/// 流水
@property BOOL isClientOnline;  // socket连接是否断开
//@property (nonatomic, assign) UCSTcpAsyncSocket *socket;
@property (nonatomic, retain) NSTimer	*heartbeatTimer;  ///< 心跳定时器

@property (nonatomic, assign) BOOL offlinePushClosed;   //离线推送是否关闭，yes 关闭 ，no 打开。程序启动时，默认是打开


/**
 *  @brief instance
 */
+ (UCSTcpManager *)instance;



- (BOOL)connect2TCP:(NSData *)aData;

-(void)sendMessage:(NSData *)sendData;

-(void)recvMessage:(NSData *)reData;

/// 主动断开连接
- (void)disconnectServer;
- (BOOL)isConnected;

- (void)heartbeat;

- (void)resendHeartbeat;

- (void)enterBackground;

- (void)enterForeground;

-(void)onConnectSuccessfull;
@end
