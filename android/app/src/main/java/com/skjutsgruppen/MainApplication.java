package com.skjutsgruppen;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.gettipsi.reactnativetwittersdk.TwitterReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import ga.piroro.rnt.RNTPackage;
import com.tkporter.sendsms.SendSMSPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.imagepicker.ImagePickerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.rnfs.RNFSPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.smixx.fabric.FabricPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import ga.piroro.rnt.RNTPackage;
import com.gettipsi.reactnativetwittersdk.TwitterReactPackage;
import com.smixx.fabric.FabricPackage;
import com.rnfs.RNFSPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.tkporter.sendsms.SendSMSPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.airbnb.android.react.maps.MapsPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.magus.fblogin.FacebookLoginPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import java.util.Arrays;
import java.util.List;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.skjutsgruppen.react.modules.GeoLocationPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new RNTPackage(),
        new FabricPackage(),
        new RNFSPackage(),
        new RCTCameraPackage(),
        new LinearGradientPackage(),
        SendSMSPackage.getInstance(),
        new RNDeviceInfo(),
        new MapsPackage(),
        new ReactNativeContacts(),
        new VectorIconsPackage(),
        new ImagePickerPackage(),
        new ReactNativeConfigPackage(),
        new FacebookLoginPackage(),
        new RNI18nPackage(),
        new FIRMessagingPackage(),
        new TwitterReactPackage(),
        new GeoLocationPackage(),
        new FBSDKPackage(mCallbackManager)            
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
