//
//  Utilities.m
//  Skjutsgruppen
//
//  Created by Mac on 6/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "Utilities.h"
#import <Firebase.h>



@implementation Utilities
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getUrlFromDynamicLink: (NSURL *) url callback:(RCTResponseSenderBlock)callback)
{
  NSLog(@"firebase dynamic url before converting %@", url);
  [[FIRDynamicLinks dynamicLinks] handleUniversalLink:url
                                           completion:^(FIRDynamicLink * _Nullable dynamicLink,
                                                        NSError * _Nullable error) {
                                             if(error){
                                               NSLog(@"========== error found =======");
                                               callback(@[error, [NSNull null]]);
                                             }else{
                                               NSLog(@"=========== link found =============");
                                             callback(@[[NSNull null], dynamicLink.url.absoluteString]);
                                             }

                                           }];

}

@end
