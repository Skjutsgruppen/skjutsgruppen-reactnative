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
@property NSString * amount;


@end

@implementation BraintreePayment

- (instancetype)init
{
  if (self = [super init]) {
    self.amount = @"0";
  }
  
  return self;
}

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(setToken: (NSString *) clientToken){
  _token = clientToken;
}

RCT_EXPORT_METHOD(setAmount: (NSString *) amount){
  NSLog(@"setamount: %@", amount);
  _amount = amount;
}

RCT_EXPORT_METHOD(showPayment:(RCTResponseSenderBlock)callback)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    self.callback = callback;

    BTDropInRequest *request = [[BTDropInRequest alloc] init];
    self.braintreeClient = [[BTAPIClient alloc] initWithAuthorization:_token	];
    self.paymentRequest = [[PKPaymentRequest alloc] init];
    self.paymentRequest.merchantIdentifier = @"merchant.skjutsgruppen.sandbox";
    self.paymentRequest.merchantCapabilities = PKMerchantCapability3DS;
    self.paymentRequest.countryCode = @"SE";
    self.paymentRequest.currencyCode = @"SEK";
    self.paymentRequest.supportedNetworks = @[PKPaymentNetworkAmex, PKPaymentNetworkVisa, PKPaymentNetworkMasterCard, PKPaymentNetworkDiscover, PKPaymentNetworkChinaUnionPay];
    self.paymentRequest.paymentSummaryItems =
    @[
      [PKPaymentSummaryItem summaryItemWithLabel:@"Skjutsgruppen" amount:[NSDecimalNumber decimalNumberWithString:_amount]]
      ];

    self.viewController = [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest: self.paymentRequest];
    NSLog(@"viewCotroller before %@", self.viewController);
    self.viewController.delegate = self;
    
    BTDropInController *dropIn = [[BTDropInController alloc] initWithAuthorization:_token request:request handler:^(BTDropInController * _Nonnull controller, BTDropInResult * _Nullable result, NSError * _Nullable error) {
      [self.reactRoot dismissViewControllerAnimated:YES completion:nil];

      if (error != nil) {
        NSLog(@"braintreePayment: ERROR: %@", error);
              callback(@[error, [NSNull null]]);
      } else if (result.cancelled) {
        NSLog(@"braintreePayment: CANCELLED");
      } else {
        if(result.paymentMethod == nil && result.paymentOptionType == 16){ //Apple Pay
          NSLog(@"viewCotroller after %@", self.viewController);
          if(self.viewController ==nil){
            callback(@[@"error ", [NSNull null]]);
            return;
          }
          [self.reactRoot presentViewController:self.viewController animated:YES completion:nil];
        } else{
              callback(@[[NSNull null], result.paymentMethod.nonce, ]);
        }
        
      }
    }];
    self.reactRoot = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    [self.reactRoot presentViewController:dropIn animated:YES completion:nil];
  });
}

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                completion:(void (^)(PKPaymentAuthorizationStatus))completion


{
  
  
  // Example: Tokenize the Apple Pay payment
  BTApplePayClient *applePayClient = [[BTApplePayClient alloc]
                                      initWithAPIClient:self.braintreeClient];
  [applePayClient tokenizeApplePayPayment:payment
                               completion:^(BTApplePayCardNonce *tokenizedApplePayPayment,
                                            NSError *error) {
                                 if (tokenizedApplePayPayment) {
                                   // On success, send nonce to your server for processing.
                                   // If applicable, address information is accessible in `payment`.
                                   // NSLog(@"description = %@", tokenizedApplePayPayment.localizedDescription);
                                   
                                   completion(PKPaymentAuthorizationStatusSuccess);
                                   
                                   
//                                   NSMutableDictionary* result = [NSMutableDictionary new];
//                                   [result setObject:tokenizedApplePayPayment.nonce forKey:@"nonce"];
//                                   [result setObject:@"Apple Pay" forKey:@"type"];
//                                   [result setObject:[NSString stringWithFormat: @"%@ %@", @"", tokenizedApplePayPayment.type] forKey:@"description"];
//                                   [result setObject:[NSNumber numberWithBool:false] forKey:@"isDefault"];
//
                                   self.callback(@[[NSNull null], tokenizedApplePayPayment.nonce]);
                                   
                                 } else {
                                   // Tokenization failed. Check `error` for the cause of the failure.
                                   
                                   // Indicate failure via the completion callback:
                                   completion(PKPaymentAuthorizationStatusFailure);
                                 }
                               }];
}

- (void)paymentAuthorizationViewControllerDidFinish:(PKPaymentAuthorizationViewController *)controller{
  [self.reactRoot dismissViewControllerAnimated:YES completion:nil];
}

@end
