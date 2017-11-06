//
//  UCSTcpManager.m
//  UCS_Conference_Demo
//
//  Created by 陈怀远 on 15/9/30.
//  Copyright © 2015年 Kohler. All rights reserved.
//

#import "UCSTcpManager.h"
#import "Reachability.h"
#import <RNFetchBlob.h>

#import <sys/socket.h>
#include <netinet/tcp.h>
#include <netinet/in.h>
#import "TcpCustomLogger.h"
#import "UXTCPFrame.h"


#define SOCKET_TCP_BODY_TAG 2
#define SOCKET_TCP_HEAD_TAG 1
#define SOCKET_TCP_LOGIN    3

#define MAX_TCP_TIME 3           // 超过这个次数，连接下一个
#define MAX_HTTP_TIME 3          // 超过这个次数，获取接入列表
#define MAX_HEARTBEAT_TIME 3     // 超过这个次数，重新连接
#define MAX_DELAY_TIME 30        // 超过这个时间，就不要连接
#define DELAY_TIME  10           // 退火时间
#define HEARTBEAT_DELAY_TIME  20 // 心跳退火时间
#define ID_MSGBOX_PWD_CHANGED       1000
#define MAX_CACHE_FRAME             100

// 只有这两个用到了...
#define HEARTBEAT_TIMER_DELAY  5  ///心跳定时器间隔
#define HEARTBEAT_TIMEOUT      5 ///最大心跳超时






typedef enum
{
    PNT_UNKNOWN = 0,    // 未知,无网络
    PNT_WIFI    = 1,    // WIFI
    PNT_2G      = 2,    // 2G
    PNT_3G      = 3     // 3G
}currentNetType;

@interface UCSTcpManager ()

// 前面这5个没调用
@property double amsHTTPRequestDelay;        /// getcaaddr调用延迟 (s)
@property double tcpConnectDelay;            /// caaddr调用延迟 (s)
@property int    tcpConnectTimes;            /// 某个tcp已连接的次数
@property int    amsHTTPRequestTimes;        /// getcaddr请求次数
@property (nonatomic, retain) NSString *currentServer; /// 当前已连接的 ip


@property int    heartbeatResendTimes;       /// 心跳发送次数
@property long int    idleSeconds;                /// 空闲时间（用于心跳发送）
@property NSMutableArray *sendFrameQueue;    /// 消息发送队列
@property (nonatomic) Reachability *internetUCSTcpReachability;
@property (nonatomic, copy) NSString * connectIp;
@property (nonatomic, strong)UXTCPFrame *heartFream;
@property (nonatomic, strong) NSData *sendData;

@end


static UCSTcpManager *g_instance = nil;

#define NS_INT(x) [NSNumber numberWithInt:(x)]

static void set_tcp_nodelay(UCSTcpAsyncSocket *a) {
    CFSocketRef cfscok = [a getCFSocket];
    CFSocketNativeHandle raw = CFSocketGetNative(cfscok);
    if (raw <= 0) {
        return;
    }
    int enable = 1;
    setsockopt(raw, IPPROTO_TCP, TCP_NODELAY, (void *)&enable, sizeof(enable));
}


@implementation UCSTcpManager
{
    NSMutableData *_recvData;
    NSMutableDictionary *_recvDelegateTable; // 根据流水号，转发收到的消息
    NSMutableDictionary *_registDelegateTable;
    
    // 接入服务器列表
    NSMutableArray *_caaddrArray;
    //    BOOL _isOnline;                         // 是否在线，用于网络状态变化重连
    NSLock *_connectedLock;
    NSTimer *_singalTimer;
}


+ (UCSTcpManager *) instance {
    if (nil == g_instance) {
        g_instance = [[UCSTcpManager alloc] init];
    }
    return g_instance;
}

