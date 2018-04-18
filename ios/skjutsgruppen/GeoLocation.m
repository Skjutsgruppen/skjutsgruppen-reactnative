#import <CoreLocation/CoreLocation.h>

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>

#import "GeoLocation.h"

@interface GeoLocation() <CLLocationManagerDelegate>
#define IS_OS_8_OR_LATER ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0)
#define IS_OS_10_OR_LATER ([[[UIDevice currentDevice] systemVersion] floatValue] >= 10.0)

@property (strong, nonatomic) CLLocationManager *locationManager;

@end
@implementation GeoLocation

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

#pragma mark Initialization

- (instancetype)init
{
  if (self = [super init]) {
    self.locationManager = [[CLLocationManager alloc] init];
    
    self.locationManager.delegate = self;
    
    self.locationManager.distanceFilter = kCLLocationAccuracyBestForNavigation;
    self.locationManager.desiredAccuracy = kCLLocationAccuracyHundredMeters;
    self.locationManager.allowsBackgroundLocationUpdates = true;
    self.locationManager.pausesLocationUpdatesAutomatically = NO;
  }
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  double latitude = [defaults doubleForKey:@"latitude"];
  double longitude = [defaults doubleForKey:@"longitude"];
  NSLog(@"latitude: %f \t longitude: %f", latitude, longitude);
  return self;
}

RCT_REMAP_METHOD(checkGpsStatus,
                 findEventsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSNumber *locationStatus = [NSNumber numberWithBool:[CLLocationManager locationServicesEnabled]==YES];
  resolve(locationStatus);
}

RCT_EXPORT_METHOD(showGpsSetting)
{
  NSLog(@"gotoSettings called");
  NSString* url = IS_OS_10_OR_LATER ? @"prefs:root=LOCATION_SERVICES" : @"App-Prefs:root=Privacy&path=LOCATION";
  dispatch_sync(dispatch_get_main_queue(), ^{
    NSLog(@"absc: %@",url);
    @try{
      bool status =  [[UIApplication sharedApplication] openURL:[NSURL URLWithString: url]];
      NSLog(@"openUrl status, %d", status);
    }@catch(NSException *ex){
      NSLog(@"%@", ex.reason);
    }
  });
}

RCT_EXPORT_METHOD(startService:(RCTResponseSenderBlock)callback)
{
  CLAuthorizationStatus authorizationStatus= [CLLocationManager authorizationStatus];
  NSLog(@"location fetch started");
  if(authorizationStatus == kCLAuthorizationStatusDenied || authorizationStatus == kCLAuthorizationStatusRestricted){
    RCTLogInfo(@"authorizationStatus failed");
    callback(@[@"unauthorized", [NSNull null]]);
    return;
    
    
  }
  if(IS_OS_8_OR_LATER) {
    RCTLogInfo(@"IOS 8 or later");
    [self.locationManager requestAlwaysAuthorization];
  }
  [self.locationManager startUpdatingLocation];
  callback(@[[NSNull null], @"start location update started"]);
}

RCT_EXPORT_METHOD(stopService:(RCTResponseSenderBlock)callback)
{
  CLAuthorizationStatus authorizationStatus= [CLLocationManager authorizationStatus];
  NSLog(@"location fetch started");
  if(authorizationStatus == kCLAuthorizationStatusDenied || authorizationStatus == kCLAuthorizationStatusRestricted){
    RCTLogInfo(@"authorizationStatus failed");
    callback(@[@"unauthorized", [NSNull null]]);
    return;
  }
  if(IS_OS_8_OR_LATER) {
    RCTLogInfo(@"IOS 8 or later");
    [self.locationManager requestAlwaysAuthorization];
  }
  [self.locationManager stopUpdatingLocation];
  callback(@[[NSNull null], @"stopped location update"]);
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
  NSLog(@"Location manager failed: %@", error);
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  double latitude = [defaults doubleForKey:@"latitude"];
  double longitude = [defaults doubleForKey:@"longitude"];
  NSLog(@"before ========> latitude: %f ----- longitude: %f", latitude, longitude);
  NSLog(@"location update called: %@", locations);
  CLLocation *location = [locations firstObject];
  NSDictionary *locationEvent = @{
                                  @"coords": @{
                                      @"latitude": @(location.coordinate.latitude),
                                      @"longitude": @(location.coordinate.longitude),
                                      @"altitude": @(location.altitude),
                                      @"accuracy": @(location.horizontalAccuracy),
                                      @"altitudeAccuracy": @(location.verticalAccuracy),
                                      @"course": @(location.course),
                                      @"speed": @(location.speed),
                                      },
                                  @"timestamp": @([location.timestamp timeIntervalSince1970] * 1000) // in ms
                                  };
  
  NSLog(@"after =====> %@: lat: %f, long: %f, altitude: %f", location.timestamp, location.coordinate.latitude, location.coordinate.longitude, location.altitude);
  
  [self.bridge.eventDispatcher sendDeviceEventWithName:@"updateLocation" body:locationEvent];
  [defaults setDouble:location.coordinate.latitude forKey:@"latitude"];
  [defaults setDouble:location.coordinate.longitude forKey:@"longitude"];
  [defaults synchronize];}

@end

