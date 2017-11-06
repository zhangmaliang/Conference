//
//  NativeTableViewController.m
//  Redux_Teleconference
//
//  Created by zhangmaliang on 2017/8/14.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "NativeTableViewController.h"
#import "RativeTOJSEventEmitter.h"

@interface NativeTableViewController()
@property (nonatomic,assign) BOOL changeBGColor;
@end

@implementation NativeTableViewController

- (void)viewDidLoad {
  [super viewDidLoad];

}

- (void)setDatas:(NSArray *)datas{
  _datas = datas;
  [self.tableView reloadData];
}

- (BOOL)changeBackgroundColor:(NSString *)color{

  self.changeBGColor = !self.changeBGColor;
  [self.tableView reloadData];
  
  return YES;
}

#pragma mark - Table view data source

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
  return self.datas.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
  UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell"];
  if(!cell){
    cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:@"cell"];
  }
  id data = self.datas[indexPath.row];
  cell.textLabel.text = data[@"title"];
  cell.detailTextLabel.text = data[@"content"];
  cell.contentView.backgroundColor = self.changeBGColor ? [UIColor redColor] : [UIColor whiteColor];
  return cell;
}

- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath {
    if (editingStyle == UITableViewCellEditingStyleDelete) {
    
    [RativeTOJSEventEmitter emit:TableDeleteRowEvent index:indexPath.row];
  }
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
  [tableView deselectRowAtIndexPath:indexPath animated:YES];
  
  [RativeTOJSEventEmitter emit:TableRowClickedEvent index:indexPath.row];
}

@end
