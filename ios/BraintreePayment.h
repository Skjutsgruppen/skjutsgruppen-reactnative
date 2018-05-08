//
//  BraintreePayment.h
//  Skjutsgruppen
//
//  Created by Biju Nakarmi on 5/8/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
//#import "RCTBridgeModule.h"
#import "BraintreeCore.h"
#import "BraintreeCard.h"
#import <React/RCTBridgeModule.h>

@interface BraintreePayment :  UIViewController <RCTBridgeModule, BTViewControllerPresentingDelegate>
@property (nonatomic, strong) UIViewController *reactRoot;

@property (nonatomic, strong) RCTResponseSenderBlock callback;

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation;


@end
