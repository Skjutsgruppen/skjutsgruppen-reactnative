package nu.skjutsgruppen.skjutsgruppen;

import android.support.multidex.MultiDexApplication;

import com.crashlytics.android.Crashlytics;
import com.facebook.CallbackManager;
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
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import nu.skjutsgruppen.skjutsgruppen.braintree.BraintreePaymentPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.smixx.fabric.FabricPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.twitter.sdk.android.Twitter;
import com.twitter.sdk.android.core.TwitterAuthConfig;

import java.util.Arrays;
import java.util.List;

import io.fabric.sdk.android.Fabric;
import nu.skjutsgruppen.skjutsgruppen.react.modules.GeoLocationPackage;

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
            new TwitterReactPackage(),
            new VectorIconsPackage(),
            new RNTPackage(),
            SendSMSPackage.getInstance(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new ImagePickerPackage(),
            new RNI18nPackage(),
            new RNFSPackage(),
            new FIRMessagingPackage(),
            new FBSDKPackage(mCallbackManager),
            new FacebookLoginPackage(),
            new FabricPackage(),
            new RNDeviceInfo(),
            new ReactNativeContacts(),
            new ReactNativeConfigPackage(),
            new RNCameraPackage(),
            new GeoLocationPackage(),
            new BraintreePaymentPackage()
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
