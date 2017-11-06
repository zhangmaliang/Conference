//
//  UCSProctocol.m
//  UCS_Conference_Demo
//
//  Created by 陈怀远 on 15/9/29.
//  Copyright © 2015年 Kohler. All rights reserved.
//

#import "UCSProctocol.h"
#import "UCSTcpManager.h"
#import "UXTCPFrame.h"
#import "NSObject+SBJSON.h"

#define kLoginUserId   1234555    // 登录手机号码
#define kVersion       @"1.0.0"    // 版本号


@implementation UCSProctocol{
  unsigned long _sessionId;
  RCTResponseSenderBlock _callBack;
}

RCT_EXPORT_MODULE(TCP);

// 暴露给js的对象就是个单例
- (instancetype)init
{ 
  self = [super init];
  if (self) {
    NSArray *TCPNotifications = @[UCLoginResponseNotication,UCSecurityCodeMsgNotication,UCConfStateNotication];
    for(NSString *notification in TCPNotifications){
      [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveTCPNotication:) name:notification object:nil];
    }
  }
  return self;
}

- (void)dealloc{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)didReceiveTCPNotication:(NSNotification *)noti{
  UXTCPFrame *recvFrame = noti.userInfo[@"recvFrame"];
  NSDictionary *msgDict = [NSJSONSerialization JSONObjectWithData:recvFrame.msg options:NSJSONReadingAllowFragments error:nil];
  
  NSMutableDictionary *extaDict = @{}.mutableCopy;
  NSString *sessionId = recvFrame.frameHeader[@"sessionId"];  // 登录时有值
  if(sessionId && sessionId.length){
    extaDict[@"sessionId"] = sessionId;
  }
  
  if([noti.name isEqualToString:UCConfStateNotication] && [msgDict[@"state"] isEqualToString:@"1"]){
    // 创建会议过程中，会发出两个通知。
    // 最初通知状态码1，表示开始创建会议
    // 一小会后，会议创建成功，则再次发送通知状态码2，表示创建会议成功。若失败，则会发送通知状态码3，表示创建会议失败
    // RN中一个回调只能调用一次，否则崩溃
  }else{
    !_callBack ?: _callBack(@[[NSNull null],msgDict,extaDict]);
    _callBack = nil;
  }
}

/**
 *  发送验证码
 *  dict:字典，包含keys为电话号码phone
 */
RCT_EXPORT_METHOD(senderSecurityCode:(NSDictionary *)dict callBack:(RCTResponseSenderBlock)callBack){
  _callBack = callBack;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    [frame setVersion:01 seq:0000 cmd:17 sessionId:00];
    [frame setJsonMsg:dict];
    [self connect2Tcp:frame];
  });
}

/**
 *  登录请求
 *  dict:字典，包含keys为电话号码phone,输入的验证码veryfyCode
 */
RCT_EXPORT_METHOD(login:(NSDictionary *)dict callBack:(RCTResponseSenderBlock)callBack){
  _callBack = callBack;
  dispatch_async(dispatch_get_main_queue(), ^{
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    [frame setVersion:01 seq:0000 cmd:01 sessionId:00];
    [frame setJsonMsg:dict];
    [self connect2Tcp:frame];
  });
}

/**
 *  发起会议
 *  dict:字典，包含keys为会议组号groupId,创建者电话creatorPhone，会议名confTopic，会议最大人数maxMember，会议时长duration
    是否播放提示音playTone，Json数组:{[jnickname（名称）、number（号码）、role（角色）],…}，memberList，showNumber
 */
RCT_EXPORT_METHOD(createConference:(NSDictionary *)dict sessionId:(NSString *)sessionId callBack:(RCTResponseSenderBlock)callBack){
  _callBack = callBack;

  dispatch_async(dispatch_get_main_queue(), ^{
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    int int_sessionId = (int)strtoul([sessionId UTF8String], 0, 16);
    [frame setVersion:01 seq:0000 cmd:03 sessionId:int_sessionId];
    [frame setJsonMsg:dict];
    [self connect2Tcp:frame];
  });
}

/**
 *  解散会议
 *  dict:字典，包含keys为会议的confId
 */

RCT_EXPORT_METHOD(dismissConference:(NSDictionary *)dict sessionId:(NSString *)sessionId callBack:(RCTResponseSenderBlock)callBack){
  _callBack = callBack;
  dispatch_async(dispatch_get_main_queue(), ^{
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    int int_sessionId = (int)strtoul([sessionId UTF8String], 0, 16);
    [frame setVersion:01 seq:0000 cmd:06 sessionId:int_sessionId];
    [frame setJsonMsg:dict];
    [self connect2Tcp:frame];
  });
}





/**
 *  邀请加入
 *
 */
-(void)UCSInviteMember:(UCSInviteMemberClass *)aRequest
{
    // 与socket通信
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    
    NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:aRequest.confId, @"confId", aRequest.memberList, @"memberList", nil];
    
//    [frame setVersion:01 seq:0000 cmd:7 sessionId:_sessionId];
  
    [frame setJsonMsg:jsonDict];
    
    [self connect2Tcp:frame];
    
}


/**
 *  移除成员
 *
 */
-(void)UCSDelMember:(UCSDelMemberClass *)aRequest
{
    // 与socket通信
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    
    NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:aRequest.confId, @"confId", aRequest.memberList, @"memberList", nil];
    
//    [frame setVersion:01 seq:0000 cmd:8 sessionId:_sessionId];
  
    [frame setJsonMsg:jsonDict];
    
    [self connect2Tcp:frame];

}


/**
 *  成员静音
 *
 */
