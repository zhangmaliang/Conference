//
//  UXTCPFrame.m
//  UCS_Conference_Demo
//
//  Created by 陈怀远 on 15/10/12.
//  Copyright © 2015年 Kohler. All rights reserved.
//

#import "UXTCPFrame.h"
#import "BSONCodec.h"
#include "stdio.h"
#include "stdlib.h"
#import "TLVparse.h"
#import "NSObject+SBJSON.h"

int TcpFrameLen(UXTCPFrameHead head)
{
    return head.headerLen + head.msgLen + sizeof(head);
}


@implementation UXTCPFrame
{
    NSMutableDictionary *_frameHeader;
    NSData *_msg;
    UXTCPFrameHead _tcp_head;
}

@synthesize frameHeader = _frameHeader;
@synthesize msg = _msg;

//static void short2Byte(short a, Byte b[], int offset){
//    b[offset] = (Byte) (a >> 8);
//    b[offset+1] = (Byte) (a);
//}
- (NSData *)heartEncode
{
    NSMutableData *contentsData = [[NSMutableData alloc] init];
    NSData *head = contentsData;
    _tcp_head.headerLen = [head length];
    _tcp_head.msgLen = [_msg length];
    
    UXTCPFrameHead tcp_head;
    tcp_head.headerLen = htons(_tcp_head.headerLen);
    tcp_head.msgLen = htons(_tcp_head.msgLen);
    
    UInt8 *buf = (UInt8 *)malloc(TcpFrameLen(_tcp_head));
    memcpy(buf, &tcp_head, sizeof(tcp_head));
    if (_tcp_head.headerLen) {
        [head getBytes:buf+sizeof(tcp_head) length:_tcp_head.headerLen];
    }
    if (_tcp_head.msgLen) {
        [_msg getBytes:buf+sizeof(tcp_head)+_tcp_head.headerLen length:_tcp_head.msgLen];
    }
    NSData *d = [[NSData alloc] initWithBytes:buf length:TcpFrameLen(_tcp_head)];
    free(buf);
    return d;

}

// TLV 协议
- (NSData *)encode {
    
    NSString *versionStr = [_frameHeader objectForKey:@"version"];     // 版本号
    NSString *seqStr = [_frameHeader objectForKey:@"seq"];             // 流水号
    NSString *cmdStr = [_frameHeader objectForKey:@"cmd"];             // 信息类型
    NSString *sessionIdStr = [_frameHeader objectForKey:@"sessionId"]; // 验证码ID
    NSMutableData *contentsData = [[NSMutableData alloc] init];
    
    // '\x01' 存储了一个数据的字符串，可以找到对应的ASCII码
    // 组装版本号tlv
    short version = versionStr.intValue;
    Byte versionT[] = {(Byte)1};    // '\x01'
    Byte versionL[] = {(Byte)2};
    Byte versionV[] = {(Byte)0, (Byte)version};
    
    // 组装消息流水号tlv
    int seq = seqStr.intValue;
    Byte seqT[] = {(Byte)2};
    Byte seqL[] = {(Byte)4};
    Byte seqV[] = {(Byte)0, (Byte)0, (Byte)0, (Byte)seq};
    
    // 组装消息类型tlv
    short cmd = cmdStr.intValue;
    Byte cmdT[] = {(Byte)3};
    Byte cmdL[] = {(Byte)2};
    Byte cmdV[] = {(Byte)0, (Byte)cmd};
    
    // 打包TLV数组
    // 拿到对应数组中的对应个数据进行拼接
    [contentsData appendBytes:&versionT length:1];
    [contentsData appendBytes:&versionL length:1];
    [contentsData appendBytes:&versionV length:2];
    
    [contentsData appendBytes:&seqT length:1];
    [contentsData appendBytes:&seqL length:1];
    [contentsData appendBytes:&seqV length:4];
    
    [contentsData appendBytes:cmdT length:1];
    [contentsData appendBytes:cmdL length:1];
    [contentsData appendBytes:cmdV length:2];
    
    short sessionId = sessionIdStr.intValue;
    if (sessionId > 0) {
        // 组装会话ID的tlv
        Byte sessionIdT[] = {(Byte)4};
        Byte sessionIdL[] = {(Byte)2};
        Byte sessionIdV[] = {(Byte)0, (Byte)sessionId};
        
        [contentsData appendBytes:sessionIdT length:1];
        [contentsData appendBytes:sessionIdL length:1];
        [contentsData appendBytes:sessionIdV length:2];
    }

    // 打包整体包(报文头长度，包体长度，报文头TLV，包体)
    NSData *head = contentsData;
    _tcp_head.headerLen = [head length];
    _tcp_head.msgLen = [_msg length];
    
    // htonsg函数 : 将主机字节顺序转换为网络字节顺序
    UXTCPFrameHead tcp_head;
    tcp_head.headerLen = htons(_tcp_head.headerLen);
    tcp_head.msgLen = htons(_tcp_head.msgLen);
    
    UInt8 *buf = (UInt8 *)malloc(TcpFrameLen(_tcp_head));
    // memcpy : 内容拷贝函数
    memcpy(buf, &tcp_head, sizeof(tcp_head));
    if (_tcp_head.headerLen) {
        [head getBytes:buf+sizeof(tcp_head) length:_tcp_head.headerLen];
    }
    if (_tcp_head.msgLen) {
        [_msg getBytes:buf+sizeof(tcp_head)+_tcp_head.headerLen length:_tcp_head.msgLen];
    }
    NSData *d = [[NSData alloc] initWithBytes:buf length:TcpFrameLen(_tcp_head)];
    // 释放内存
    free(buf);
    return d;
}

