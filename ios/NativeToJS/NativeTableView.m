//
//  NativeTableView.m
//  Redux_Teleconference
//
//  Created by zhangmaliang on 2017/8/14.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "NativeTableView.h"
#import "NativeTableViewController.h"

@interface NativeTableView ()

@property (nonatomic, strong) NativeTableViewController *viewController;

@end

@implementation NativeTableView

- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  if (self) {
    [self setUpUI:frame];
  }
  return self;
}

- (void)setUpUI:(CGRect)frame {
  self.viewController = [NativeTableViewController new];
  UIView *myView = self.viewController.view;
  myView.frame = frame;
  [self addSubview:myView];
}

- (void)setDatas:(NSArray *)datas{
  _datas = datas;
  self.viewController.datas = datas;
}

- (BOOL)changeBackgroundColor:(NSString *)color{
  return [self.viewController changeBackgroundColor:color];
}

@end