- (void)UCSNoneSay:(UCSNoneSayClass *)aRequest
{
    
    // 与socket通信
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    
    NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:aRequest.confId, @"confId", aRequest.callId, @"callId",aRequest.number, @"number", aRequest.Mute, @"Mute", nil];
    
//    [frame setVersion:01 seq:0000 cmd:9 sessionId:_sessionId];
    
    [frame setJsonMsg:jsonDict];
    
    [self connect2Tcp:frame];

    
}


/**
 *  成员禁听
 *
 */
- (void)UCSNoneHear:(UCSNoneHearClass *)aRequest
{
    // 与socket通信
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    
    NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:aRequest.confId, @"confId", aRequest.callId, @"callId",aRequest.number, @"number", aRequest.deaf, @"deaf", nil];
    
//    [frame setVersion:01 seq:0000 cmd:10 sessionId:_sessionId];
  
    [frame setJsonMsg:jsonDict];
    
    [self connect2Tcp:frame];

}


/**
 *  设置角色
 *
 */
- (void)UCSSetRole:(UCSSetRoleClass *)aRequest
{
    // 与socket通信
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    
    NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:aRequest.confId, @"confId", aRequest.callId, @"callId",aRequest.number, @"number", aRequest.role, @"role", nil];
    
//    [frame setVersion:01 seq:0000 cmd:11 sessionId:_sessionId];
  
    [frame setJsonMsg:jsonDict];
    
    [self connect2Tcp:frame];

}


/**
 *  录音
 *
 */
- (void)UCSRecordVoice:(UCSRecordVoiceClass *)aRequest
{
    // 与socket通信
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    
    NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:aRequest.confId, @"confId", aRequest.recordCtr, @"recordCtr", nil];
    
//    [frame setVersion:01 seq:0000 cmd:12 sessionId:_sessionId];
    
    [frame setJsonMsg:jsonDict];
    
    [self connect2Tcp:frame];
    

}



/**
 *  放音
 *
 */
- (void)UCSPlayVoice:(UCSPlayVoiceClass *)aRequest
{
    // 与socket通信
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    
    NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:aRequest.confId, @"confId", aRequest.playCtr, @"playCtr", nil];
    
//    [frame setVersion:01 seq:0000 cmd:13 sessionId:_sessionId];
  
    [frame setJsonMsg:jsonDict];
    
    [self connect2Tcp:frame];
    
}



/**
 *  延长会议
 *
 */
- (void)UCSExtendTime:(UCSExtendTimeClass *)aRequest
{
    
    // 与socket通信
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    
    NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:aRequest.confId, @"confId", aRequest.durationExt, @"durationExt", nil];
    
//    [frame setVersion:01 seq:0000 cmd:14 sessionId:_sessionId];
  
    [frame setJsonMsg:jsonDict];
    
    [self connect2Tcp:frame];
    
}



/**
 *  会议状态同步
 *
 */
- (void)UCSConfStateSyc:(UCSConfStateSycClass *)aRequest
{
    // 与socket通信
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    
    NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:aRequest.confId, @"confId",nil];
    
    [frame setVersion:01 seq:0000 cmd:15 sessionId:00];
    
    [frame setJsonMsg:jsonDict];
    
    [self connect2Tcp:frame];

}


/**
 *  会议信息通知
 *
 */
- (void)UCSConfStateMsg:(UCSConfStateMsgClass *)aRequest
{
    // 与socket通信
}



/**
 *  断线重连
 *
 */

- (void)UCSReLogin
{
    // 与socket通信
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    
    NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:kVersion, @"version", @"0", @"device", kLoginUserId, @"phone",nil];
    
//    [frame setVersion:01 seq:0000 cmd:19 sessionId:_sessionId];
  
    [frame setJsonMsg:jsonDict];
//    
//    if (_sessionId) {
//        
//        [self connect2Tcp:frame];
//        
//    }
  
    
}




/**
 *  会议锁定
 *
 */
- (void)UCSLockConf:(UCSLockConfClass *)aRequest
{
    
    // 与socket通信
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    
    NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:aRequest.confId, @"confId", aRequest.lockCtr, @"lockCtr",nil];
    
//    [frame setVersion:01 seq:0000 cmd:20 sessionId:_sessionId];
    
    [frame setJsonMsg:jsonDict];
    
    [self connect2Tcp:frame];
    
}


/**
 *  全场静音
 *
 */
- (void)UCSMuteAll:(UCSMuteAllClass *)aRequest
{
    
    // 与socket通信
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    
    NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:aRequest.confId, @"confId", aRequest.muteCtr, @"muteCtr",nil];
    
//    [frame setVersion:01 seq:0000 cmd:21 sessionId:_sessionId];
  
    [frame setJsonMsg:jsonDict];
    
    [self connect2Tcp:frame];
    
}


/**
 *  后台同步会议ID
 *
 */
- (void)UCSUpdateConfID:(UCSUpdateConfIDClass *)aRequest {
    UXTCPFrame *frame = [[UXTCPFrame alloc] initWithCode:UX_TCP];
    NSDictionary *jsonDict = [NSDictionary dictionaryWithObjectsAndKeys:aRequest.confId, @"confId", nil];
//    [frame setVersion:01 seq:0000 cmd:101 sessionId:_sessionId];
    [frame setJsonMsg:jsonDict];
    [self connect2Tcp:frame];
}

- (void)connect2Tcp:(UXTCPFrame *)frame
{
  if (![UCSTcpManager instance].isConnected) {
    [[UCSTcpManager instance] connect2TCP:[frame encode]];
  } else {
    [[UCSTcpManager instance] sendMessage:[frame encode]];
  }
}


@end