- (id)init {
    if (self = [super init]) {
        _heartFream = [[UXTCPFrame alloc] initWithCode:UX_TCP_HEART];
        _heartFream.frameHeader = nil;
        
        _recvData = [[NSMutableData alloc] init];
        _sendData = [[NSData alloc] init];
        
        _socket = [[UCSTcpAsyncSocket alloc] initWithDelegate:self];
        _sendFrameQueue = [[NSMutableArray alloc] init];
        _recvDelegateTable = [[NSMutableDictionary alloc] init];
        _registDelegateTable = [[NSMutableDictionary alloc] init];
        _caaddrArray = [[NSMutableArray alloc] init];
        _seqnumber = random();
        _connectedLock = [[NSLock alloc] init];
        self.internetUCSTcpReachability = [Reachability reachabilityForInternetConnection];
        [self.internetUCSTcpReachability startNotifier];
        
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(enterForeground)
                                                     name:UIApplicationWillEnterForegroundNotification
                                                   object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(enterBackground)
                                                     name:UIApplicationDidEnterBackgroundNotification
                                                   object:nil];
    }
    return self;
}

/*!
 *  @brief  获取tcp环境 hostName
 */
- (NSString *)ucsTcpHostName{
    return @"120.76.238.99";       // tcp连接地址;
}

