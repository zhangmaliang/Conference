//
//  TLVparse.h
//  UCS_Conference_Demo
//
//  Created by Kohler'Mac on 15/10/18.
//  Copyright © 2015年 Kohler. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TLV.h"
#import "LPositon.h"

@interface TLVparse : NSObject

@property (nonatomic, strong) NSMutableArray *infoArr;

-(NSArray*) saxUnionField55_2List:(NSString*) hexfiled55;
@end
