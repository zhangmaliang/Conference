/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "CodePush.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "PPGetAddressBook.h"
#import "AlipayModule.h"
#import "SplashScreen.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  

#ifdef DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
  jsCodeLocation = [CodePush bundleURL];
#endif
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Redux_Teleconference"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  
  [[PPAddressBookHandle sharedAddressBookHandle] requestAuthorizationWithSuccessBlock:^{
    // 框架实现有问题，这里不能传入nil
  }];
  
#ifdef DEBUG
#else
  [SplashScreen show];
#endif
  
  
  UITextField *textField = [[UITextField alloc] init];
  [self.window addSubview:textField];
  [textField becomeFirstResponder];
  [textField resignFirstResponder];
  [textField removeFromSuperview];
  
  return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(nonnull NSURL *)url sourceApplication:(nullable NSString *)sourceApplication annotation:(nonnull id)annotation{
  [AlipayModule handleCallback:url];
  return YES;
}

/*
 1、手势侧滑返回问题。这个问题出现在很多APP上，手势侧滑返回到导航栏控制器的rootController后继续侧滑，会导致APP界面假死，没遇见过的可以试试自己开发的应用，解决方案：
 - (void)viewDidAppear:(BOOL)animated {
 [super viewDidAppear:animated];
 //是否需要打开侧滑手势代理
 if (self.navigationController) {
 if (self.navigationController.viewControllers.count == 1 && self.navigationController.viewControllers.firstObject == self) {
 self.navigationController.interactivePopGestureRecognizer.enabled = NO;
 self.navigationController.interactivePopGestureRecognizer.delegate = nil;
 } else {
 if (nil == self.parentViewController || [self.parentViewController isKindOfClass:[UINavigationController class]]) {
 self.navigationController.interactivePopGestureRecognizer.enabled = YES;
 self.navigationController.interactivePopGestureRecognizer.delegate = self;
 }
 }
 }
 }
 2、手势侧滑返回或者点击左上角按钮返回前一页面时，没有及时取消网络请求，导致不必要的消耗，你可以在这里写主动取消网络请求的代码：
 - (void)didMoveToParentViewController:(UIViewController *)parent {
 [super didMoveToParentViewController:parent];
 if (parent == nil) {
 //拿到网络请求对象，调用cancel，不同的三方网络请求框架可能调用方法不一，具体怎么实施，自行思索
 }
 }
 3、网络图片在异步请求回来后，显示的方式直接从placeHolder变成了要显示的图片，比较突兀，你可以这样操作（效果例子是渐变显示出来）：
 @implementation UIImageView (LPPZWebImageView)
 - (void)jf_setImageWithURL:(nullable NSURL *)url
 placeholderImage:(nullable UIImage *)placeholder
 options:(LPPZWebImageOptions)options
 completed:(nullable LPPZExternalCompletionBlock)completedBlock {
 //针对SDWebImage的二次封装
 self.contentMode = UIViewContentModeScaleAspectFill;
 self.clipsToBounds = YES;
 __weak __typeof(self)weakSelf = self;
 [self sd_setImageWithURL:url placeholderImage:placeholder options:(NSUInteger)options completed:^(UIImage * _Nullable image, NSError * _Nullable error, SDImageCacheType cacheType, NSURL * _Nullable imageURL) {
 if (cacheType == SDImageCacheTypeNone) {
 //首次从网络下载过来添加渐变效果
 CATransition *animation = [CATransition animation];
 animation.duration = .3f;
 animation.type = kCATransitionFade;
 animation.removedOnCompletion = YES;
 [weakSelf.layer addAnimation:animation forKey:@"transition"];
 }
 if (completedBlock) {
 completedBlock(image,error,(NSInteger)cacheType,imageURL);
 }
 }];
 }
 @end
 */

@end
