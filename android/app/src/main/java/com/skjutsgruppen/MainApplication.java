package com.skjutsgruppen;

import android.app.Application;

import com.facebook.react.ReactApplication;
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

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            SendSMSPackage.getInstance(),
            new RNDeviceInfo(),
            new MapsPackage(),
            new ReactNativeContacts(),
            new VectorIconsPackage(),
            new ImagePickerPackage(),
            new ReactNativeConfigPackage(),
            new FacebookLoginPackage(),
            new RNI18nPackage()
      );
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
