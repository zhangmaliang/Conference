//
//  TLVparse.m
//  UCS_Conference_Demo
//
//  Created by Kohler'Mac on 15/10/18.
//  Copyright © 2015年 Kohler. All rights reserved.
//

#import "TLVparse.h"

@implementation TLVparse

#pragma mark - 解码
-(NSArray*) saxUnionField55_2List:(NSString*) hexfiled55
{
    self.infoArr = [NSMutableArray array];
    
    if (nil == hexfiled55) {
        
    }
    return [self builderTLV:hexfiled55];
    
//    NSString *headerLen = [hexfiled55 substringWithRange:NSMakeRange(0, 4)];
//    NSString *msgLen = [hexfiled55 substringWithRange:NSMakeRange(4, 4)];
//    NSArray *tlvArr = [self builderTLV:[hexfiled55 substringWithRange:NSMakeRange(8, 36)]];
//    
//    [_infoArr addObject:headerLen];
//    [_infoArr addObject:msgLen];
//    
//    for (TLV *aTLV in tlvArr) {
//    
//        [_infoArr addObjectsFromArray:@[aTLV.tag, [NSString stringWithFormat:@"%ld", aTLV.length], aTLV.value]];
//        
//    }
//    if ([hexfiled55 substringFromIndex:44]) {
//        [_infoArr addObject:[hexfiled55 substringFromIndex: 44]];
//
//    }
//    
//    return _infoArr;
}

-(NSArray*) builderTLV:(NSString *)hexString
{
    NSMutableArray *arr = [[NSMutableArray alloc] initWithCapacity:10];
    int position = 0;
    int count = 4;
//    while (position != hexString.length) {
    while (position != hexString.length) {

        NSString * _hexTag = [self getUnionTag:hexString P:position];
//        NSLog(@"hex tag :%@",_hexTag);
        if ([_hexTag isEqualToString:@"00"] || [_hexTag isEqualToString:@"0000"]) {
            position += _hexTag.length;
            continue;
        }
        position += _hexTag.length;
        LPositon *l_position = [self getUnionLAndPosition:hexString P:position];;
        int _vl = l_position.vl;
//        NSLog(@"value len :%i",_vl);
        position = l_position.position;
        
        NSString* _value = [hexString substringWithRange:NSMakeRange(position, _vl * 2)];
//        NSLog(@"value :%@",_value);
        
        position = position + _value.length;
        TLV *tlv = [[TLV alloc] init];
        tlv.tag = _hexTag;
        tlv.value = _value;
        tlv.length = _vl;
        [arr addObject:tlv];
        
        count--;
    }
    return arr;
}

int ChangeNum(char * str,int length)
{
    char  revstr[128] = {0};  //根据十六进制字符串的长度，这里注意数组不要越界
    int   num[16] = {0};
    int   count = 1;
    int   result = 0;
    strcpy(revstr,str);
    for (int i = length - 1;i >= 0;i--)
    {
        if ((revstr[i] >= '0') && (revstr[i] <= '9')) {
            num[i] = revstr[i] - 48;//字符0的ASCII值为48
        } else if ((revstr[i] >= 'a') && (revstr[i] <= 'f')) {
            num[i] = revstr[i] - 'a' + 10;
        } else if ((revstr[i] >= 'A') && (revstr[i] <= 'F')) {
            num[i] = revstr[i] - 'A' + 10;
        } else {
            num[i] = 0;
        }
        result = result+num[i]*count;
        count = count*16;//十六进制(如果是八进制就在这里乘以8)
    }
    return result;
}

-(LPositon *)getUnionLAndPosition:(NSString *)hexString P:(NSInteger) position
{
    NSString *firstByteString = [hexString substringWithRange:NSMakeRange(position, 2)];
    int i = ChangeNum((char *)[firstByteString UTF8String],2);
    
    NSString * hexLength = @"";
    if (((i >> 7) & 1) == 0) {
        hexLength = [hexString substringWithRange:NSMakeRange(position, 2)];
        position = position + 2;
        
    } else {
        // 当最左侧的bit位为1的时候，取得后7bit的值，
        int _L_Len = i & 127;
        position = position + 2;
        hexLength = [hexString substringWithRange:NSMakeRange(position, _L_Len * 2)];
        // position表示第一个字节，后面的表示有多少个字节来表示后面的Value值
        position = position + _L_Len * 2;
        
    }
    LPositon *LP = [[LPositon alloc] init];
    LP.vl = ChangeNum((char *)[hexLength UTF8String],2);
    LP.position = position;
    return LP;
}

-(NSString*) getUnionTag:(NSString* )hexString P:(NSInteger) position
{
    NSString* firstByte = [hexString substringWithRange:NSMakeRange(position, 2)];
    int i = ChangeNum((char *)[firstByte UTF8String],2);
    if ((i & 0x1f) == 0x1f) {
        return [hexString substringWithRange:NSMakeRange(0, 4)];
    } else {
        return [hexString substringWithRange:NSMakeRange(position, 2)];
    }
}

@end
