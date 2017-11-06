//
//  UCSProctocol.h
//  UCS_Conference_Demo
//
//  Created by 陈怀远 on 15/9/29.
//  Copyright © 2015年 Kohler. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "UCSProtocolClass.h"
#import <React/RCTBridgeModule.h>

typedef struct tagBodyHead_t
{
    int Ret;
    unsigned int Uin;
    unsigned short CmdId;
    int ServerIdLen;
    unsigned char * ServerId;
    unsigned char DeviceId[16];
    short CompressVersion;
    short CompressAlgorithm;
    short CryptAlgorithm;
    unsigned int CompressLen;
    unsigned int CompressedLen;
    //unsigned int CertVersion;
}BodyHead_t;

struct PackageHeader
{
    unsigned short packageLength;
    unsigned short headerLength;
    unsigned short version;
    unsigned int seq;
    unsigned short cmd;
    unsigned short extra;
    
    
} ;

@interface UCSProctocol : NSObject<RCTBridgeModule>




/**
 *  登录请求
 *
 *  @param aRequest aRequest description
 *
 *  @return return value description
 */
-(void)UCSAuthRequest:(UCSAuthRequestClass *)aRequest;

/**
 *  登录响应
 *
 *  @param revData revData description
 *
 *  @return return value description
 */
-(UCSAuthResponseClass *)UCSAuthResponse:(NSData *)revData;


/**
 *  发起会议
 *
 */
-(void)UCSConfRequest:(UCSConfRequestClass *)aRequest;


/**
 *  解散会议
 *
 */
-(void)UCSDismissConf:(UCSDismissConfClass *)aRequest;


/**
 *  邀请加入
 *
 */
-(void)UCSInviteMember:(UCSInviteMemberClass *)aRequest;


/**
 *  移除成员
 *
 */
-(void)UCSDelMember:(UCSDelMemberClass *)aRequest;


/**
 *  成员静音
 *
 */
- (void)UCSNoneSay:(UCSNoneSayClass *)aRequest;


/**
 *  成员禁听
 *
 */
- (void)UCSNoneHear:(UCSNoneHearClass *)aRequest;


/**
 *  设置角色
 *
 */
- (void)UCSSetRole:(UCSSetRoleClass *)aRequest;


/**
 *  录音
 *
 */
- (void)UCSRecordVoice:(UCSRecordVoiceClass *)aRequest;


/**
 *  放音
 *
 */
- (void)UCSPlayVoice:(UCSPlayVoiceClass *)aRequest;


/**
 *  延长会议
 *
 */
- (void)UCSExtendTime:(UCSExtendTimeClass *)aRequest;


/**
 *  会议状态同步
 *
 */
- (void)UCSConfStateSyc:(UCSConfStateSycClass *)aRequest;


/**
 *  会议信息通知
 *
 */
- (void)UCSConfStateMsg:(UCSConfStateMsgClass *)aRequest;


/**
 *  发送验证码
 *
 */
- (void)UCSSecurityCode:(UCSSecurityCodeClass *)aRequest;


/**
 *  断线重连
 *
 */

- (void)UCSReLogin;


/**
 *  会议锁定
 *
 */
- (void)UCSLockConf:(UCSLockConfClass *)aRequest;


/**
 *  全场静音
 *
 */
- (void)UCSMuteAll:(UCSMuteAllClass *)aRequest;


/**
 *  后台同步会议ID
 *
 */
- (void)UCSUpdateConfID:(UCSUpdateConfIDClass *)aRequest;


@end


