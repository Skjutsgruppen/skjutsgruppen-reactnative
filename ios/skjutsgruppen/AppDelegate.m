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
@import GoogleMaps;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [RNFirebaseNotifications configure];
  [GMSServices provideAPIKey:[ReactNativeConfig envFor:@"GOOGLE_MAP_API_KEY"]];
NSLog(@"GOOGLE MAPS API KEY: %@", [ReactNativeConfig envFor:@"GOOGLE_MAP_API_KEY"]);
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
  if ([myUrl containsString:@"skjutsgruppen"]) {
   return [RCTLinkingManager application:application openURL:url options:options];
  } else {
    return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                          openURL:url
                                                sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                       annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
            ];
  }
}

//firebase push notification

//#if defined(__IPHONE_11_0)
//- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
//{
//  NSLog(@"didReceiveLocalNotification: 11.0");
//
//    [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHan	dler];
//  }
//#else
//- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler
//{
//  NSLog(@"didReceiveNotificationResponse: ");
//    [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
//  }
//#endif

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
