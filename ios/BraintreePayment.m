//
//  BraintreePayment.m
//  Skjutsgruppen
//
//  Created by Biju Nakarmi on 5/8/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import "BraintreePayment.h"

#import "BraintreeCore.h"
#import "BraintreeDropIn.h"

@interface BraintreePayment()

@property NSString * token;

@end

@implementation BraintreePayment

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(setToken: (NSString *) clientToken){
  _token = clientToken;
}

RCT_EXPORT_METHOD(showPayment:(RCTResponseSenderBlock)callback)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    BTDropInRequest *request = [[BTDropInRequest alloc] init];
    BTDropInController *dropIn = [[BTDropInController alloc] initWithAuthorization:_token request:request handler:^(BTDropInController * _Nonnull controller, BTDropInResult * _Nullable result, NSError * _Nullable error) {
      [self.reactRoot dismissViewControllerAnimated:YES completion:nil];

      if (error != nil) {
        NSLog(@"braintreePayment: ERROR: %@", error);
              callback(@[error, [NSNull null]]);
      } else if (result.cancelled) {
        NSLog(@"braintreePayment: CANCELLED");
//              callback(@[[NSNull null], @"cancelled"]);
        
      } else {
        // Use the BTDropInResult properties to update your UI
        // result.paymentOptionType
        // result.paymentMethod
        // result.paymentIcon
        // result.paymentDescription
        NSLog(@"braintreePayment: SUCCESS: %@", result.paymentMethod.nonce);
              callback(@[[NSNull null], result.paymentMethod.nonce, ]);
        
      }
    }];
    //  UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:dropIn];
    self.reactRoot = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    [self.reactRoot presentViewController:dropIn animated:YES completion:nil];
  });
}

- (void)showDropIn:(NSString *)clientTokenOrTokenizationKey {
  BTDropInRequest *request = [[BTDropInRequest alloc] init];
  BTDropInController *dropIn = [[BTDropInController alloc] initWithAuthorization:_token request:request handler:^(BTDropInController * _Nonnull controller, BTDropInResult * _Nullable result, NSError * _Nullable error) {
    
    if (error != nil) {
      NSLog(@"braintreePayment: ERROR: %@", error);
//      callback(@[[NSNull null], error]);
    } else if (result.cancelled) {
      NSLog(@"braintreePayment: CANCELLED");
//      callback(@[[NSNull null], @"cancelled"]);
      
    } else {
      // Use the BTDropInResult properties to update your UI
      // result.paymentOptionType
      // result.paymentMethod
      // result.paymentIcon
      // result.paymentDescription
      NSLog(@"braintreePayment: SUCCESS: %@", result);
//      callback(@[[NSNull null], result]);
      
    }
  }];
  //  UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:dropIn];
  self.reactRoot = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
  [self.reactRoot presentViewController:dropIn animated:YES completion:nil];
}



@end
