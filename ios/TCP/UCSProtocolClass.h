//
//  UCSProtocolClass.h
//  UCS_Conference_Demo
//
//  Created by 陈怀远 on 15/9/29.
//  Copyright © 2015年 Kohler. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface UCSProtocolClass : NSObject

@end

// AS会议记录库
@interface UCSConfListClass : NSObject
@property (nonatomic, strong) NSString *ID;  // 自增状态
@property (nonatomic, strong) NSString *creat_user;  // 创建者
@property (nonatomic, strong) NSString *confId;  // 会议ID
@property (nonatomic, strong) NSString *create_time;  // 创建时间
@property (nonatomic, assign) int duration;  // 创建时长
@property (nonatomic, strong) NSString *playTone;  // 是否播放提示音: 0:不播放;1:播放
@property (nonatomic, strong) NSArray *numberList;  // 创建时成员列表Json数组:{[jnickname（名称）、number（号码）、role（角色）],…}
@property (nonatomic, assign) int state;  // 会议状态：0: 未开始；1：进行中；2：已结束; 默认0
@property (nonatomic, strong) NSString *remark;  // 备注信息
@end


// 1. 登陆请求(AuthRequest)
@interface UCSAuthRequestClass : NSObject
@property (nonatomic, strong) NSString *phone;  // 登录号码
@property (nonatomic, strong) NSString *password;  // 密码（目前没有传）
@property (nonatomic, strong) NSString *veryfyCode;  // 短信验证码
@property (nonatomic, strong) NSString *smsId;  // 短信ID，在短信发送通知中返回
@end


// 2. 登陆状态(AuthResponse)
@interface UCSAuthResponseClass : NSObject
@property (nonatomic, strong) NSString *status;  // 0: 登录成功;  1：登录失败
@property (nonatomic, strong) NSString *desc;  // 登录失败描述
@property (nonatomic, strong) NSString *expire_time;  // 过期时间
@property (nonatomic, strong) NSString *last_login_time;  // 最后一次登录时间
@end


// 3. 发起会议
@interface UCSConfRequestClass : NSObject
@property (nonatomic, assign) NSInteger confGroupID;  // 会议组ID
@property (nonatomic, strong) NSString *creatorPhone; // 创建会议号码
@property (nonatomic, strong) NSString *confTopic;    // 会议主题
@property (nonatomic, strong) NSString *maxMember;    // 会议最大成员数
@property (nonatomic, assign) NSInteger duration;     // 时长
@property (nonatomic, assign) NSInteger playTone;     // 是否播放提示音
@property (nonatomic, strong) NSString *memberList;   // Json数组:{[jnickname（名称）、number（号码）、role（角色）],…}
@property (nonatomic, strong) NSString *showNumber;
@end

// 4. 会议状态
@interface UCSConfResponeClass : NSObject
@property (nonatomic, strong) NSString *confId;  // 会议ID
@property (nonatomic, strong) NSString *state;  // 1:创建中；2：创建成功；3：会议开始放音；4： 会议停止放音；5：会议开始录音；5：会议结束录音；6：会议时间延长.
@property (nonatomic, strong) NSString *desc;  // 附件描述信息,JSON格式
@end


// 5. 成员状态
@interface UCSMemberStateClass : NSObject
@property (nonatomic, strong) NSString *confId;  // 会议ID
@property (nonatomic, strong) NSString *memberList;  // 与会者号码列表: {[ number（号码）、callId(分配的callId,后续携带该CallId进行成员控制,邀请成功后才存在)],…}
@property (nonatomic, strong) NSString *state;  // 1：邀请中；2:邀请失败; 3：加入会议; 4:移除中；5：移除失败;6: 离开会议; 7:静音;8:静音取消；9:禁听;10:禁听取消
@end


// 6. 解散会议
@interface UCSDismissConfClass : NSObject
@property (nonatomic, strong) NSString *confId;  // 会议ID
@end


// 7. 邀请加入
@interface UCSInviteMemberClass : NSObject
@property (nonatomic, strong) NSString *confId;  // 会议ID
@property (nonatomic, strong) NSString *memberList;  // Json数组:{[jnickname（名称）、number（号码）、role（角色）],…}
@end


// 8. 移除成员
@interface UCSDelMemberClass : NSObject
@property (nonatomic, strong) NSString *confId;  // 会议ID
@property (nonatomic, strong) NSString *memberList;  // Json数组:{[jnickname（名称）、number（号码）、role（角色）],…}
@end


