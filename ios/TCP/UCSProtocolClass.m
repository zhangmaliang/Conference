//
//  UCSProtocolClass.m
//  UCS_Conference_Demo
//
//  Created by 陈怀远 on 15/9/29.
//  Copyright © 2015年 Kohler. All rights reserved.
//

#import "UCSProtocolClass.h"
#import <objc/runtime.h>



#define UCSDescription  \
- (NSString *)description\
{\
NSString *result = @"";\
NSArray *proNames = [self getAllProperties];\
for (int i = 0; i < proNames.count; i++) {\
NSString *proName = [proNames objectAtIndex:i];\
id  proValue = [self valueForKey:proName];\
result = [result stringByAppendingFormat:@"%@:%@\n",proName,proValue];\
}\
return result;\
}\
\
- (NSArray *)getAllProperties\
{\
u_int count;\
objc_property_t *properties  =class_copyPropertyList([self class], &count);\
NSMutableArray *propertiesArray = [NSMutableArray arrayWithCapacity:count];\
for (int i = 0; i<count; i++)\
{\
const char* propertyName =property_getName(properties[i]);\
[propertiesArray addObject: [NSString stringWithUTF8String: propertyName]];\
}\
free(properties);\
return propertiesArray;\
}



#define BaseRequestInit \
- (instancetype)init{\
self = [super init];\
if (self) {\
_tBaseRequest = [[UCSBaseRequestClass alloc] init];\
}\
return self;\
}


#define BaseResponseInit  \
- (instancetype)init{\
self = [super init];\
if (self) {\
_tBaseResponse = [[UCSBaseResponseClass alloc] init];\
}\
return self;\
}

@implementation UCSProtocolClass

@end


////0.   登陆请求(AuthRequest)
//@implementation UCSAuthRequestClass
//UCSDescription
//BaseRequestInit
//@end


// 1. 登陆请求(AuthRequest)
@implementation UCSAuthRequestClass

@end


// 2. 登陆状态(AuthResponse)
@implementation UCSAuthResponseClass

@end


// 3. 发起会议
@implementation UCSConfRequestClass

@end

// 4. 会议状态
@implementation UCSConfResponeClass

@end


// 5. 成员状态
@implementation UCSMemberStateClass

@end


// 6. 解散会议
@implementation UCSDismissConfClass

@end


// 7. 邀请加入
@implementation UCSInviteMemberClass

@end


// 8. 移除成员
@implementation UCSDelMemberClass

@end


// 9. 成员静音
@implementation UCSNoneSayClass

@end


// 10. 成员禁听
@implementation UCSNoneHearClass

@end


// 11. 设置角色
@implementation UCSSetRoleClass

@end


// 12. 录音
@implementation UCSRecordVoiceClass

@end


// 13. 放音
@implementation UCSPlayVoiceClass

@end


// 14. 会议延时
@implementation UCSExtendTimeClass

@end


// 15. 会议状态同步
@implementation UCSConfStateSycClass

@end


// 16. 会议信息通知
@implementation UCSConfStateMsgClass

- (void)setValue:(id)value forUndefinedKey:(NSString *)key
{
    
}


- (id) initWithCoder: (NSCoder *)coder
{
    if (self = [super init])
    {
        self.userId = [coder decodeObjectForKey:@"userId"];
        self.startTime = [coder decodeObjectForKey:@"startTime"];
        self.endTime = [coder decodeObjectForKey:@"endTime"];
        self.confPlayState = [coder decodeObjectForKey:@"confPlayState"];
        self.confRecordState = [coder decodeObjectForKey:@"confRecordState"];
        self.confState = [coder decodeObjectForKey:@"confState"];
        self.mediaType = [coder decodeObjectForKey:@"mediaType"];
        self.confTopic = [coder decodeObjectForKey:@"confTopic"];
        self.memberNum = [coder decodeObjectForKey:@"memberNum"];
        self.playTone = [coder decodeObjectForKey:@"playTone"];
        self.memberList = [coder decodeObjectForKey:@"memberList"];
        self.confId = [coder decodeObjectForKey:@"confId"];
        
    }
    
    return self;
}
- (void) encodeWithCoder: (NSCoder *)coder
{
    [coder encodeObject:_userId forKey:@"userId"];
    [coder encodeObject:_startTime forKey:@"startTime"];
    [coder encodeObject:_endTime forKey:@"endTime"];
    [coder encodeObject:_confPlayState forKey:@"confPlayState"];
    [coder encodeObject:_confRecordState forKey:@"confRecordState"];
    [coder encodeObject:_confState forKey:@"confState"];
    [coder encodeObject:_mediaType forKey:@"mediaType"];
    [coder encodeObject:_confTopic forKey:@"confTopic"];
    [coder encodeObject:_memberNum forKey:@"memberNum"];
    [coder encodeObject:_playTone forKey:@"playTone"];
    [coder encodeObject:_memberList forKey:@"memberList"];
    [coder encodeObject:_confId forKey:@"confId"];
    
}

@end



// 17. 短信验证码
@implementation UCSSecurityCodeClass

@end

// 18. 短信验证码通知
@implementation UCSSecurityCodeMsgClass

@end

// 19. 重连
@implementation UCSReLoginClass
@end


// 20. 会议锁定
@implementation UCSLockConfClass

@end


// 21. 全场静音
@implementation UCSMuteAllClass

@end

// 101接口
@implementation UCSUpdateConfIDClass

@end