// 解码
+ (UXTCPFrame *)decode:(NSData *)data {
    UXTCPFrame* frame = nil;
    if( data && [data length] >= 4 ) {
        int nFrameLen = [UXTCPFrame frameLength:data];
        if( nFrameLen > 0 && [data length] >= nFrameLen ) {
            // malloc 分配内存空间
            char *buffer = malloc(nFrameLen);
            frame = [[UXTCPFrame alloc] initWithCode:UX_TCP_LOGINRESPONSE];
            [data getBytes:(void *)buffer length:nFrameLen];
            
            UXTCPFrameHead head;
            memcpy(&head, buffer, sizeof(head));
            // ntohs函数 : 将一个16位数由网络字节顺序转换为主机字节顺序
            head.headerLen = ntohs(head.headerLen);
            head.msgLen = ntohs(head.msgLen);
            
            @try {
                NSData *newHeadData = [[NSData alloc] initWithBytes:buffer + sizeof(head) length:head.headerLen];
                // 放置TLV
                TLVparse *s = [[TLVparse alloc] init];
                NSMutableString *hexString = [NSMutableString string];
                Byte *dataByte = [newHeadData bytes];
                for (int i = 0; i < [newHeadData length]; i++) {
                    [hexString appendFormat:@"%02x", dataByte[i]];
                }
                NSArray *tlvArr = [s saxUnionField55_2List:hexString];
                NSArray *frameHeaderArr = @[@"version", @"seq", @"cmd", @"sessionId"];
                
                for (TLV *aTLV in tlvArr) {
                    [frame.frameHeader setObject:aTLV.value forKey:frameHeaderArr[aTLV.tag.intValue - 1]];
                }
                frame.msg = [[NSData alloc] initWithBytes:buffer + sizeof(head) + head.headerLen length:head.msgLen];
                // iKohler
//                NSString *str = [[NSString alloc]initWithData:frame.msg encoding:NSUTF8StringEncoding];
            }
            @catch (NSException *exception) {
                return nil;
            }
            @finally {
                free(buffer);
            }
            
            id sn = nil;
            if ((sn = [frame.frameHeader objectForKey:@"sn"])) {
                frame.seqnumber = [sn intValue];
            }
            frame.tcp_head = head;
        }
    }
    return frame;
}

- (void)setVersion:(int)version seq:(int)seq cmd:(int)cmd sessionId:(int)sessionId
{
    [_frameHeader setObject:[NSString stringWithFormat:@"%d", version] forKey:@"version"];
    [_frameHeader setObject:[NSString stringWithFormat:@"%d", seq] forKey:@"seq"];
    [_frameHeader setObject:[NSString stringWithFormat:@"%d", cmd] forKey:@"cmd"];
    [_frameHeader setObject:[NSString stringWithFormat:@"%d", sessionId] forKey:@"sessionId"];
}
- (void)setVersion:(int)version
{
    [_frameHeader setObject:[NSString stringWithFormat:@"%d", version] forKey:@"version"];
}

-(void)setSeq:(int)seq
{
    [_frameHeader setObject:[NSString stringWithFormat:@"%d", seq] forKey:@"seq"];
}

- (void)setCmd:(int)cmd
{
    [_frameHeader setObject:[NSString stringWithFormat:@"%d", cmd] forKey:@"cmd"];
}

- (void)setSessionId:(int)sessionId
{
    [_frameHeader setObject:[NSString stringWithFormat:@"%d", sessionId] forKey:@"sessionId"];
}

- (void)setJsonMsg:(NSDictionary *)obj
{

    NSString *jsonStr = [obj JSONRepresentation];
    
    NSData *msg = [jsonStr dataUsingEncoding: NSUTF8StringEncoding];
    
    self.msg = msg;
}


+ (int)frameLength:(NSData *)frame
{
    NSAssert(frame, @"No frame");
    UXTCPFrameHead head;
    if ([frame length] < sizeof(head)) {
        return -4;
    }
    memset(&head, 0, sizeof(head));
    [frame getBytes:(void *)&head length:sizeof(head)];
    head.headerLen = ntohs(head.headerLen);
    head.msgLen = ntohs(head.msgLen);
    if (head.headerLen < 0 || head.msgLen < 0) {
        return 0;
    }
    return (head.headerLen + head.msgLen) + sizeof(head);
}


- (id)initWithCode:(UX_TCP_TYPE)tcp_msg
{
    self = [super init];
    _frameHeader = [[NSMutableDictionary alloc] init];
//    [_frameHeader setObject:[NSNumber numberWithInt:tcp_msg] forKey:@"type"];
    //     [_frameHeader setObject:@1 forKey:@"enc"];  //默认支持rc4 加解密 add by kucky 20141203
    return self;
}


- (void)setOp:(int)op
{
    [_frameHeader setObject:[NSNumber numberWithInt:op] forKey:@"op"];
}

- (int)op
{
    id op = nil;
    if ((op = [_frameHeader objectForKey:@"op"])) {
        return [op intValue];
    }
    return -1;
}

-(NSData*) hexToBytes:(NSString *)str{
    NSMutableData* data = [NSMutableData data];
    int idx;
    for (idx = 0; idx+2 <= str.length; idx+=2) {
        NSRange range = NSMakeRange(idx, 2);
        NSString* hexStr = [str substringWithRange:range];
        NSScanner* scanner = [NSScanner scannerWithString:hexStr];
        unsigned int intValue;
        [scanner scanHexInt:&intValue];
        [data appendBytes:&intValue length:1];
    }
    return data;
}

@end