// 9. 成员静音
@interface UCSNoneSayClass : NSObject
@property (nonatomic, strong) NSString *confId;  // 会议ID
@property (nonatomic, strong) NSString *callId;  // Json数组:{[jnickname（名称）、number（号码）、role（角色）],…}
@property (nonatomic, strong) NSString *number;  // 成员号码
@property (nonatomic, strong) NSString *Mute;  // 0:取消静音; 1静音
@end


// 10. 成员禁听
@interface UCSNoneHearClass : NSObject
@property (nonatomic, strong) NSString *confId;  // 会议ID
@property (nonatomic, strong) NSString *callId;  // Json数组:{[jnickname（名称）、number（号码）、role（角色）],…}
@property (nonatomic, strong) NSString *number;  // 成员号码
@property (nonatomic, strong) NSString *deaf;  // 0:取消禁听; 1禁听
@end


// 11. 设置角色
@interface UCSSetRoleClass : NSObject
@property (nonatomic, strong) NSString *confId;  // 会议ID
@property (nonatomic, strong) NSString *callId;  // Json数组:{[jnickname（名称）、number（号码）、role（角色）],…}
@property (nonatomic, strong) NSString *number;  // 成员号码
@property (nonatomic, strong) NSString *role;  // 1 来宾; 2主席
@end


// 12. 录音
@interface UCSRecordVoiceClass : NSObject
@property (nonatomic, strong) NSString *confId;  // 会议ID
@property (nonatomic, strong) NSString *recordCtr;  // 1 开始; 2停止
@end


// 13. 放音
@interface UCSPlayVoiceClass : NSObject
@property (nonatomic, strong) NSString *confId;  // 会议ID
@property (nonatomic, strong) NSString *playCtr;  // 1 开始; 2停止
@end


// 14. 会议延时
@interface UCSExtendTimeClass : NSObject
@property (nonatomic, strong) NSString *confId;  // 会议ID
@property (nonatomic, strong) NSString *durationExt;  // 延长的时长，单位分钟,如：30、45
@end


// 15. 会议状态同步
@interface UCSConfStateSycClass : NSObject
@property (nonatomic, strong) NSString *confId;  // 会议Id
@end


// 16. 会议信息通知
@interface UCSConfStateMsgClass : NSObject<NSCoding>
@property (nonatomic, strong) NSString *userId;  // 登录号码
@property (nonatomic, strong) NSString *startTime;  // YYYYMMDD HH:MM:SS
@property (nonatomic, strong) NSString *endTime;  // YYYYMMDD HH:MM:SS
@property (nonatomic, strong) NSString *confPlayState;  // 会议放音状态，1 放音中 2 未放音
@property (nonatomic, strong) NSString *confRecordState;  // 会议录音状态，1 录音中 2 未录音
@property (nonatomic, strong) NSString *confState;
@property (nonatomic, strong) NSString *mediaType;
@property (nonatomic, strong) NSString *confTopic;  // 会议主题
@property (nonatomic, strong) NSString *memberNum;  // 成员数量
@property (nonatomic, strong) NSString *playTone;  // 会议是否播放提示音
@property (nonatomic, strong) NSString *memberList;  // 数组：{[nickname:昵称, number:号码, role:角色, flagMute:静音状态（1静音;2未静音）, flagDeaf：禁听状态（1禁听;2未禁听]}
@property (nonatomic, strong) NSString *confId;
@end

// 17. 短信验证码
@interface UCSSecurityCodeClass : NSObject
@property (nonatomic, strong) NSString *phone;  // 电话号码
@end

// 18. 短信验证码通知
@interface UCSSecurityCodeMsgClass : NSObject
@property (nonatomic, strong) NSString *phone;  // 电话号码
@property (nonatomic, strong) NSString *smsId;  // 密码（预留，当前忽略）
@end




// 19. 重连
@interface UCSReLoginClass : NSObject
@property (nonatomic, strong) NSString *version;  // 电话号码
@property (nonatomic, strong) NSString *device;   // 密码（预留，当前忽略）
@end


// 20. 会议锁定
@interface UCSLockConfClass : NSObject
@property (nonatomic, strong) NSString *confId;   // 会议ID
@property (nonatomic, strong) NSString *lockCtr;  // 1 开始; 2停止
@end



// 21. 全场静音
@interface UCSMuteAllClass : NSObject
@property (nonatomic, strong) NSString *confId;   // 会议ID
@property (nonatomic, strong) NSString *muteCtr;  // 1 开始; 2停止
@end

// 101. 调用时机如下：每次调用获取当前进行中会议接口后，若后台返回有进行中的会议，则获取该会议的confId,然后作为参数调用该接口(后台需要同步数据)
@interface UCSUpdateConfIDClass : NSObject
@property (nonatomic, strong) NSString *confId;  // 会议ID
@end






