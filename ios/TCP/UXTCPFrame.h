//
//  UXTCPFrame.h
//  UCS_Conference_Demo
//
//  Created by 陈怀远 on 15/10/12.
//  Copyright © 2015年 Kohler. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef struct _tagUXTCPFrameHead
{
    UInt16 headerLen;
    UInt16 msgLen;
} UXTCPFrameHead;

typedef enum {
//    UX_TCP_SERVER = 0,     // 客户端-服务端内部消息
//    UX_TCP_INSERVER = 1,   // 服务端-服务端内部消息给服务器的消息
//    UX_TCP_STATUS = 5,     // 状态服务器
//    UX_TCP_CALL = 10,
//    UX_TCP_REALTIME = 11, // 实时消息
//    UX_TCP_PROXY = 12, // 离线消息
//    UX_TCP_BROADCAST = 13,
//    UX_TCP_NOTIFI = 14,
//    UX_TCP_GROUP = 15,
//    UX_TCP_NUL,
    UX_TCP = 0,
    UX_TCP_LOGIN = 1,
    UX_TCP_LOGINRESPONSE = 2,
    UX_TCP_HEART,                // 心跳
    
} UX_TCP_TYPE;

typedef enum {
    UX_TCP_OP_LOGIN = 1,
//    UX_TCP_OP_LOGOUT = 4,
//    UX_TCP_OP_RANDCODE = 5,
//    UX_TCP_OP_KICKOUT = 6,
//    UX_TCP_OP_SERVERHALT = 7,
//    UX_TCP_OP_STATUS = 1,
//    UX_TCP_OP_CALL = 1,
//    UX_TCP_OP_TERMINATECALL = 2,
//    UX_TCP_OP_RESPOSECALL = 3,
} UX_TCP_OP;

@interface UXTCPFrame : NSObject
@property UXTCPFrameHead tcp_head;

@property (nonatomic, retain) NSMutableDictionary *frameHeader;
@property (nonatomic, retain) NSData *msg;


// 序列号。由UXTCPManager在发送时确定
@property int seqnumber;
// 设置发送时是否带上序列号在frameHeader中
@property BOOL sendWithSn;

// 子功能请求码
- (void)setOp:(int)op;
- (int)op;

- (void)setVersion:(int)version
               seq:(int)seq
               cmd:(int)cmd
         sessionId:(int)sessionId;

- (void)setVersion:(int)version;
- (void)setSeq:(int)seq;
- (void)setCmd:(int)cmd;
- (void)setSessionId:(int)sessionId;

- (void)setJsonMsg:(NSDictionary *)obj;

- (id)initWithCode:(UX_TCP_TYPE)tcp_msg;

+ (UXTCPFrame *)decode:(NSData *)data;
- (NSData *)heartEncode;
- (NSData *)encode;
@end
