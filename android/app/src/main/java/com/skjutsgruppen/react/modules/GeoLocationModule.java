package com.skjutsgruppen.react.modules;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.Location;
import android.support.v4.content.LocalBroadcastManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.skjutsgruppen.GeoLocationService;
import android.location.LocationManager;
import android.provider.Settings;

public class GeoLocationModule extends ReactContextBaseJavaModule {
    public GeoLocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        BroadcastReceiver geoLocationReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                Location message = intent.getParcelableExtra("message");
                GeoLocationModule.this.sendEvent(message);
            }
        };
        LocalBroadcastManager.getInstance(getReactApplicationContext()).registerReceiver(geoLocationReceiver, new IntentFilter("GeoLocationUpdate"));
    }

    @Override
    public String getName() {
        return "GeoLocation";
    }

    @ReactMethod
    public void startService(Promise promise) {
        if (!isGpsOn()) {
            promise.reject("gps_off", "Gps is turned off");
        }

        String result = "Location service started";

        try {
            Intent intent = new Intent(getReactApplicationContext(), GeoLocationService.class);
            getReactApplicationContext().startService(intent);
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }
        promise.resolve(result);
    }

    @ReactMethod
    public void stopService(Promise promise) {
        String result = "Location service stopped";
        try {
            Intent intent = new Intent(GeoLocationService.FOREGROUND);
            intent.setClass(this.getReactApplicationContext(), GeoLocationService.class);
            this.getReactApplicationContext().stopService(intent);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
        promise.resolve(result);
    }

    @ReactMethod
    public void checkGpsStatus(Promise promise) {
        promise.resolve(isGpsOn());
    }

    @ReactMethod
    public void showGpsSetting(){
        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        getReactApplicationContext().startActivity(intent);
    }

    private boolean isGpsOn() {
        LocationManager locationManager = (LocationManager)
                getReactApplicationContext().getSystemService(Context.LOCATION_SERVICE);
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    }

    private WritableMap createGeoData(Location message) {
        WritableMap map = Arguments.createMap();
        WritableMap coordMap = Arguments.createMap();
        coordMap.putDouble("latitude", message.getLatitude());
        coordMap.putDouble("longitude", message.getLongitude());
        coordMap.putDouble("accuracy", message.getAccuracy());
        coordMap.putDouble("altitude", message.getAltitude());
        coordMap.putDouble("heading", message.getBearing());
        coordMap.putDouble("speed", message.getSpeed());

        map.putMap("coords", coordMap);
        map.putDouble("timestamp", message.getTime());

        return map;
    }

    private void sendEvent(Location message) {
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("updateLocation", createGeoData(message));
    }
}