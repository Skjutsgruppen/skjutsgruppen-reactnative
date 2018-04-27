#import <CoreLocation/CoreLocation.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import "GeoLocation.h"

@interface GeoLocation() <CLLocationManagerDelegate>

#define IS_OS_8_OR_LATER ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0)
#define IS_OS_10_OR_LATER ([[[UIDevice currentDevice] systemVersion] floatValue] >= 10.0)

@property (strong, nonatomic) CLLocationManager *locationManager;
@property CLLocation *lastLocation;
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
    self.locationManager.distanceFilter = 50;
    self.locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters;
    self.locationManager.allowsBackgroundLocationUpdates = true;
    self.locationManager.pausesLocationUpdatesAutomatically = NO;
  }

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
  NSString* url = IS_OS_10_OR_LATER ? @"prefs:root=LOCATION_SERVICES" : @"App-Prefs:root=Privacy&path=LOCATION";
  dispatch_sync(dispatch_get_main_queue(), ^{
    @try{
      [[UIApplication sharedApplication] openURL:[NSURL URLWithString: url]];
    }@catch(NSException *ex){
      NSLog(@"%@", ex.reason);
    }
  });
}

RCT_REMAP_METHOD(startService,
                 startServiceResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  CLAuthorizationStatus authorizationStatus= [CLLocationManager authorizationStatus];
  if(authorizationStatus == kCLAuthorizationStatusDenied || authorizationStatus == kCLAuthorizationStatusRestricted){
    reject(@"unauthorized", @"You are not authorized", nil);
    return;
  }
  if(IS_OS_8_OR_LATER) {
    [self.locationManager requestAlwaysAuthorization];
  }
  [self.locationManager startUpdatingLocation];
  resolve(@"start location update started");
}

RCT_REMAP_METHOD(stopService,
                 stopServiceResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  CLAuthorizationStatus authorizationStatus= [CLLocationManager authorizationStatus];
  if(authorizationStatus == kCLAuthorizationStatusDenied || authorizationStatus == kCLAuthorizationStatusRestricted){
    reject(@"unauthorized", @"You are not authorized", nil);
    return;
  }
  if(IS_OS_8_OR_LATER) {
    [self.locationManager requestAlwaysAuthorization];
  }
  [self.locationManager stopUpdatingLocation];
  resolve(@"location service stopped");
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
  NSLog(@"Location manager failed: %@", error);
}

static void sendUpdate(GeoLocation *object, NSUserDefaults *defaults) {
  NSDictionary *locationEvent = @{
                                  @"coords": @{
                                      @"latitude": @(object.lastLocation.coordinate.latitude),
                                      @"longitude": @(object.lastLocation.coordinate.longitude),
                                      @"altitude": @(object.lastLocation.altitude),
                                      @"accuracy": @(object.lastLocation.horizontalAccuracy),
                                      @"altitudeAccuracy": @(object.lastLocation.verticalAccuracy),
                                      @"course": @(object.lastLocation.course),
                                      @"speed": @(object.lastLocation.speed),
                                      },
                                  @"timestamp": @([object.lastLocation.timestamp timeIntervalSince1970] * 1000) // in ms
                                  };

  [object.bridge.eventDispatcher sendDeviceEventWithName:@"updateLocation" body:locationEvent];
  [defaults setDouble:object.lastLocation.coordinate.latitude forKey:@"latitude"];
  [defaults setDouble:object.lastLocation.coordinate.longitude forKey:@"longitude"];
  [defaults synchronize];
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  for (int i=0; i<locations.count; i++) {
    CLLocation *newLocation = [locations objectAtIndex:i];
    if(self.lastLocation==nil){
      self.lastLocation = newLocation;
      sendUpdate(self, defaults);
      break;
    }
    if(self.lastLocation.coordinate.latitude != newLocation.coordinate.latitude || self.lastLocation.coordinate.longitude != newLocation.coordinate.longitude){
      self.lastLocation = newLocation;
      sendUpdate(self, defaults);
      break;
    }
  }
}

@end