- (void)dealloc {
    
    [self disconnectServer];
     _socket = nil;
    if (_heartbeatTimer) {
        [_heartbeatTimer invalidate], _heartbeatTimer = nil;
    }
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

// 连接成功
- (void)onConnectSuccessfull {
    NSLog(@"SUCCEED");
    self.isClientOnline = YES;
    // 取消心跳
    [self cancelHeartBeatTimer];
    // 开始心跳
    if (_heartbeatTimer) {
        [_heartbeatTimer invalidate], _heartbeatTimer = nil;
    }
    _heartbeatTimer = [NSTimer scheduledTimerWithTimeInterval:HEARTBEAT_TIMER_DELAY target:self selector:@selector(heartbeat) userInfo:nil repeats:YES];
    _idleSeconds = _heartbeatResendTimes = 0;
}

- (void)disconnectServer {
    NSLog(@"%s", __PRETTY_FUNCTION__);
    _connectIp = nil;
    _offlinePushClosed = NO;
    self.isClientOnline = NO;
    
    [self cancelHeartBeatTimer];
    [self cleanSocketDelegateAndDisconnectSocket];
    [self cleanLock];
}

// socket 断开连接
- (BOOL)isConnected {
    return [_socket isConnected];
}

// 发送消息
- (void)sendMessage:(NSData *)sendData {
    [self sendData:sendData];
}

#pragma mark 登录

/*!
 *  @brief   tcp发起连接
 *
 *  @param aData 封装的data
 */
- (BOOL)connect2TCP:(NSData *)aData {
    [[TcpCustomLogger sharedInstance] saveLog:[NSString stringWithFormat:@"%@", NSStringFromSelector(_cmd)]];
    if ([_connectedLock tryLock] == NO) {
        return NO; // 兼容旧方法，防止多次登录
    }
    
    NSString *ucsIP = [self connectIp];
    NSString *ucsPort = @"28000";      // tcp连接端口号
    
    // 如果是重复登陆，不要回调OnDisconnect，以免异常
    [_socket setDelegate:nil];
    [_socket disconnect];
    [_socket setDelegate:self];
    
    NSError *error = nil;

    if (![_socket connectToHost:ucsIP onPort:[ucsPort intValue] withTimeout:-1 error:&error]) { // 握手失败
        // 登陆标志为NO,说明是登陆，不是重连，这时候握手失败，我们直接返回登陆失败
        if (self.isClientOnline == NO) {
        }
        [self cleanLock];
    } else {    // 握手成功，发送数据
        _sendData = aData;
    }
    return YES;
}

- (NSString *)connectIp {
    if (_connectIp == nil) {
        _connectIp = [self ucsTcpHostName];
    }
    return  _connectIp;
}

/*!
 *  @brief  发送数据
 */
- (void)sendData:(NSData *)sendData {

    dispatch_async(dispatch_get_main_queue(), ^(void){
        [_socket writeData:sendData withTimeout:-1 tag:0];
    });
}

#pragma mark - UCSTcpAsyncSocketDelegate

// 发生错误 socket 将要断开连接
- (void)onSocket:(UCSTcpAsyncSocket *)sock willDisconnectWithError:(NSError *)err {
    // 写入日志
    [[TcpCustomLogger sharedInstance] saveLog:[NSString stringWithFormat:@"%@", NSStringFromSelector(_cmd)]];
    
    // 错误处理
    if ([self GetCurrentPhoneNetType] == PNT_UNKNOWN) {
        NSInteger code = 402011;
//        [self TCPConDidFailToCode:code WithDescription:@"网络不可用"];
    } else {
        NSInteger code = 402011;
        //        [self TCPConDidFailToCode:code WithDescription:@"服务器内部错误"];
    }
}

// socket 非错误断开连接时调用
- (void)onSocketDidDisconnect:(UCSTcpAsyncSocket *)sock {
  
    [[TcpCustomLogger sharedInstance] saveLog:[NSString stringWithFormat:@"%@", NSStringFromSelector(_cmd)]];


    [self cleanLock];
    if (self.isClientOnline == NO) {
        _socket.delegate = nil;
    } else {
        // error事件断开,马上重连
        [self reConnect];
    }
}

// socket 连接并准备好读写时调用
- (void)onSocket:(UCSTcpAsyncSocket *)sock didConnectToHost:(NSString *)host port:(UInt16)port {

    // 发送数据
    [self sendData:_sendData];
    [self onConnectSuccessfull];
  
    set_tcp_nodelay(sock);

    //读取消息
    [_socket readDataWithTimeout:-1 tag:0];
    [[TcpCustomLogger sharedInstance] saveLog:[NSString stringWithFormat:@"%@", NSStringFromSelector(_cmd)]];
}

// socket 输入流获取到数据时被调用
- (void)onSocket:(UCSTcpAsyncSocket *)sock didReadData:(NSData *)data withTag:(long)tag {
   
    _heartbeatResendTimes = 0;
    UXTCPFrame *recvFrame = [UXTCPFrame decode:data];
    if(recvFrame == nil) {
        NSLog(@"%@",recvFrame);
    }
    // 获取cmd
    NSString *cmdStr = recvFrame.frameHeader[@"cmd"];
    if (!cmdStr) {
        cmdStr = @"0";
    }
    // 16进制str转10进制int
    int cmd = strtoul([cmdStr UTF8String], 0, 16);
    if(cmd > 0) {
        NSLog(@"cmd = %d",cmd);
    }
    // 101 时不需要发送通知
    if(cmd == 101) {
        // 写在结尾继续监听消息
        [_socket readDataWithTimeout:-1 tag:0];
        return;
    }
    
    NSArray *notificationArr = @[UCHeartNotication, UCLoginRequestNotication, UCLoginResponseNotication, UCCreateConfNotication, UCConfStateNotication, UCMemberStateNotication, UCDismissConfNotication, UCInviteMemberNotication, UCDelMemberNotication, UCNoneSayNotication, UCNoneHearNotication, UCSetRoleNotication, UCRecordVoiceNotication, UCPlayVoiceNotication, UCExtendTimeNotication, UCConfStateSycNotication, UCNConfStateMsgNotication, UCSecurityCodeNotication, UCSecurityCodeMsgNotication, UCReLoginNotication, UCLockConfNotication, UCMuteAllNotication];
    // 接到数据发送通知
    NSDictionary *dict = [[NSDictionary alloc] initWithObjectsAndKeys:recvFrame, @"recvFrame", nil];
    // 创建通知
    NSNotification *notification = [NSNotification notificationWithName:notificationArr[cmd] object:nil userInfo:dict];
    // 通过通知中心发送通知
    [[NSNotificationCenter defaultCenter] postNotification:notification];
    // 写在结尾继续监听消息
     [_socket readDataWithTimeout:-1 tag:0];
}

// socket 完全写入请求的数据时被调用，有错误则不会调用
- (void)onSocket:(UCSTcpAsyncSocket *)sock didWriteDataWithTag:(long)tag {
    
}

// socket 读入数据但未完成读取时调用
- (void)onSocket:(UCSTcpAsyncSocket *)sock didWritePartialDataOfLength:(NSUInteger)partialLength tag:(long)tag {
    
}

/*!
 *  @brief  获取当前的网络的状态
 */
- (currentNetType) GetCurrentPhoneNetType {
    //    return PNT_2G;  // 3G Test
    currentNetType nPhoneNetType = PNT_UNKNOWN;
    if ([[Reachability reachabilityForLocalWiFi] currentReachabilityStatus] != NotReachable) {
        nPhoneNetType = PNT_WIFI;
    } else if ([[Reachability reachabilityForInternetConnection] currentReachabilityStatus] != NotReachable) {
        int n = [[Reachability reachabilityForInternetConnection] currentReachabilityStatus];
        if (n == ReachableVia2G) {
            nPhoneNetType = PNT_2G;
        } else if (n == ReachableVia3G || n == ReachableVia4G || n == ReachableViaLTE) {
            nPhoneNetType = PNT_3G;
        }
    }
    return nPhoneNetType;
}

#pragma mark 心跳包

/*!
 *  @brief  取消心跳
 */
- (void)cancelHeartBeatTimer {
    if (_heartbeatTimer) {
        [_heartbeatTimer invalidate];
        _heartbeatTimer = nil;
    }
}

- (void)heartbeat {
    [[TcpCustomLogger sharedInstance] saveLog:[NSString stringWithFormat:@"%@", NSStringFromSelector(_cmd)]];
    if (![self isConnected]) {
 
        [self connect2TCP:[_heartFream heartEncode]];
    } else {
        if ((time(NULL) - _idleSeconds) < HEARTBEAT_TIMEOUT) {
            return;
        }
        _idleSeconds = (int)time(NULL);
        [self sendData:[_heartFream heartEncode]];
    }
}

#pragma mark 前后台切换
- (void)enterBackground {
    
    [[TcpCustomLogger sharedInstance] saveLog:[NSString stringWithFormat:@"%@", NSStringFromSelector(_cmd)]];

    if (self.isClientOnline) {  // 已登录且在线退至后台才发心跳包 add by baige 2015年01月30日
        [self heartbeat];
        // setKeepAliveTimeout : 注册一个周期性执行的任务
        [[UIApplication sharedApplication] setKeepAliveTimeout:600 handler:^{
            [self heartbeat];
        }];
    }
}

- (void)enterForeground {
    [[TcpCustomLogger sharedInstance] saveLog:[NSString stringWithFormat:@"%@", NSStringFromSelector(_cmd)]];
 
    
    [[UIApplication sharedApplication] clearKeepAliveTimeout];
    if (self.isClientOnline) { // 已登录且在线 才发心跳包 add by baige 2015年01月30日
        if (![self isConnected]) {
         
            if ([_connectedLock tryLock] == NO) {
                [self cleanLock];
            }
        } else {
            _idleSeconds = 0;
            [self heartbeat];
        }
    }
}

#pragma mark - 重连
/*!
 *  @author barry, 15-10-09 11:10:46
 *
 *  @brief  重连
 */
- (void)reConnect {
    
    [[TcpCustomLogger sharedInstance] saveLog:[NSString stringWithFormat:@"%@", NSStringFromSelector(_cmd)]];
    // 清除锁、清除socket并断开连接
    [self cleanLock];
    [self cleanSocketDelegateAndDisconnectSocket];
    // 有网络状态下进行重连
    if ([self.internetUCSTcpReachability currentReachabilityStatus] != NotReachable) {
        // 重连
        [self connect2TCP:[_heartFream heartEncode]];
    } else {

    }
}

/*!
 *  @author barry, 15-10-09 12:10:23
 *
 *  @brief  清除锁
 */
- (void)cleanLock{
    [_connectedLock tryLock];
    [_connectedLock unlock];
}

/*!
 *  @author barry, 15-10-09 12:10:02
 *
 *  @brief  清除socket的代理并断开socket连接
 */
- (void)cleanSocketDelegateAndDisconnectSocket{
    [_socket setDelegate:nil];
    [_socket disconnect];
}



@end




























