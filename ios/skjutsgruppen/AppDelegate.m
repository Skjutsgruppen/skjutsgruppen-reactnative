/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant

 * of patent rights can be found in the PATENTS file in the same directory.
 */
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Firebase.h>
#import <React/RCTLinkingManager.h>

#import <ReactNativeConfig/ReactNativeConfig.h>
#import "RNFirebaseMessaging.h"
#import "RNFirebaseNotifications.h"
#import <TwitterKit/TWTRKit.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>

@import GoogleMaps;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [Fabric with:@[[Crashlytics class]]];
  [FIRApp configure];
  [RNFirebaseNotifications configure];
  [GMSServices provideAPIKey:[ReactNativeConfig envFor:@"GOOGLE_MAP_API_KEY"]];
  NSURL *jsCodeLocation;
  // firebase push notification

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Skjutsgruppen"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];

  // return YES;
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                  didFinishLaunchingWithOptions:launchOptions];
}

// Facebook SDK
- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  NSString *myUrl = url.absoluteString;
  NSLog(@"=========================LINKING URL: %@ ",myUrl);
  if ([myUrl containsString:@"web.skjutsgruppen.nu"]) {
   return [RCTLinkingManager application:application openURL:url options:options];
  } else if([myUrl containsString:@"pwm3h.app.goo.gl"]) {
    return [RCTLinkingManager application:application openURL:url options:options];
  } else {
    BOOL fbStatus =  [[FBSDKApplicationDelegate sharedInstance] application:application
                                                          openURL:url
                                                sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                       annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
            ];
    BOOL twitterStatus =  [[Twitter sharedInstance] application:application openURL:url options:options];
    return fbStatus || twitterStatus;
  }
  
//  if ([myUrl containsString:@"web.skjutsgruppen.nu"]) {
//    FIRDynamicLink *dynamicLink = [[FIRDynamicLinks dynamicLinks] dynamicLinkFromCustomSchemeURL:url];
//    NSLog(@"firebase dynamic url: 123123123 %@", dynamicLink.url);
//
//    return [RCTLinkingManager application:application openURL:dynamicLink.url options:options];
//  } else if([myUrl containsString:@"pwm3h.app.goo.gl"]) {
//    FIRDynamicLink *dynamicLink = [[FIRDynamicLinks dynamicLinks] dynamicLinkFromCustomSchemeURL:url];
//    NSLog(@"firebase dynamic url:09890809 %@", dynamicLink.url);
//
//    return [RCTLinkingManager application:application openURL:dynamicLink.url options:options];  }
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
  NSLog(@"=========================UNIVERSAL LINKING URL: referealurl %@ ",userActivity.webpageURL);

  BOOL handled = [[FIRDynamicLinks dynamicLinks] handleUniversalLink:userActivity.webpageURL
                                                          completion:^(FIRDynamicLink * _Nullable dynamicLink,
                                                                       NSError * _Nullable error) {
                                                            NSLog(@"firebase dynamic url: %@", dynamicLink.url);
                                                            userActivity.webpageURL = dynamicLink.url;
                                                             [RCTLinkingManager application:application
                                                                             continueUserActivity:userActivity
                                                                               restorationHandler:restorationHandler];
                                                          }];
  return handled;
 
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  NSLog(@"Firebase didreceiveLocalNotification called");
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  NSLog(@"Firebase didreceiveRemoteNotification called");

  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  NSLog(@"Firebase didreceiveusernotification called");
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}

@end
