package com.skjutsgruppen.braintree;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.braintreepayments.api.BraintreeFragment;
import com.braintreepayments.api.dropin.DropInRequest;
import com.braintreepayments.api.dropin.DropInResult;
import com.braintreepayments.api.exceptions.InvalidArgumentException;
import com.braintreepayments.api.models.GooglePaymentRequest;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.wallet.TransactionInfo;
import com.google.android.gms.wallet.WalletConstants;

/**
 * Created by umesh on 4/19/18.
 */

public class BraintreePaymentModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    public static final int REQUEST_CODE = 123;
    private static final String TAG = BraintreePaymentModule.class.getSimpleName();
    private BraintreeFragment braintreeFragment;
    private String token;
    private Callback errorCallback;
    private Callback successCallback;

    public BraintreePaymentModule(ReactApplicationContext reactContext) {
        super(reactContext);
        final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
            @Override
            public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
                Log.e(TAG, "onActivityResult");
                if (requestCode == REQUEST_CODE)
                    handlePaymentInfo(requestCode, resultCode, data);
                super.onActivityResult(activity, requestCode, resultCode, data);
            }
        };
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "BraintreePayment";
    }

    @ReactMethod
    public void showPayment(Callback successCallback, Callback errorCallback) {
        Log.e(TAG, "show payment token: " + token);
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        if (braintreeFragment == null) {
            try {
                braintreeFragment = BraintreeFragment.newInstance(getCurrentActivity(), token);

            } catch (InvalidArgumentException e) {
                e.printStackTrace();
                errorCallback.invoke(e.getMessage());
                return;
            }
        }

        DropInRequest dropInRequest = new DropInRequest();
        dropInRequest.tokenizationKey(token);
        GooglePaymentRequest googlePayRequest = new GooglePaymentRequest()
                .transactionInfo(TransactionInfo.newBuilder()
                        .setTotalPrice("1.00")
                        .setTotalPriceStatus(WalletConstants.TOTAL_PRICE_STATUS_FINAL)
                        .setCurrencyCode("USD").build())
                .phoneNumberRequired(false)
                .emailRequired(false)
                .shippingAddressRequired(false);
        dropInRequest.googlePaymentRequest(googlePayRequest);


        getCurrentActivity().startActivityForResult(
                dropInRequest.getIntent(getReactApplicationContext()), REQUEST_CODE);

    }

    @ReactMethod
    public void setToken(String token) {
        this.token = token;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        handlePaymentInfo(requestCode, resultCode, data);
    }

    private void handlePaymentInfo(int requestCode, int resultCode, Intent data) {
        Log.e(TAG, "onActivityResult === request code: " + requestCode + "\tresult code: "
                + resultCode + "\n" + data);
        if (requestCode == REQUEST_CODE) {
            if (resultCode == Activity.RESULT_CANCELED) {
                errorCallback.invoke("user_canceled");
                return;
            }
            if (resultCode == Activity.RESULT_OK) {
                DropInResult result = data.getParcelableExtra(DropInResult.EXTRA_DROP_IN_RESULT);
                Log.e("Braintree Payment", result.getDeviceData() + "\n " + result.getPaymentMethodType());
                successCallback.invoke(result.getPaymentMethodNonce().getNonce());
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
    }


}
