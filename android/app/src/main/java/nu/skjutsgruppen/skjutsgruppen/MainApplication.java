package nu.skjutsgruppen.skjutsgruppen;

import android.support.multidex.MultiDexApplication;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.crashlytics.android.Crashlytics;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.react.ReactApplication;
import com.opensettings.OpenSettingsPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.levelasquez.androidopensettings.AndroidOpenSettingsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.gettipsi.reactnativetwittersdk.TwitterReactPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import nu.skjutsgruppen.skjutsgruppen.braintree.BraintreePaymentPackage;
import com.smixx.fabric.FabricPackage;
import com.tkporter.sendsms.SendSMSPackage;
import com.twitter.sdk.android.Twitter;
import com.twitter.sdk.android.core.TwitterAuthConfig;

import java.util.Arrays;
import java.util.List;

import ga.piroro.rnt.RNTPackage;
import io.fabric.sdk.android.Fabric;
import nu.skjutsgruppen.skjutsgruppen.react.modules.GeoLocationPackage;

import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

public class MainApplication extends MultiDexApplication implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new OpenSettingsPackage(),
                    new RNFirebasePackage(),
                    new AndroidOpenSettingsPackage(),
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
                    new TwitterReactPackage(),
                    new GeoLocationPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new BraintreePaymentPackage(),
                    new RNFirebaseNotificationsPackage(),
                    new RNFirebaseMessagingPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        TwitterAuthConfig authConfig = new TwitterAuthConfig(BuildConfig.TWITTER_CONSUMER_KEY, BuildConfig.TWITTER_CONSUMER_SECRET);
        SoLoader.init(this, /* native exopackage */ false);
        Fabric.with(this, new Crashlytics(), new Twitter(authConfig));
    }
}
