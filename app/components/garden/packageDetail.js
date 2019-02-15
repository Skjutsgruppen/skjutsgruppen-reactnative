import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Platform, Linking, Image, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';

import { unsubscribePayment, showPayment, isSubscriptionActive } from '@services/support/purchase';
import { withSupport, withMySupport } from '@services/apollo/support';
import Colors from '@theme/colors';
import { Heading, Title, AppText } from '@components/utils/texts';
import Wrapper from '@components/common/wrapper';
import ToolBar from '@components/utils/toolbar';
import { AppNotification, RoundedButton, Loading } from '@components/common';
import { trans } from '@lang/i18n';
import SupporterAvatar from '@assets/supporter_avatar.png';
import AddPhoto from '@assets/icons/ic_add_photo_app.png';
import LogoCard from '@assets/tiny_card.png';
import ErrorIcon from '@assets/icons/ic_warning.png';
import SuccessIcon from '@assets/icons/ic_checked_green.png';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
    marginVertical: 40,
  },
  heading: {
    marginTop: 60,
    marginBottom: 24,
    lineHeight: 40,
  },
  title: {
    lineHeight: 32,
    marginBottom: 24,
  },
  features: {
    paddingVertical: 16,
  },
  thumbnail: {
    width: 100,
  },
  infos: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.background.fullWhite,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.11,
        shadowRadius: 2,
      },
    }),
    marginVertical: 12,
  },
  info: {
    marginVertical: 8,
  },
  button: {
    maxWidth: 200,
    marginBottom: 24,
  },
  loading: {
    maxWidth: 200,
    height: 64,
  },
  description: {
    lineHeight: 26,
    paddingVertical: 12,
    marginBottom: 48,
  },
  furtherCondition: {
    marginBottom: 50,
    lineHeight: 26,
  },
  footer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 4,
        shadowOpacity: 0.1,
      },
      android: {
        elevation: -15,
      },
    }),
  },
});

class PackageDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appNotificationVisibility: false,
      modalVisibility: false,
      loading: false,
      detailView: false,
      error: false,
      currentlySupporting: this.props.mySupport.data.currentSubscriptionPlan,
    };
  }

  onShowActiveSubscriptionError = (currentlySupporting) => {
    Alert.alert(
      null,
      trans('profile.currently_subscribed'),
      [
        {
          text: trans('profile.unsubscribe_now'),
          onPress: () => unsubscribePayment(currentlySupporting),
        },
        { text: trans('global.cancel'), style: 'cancel' },
      ],
    );
  }

  onSupportPress = async () => {
    const { currentlySupporting } = this.state;
    if (currentlySupporting && currentlySupporting !== '') {
      this.onShowActiveSubscriptionError('currentlySupporting');
    } else {
      const activeSubscription = await isSubscriptionActive();
      if (activeSubscription) {
        this.onShowActiveSubscriptionError(activeSubscription);
      } else {
        this.onSupportSubscribe();
      }
    }
  }

  onSupportSubscribe = () => {
    const { support, planId } = this.props;
    this.setState({ loading: true, statusMessage: '' });
    showPayment(planId, (error, purchaseDetail) => {
      if (error) {
        this.setState(
          { loading: false, appNotificationVisibility: true, error: true },
        );
        return;
      }

      this.setState({
        currentlySupporting: planId,
      });

      support({ planId,
        transactionId: purchaseDetail.transactionId,
        receipt: purchaseDetail.transactionReceipt,
        originalTransactionId: purchaseDetail.originalTransactionIdentifier ?
          purchaseDetail.originalTransactionIdentifier : purchaseDetail.transactionId,
        device: Platform.OS })
        .then(() => {
          this.setState(
            { loading: false, appNotificationVisibility: true },
          );
        })
        .catch(() => {
          this.setState(
            { loading: false, appNotificationVisibility: true, error: true },
          );
        });
    });
  }

  render() {
    const {
      amount,
      onBack,
      helpMore,
      pageTitle,
      headingText,
      featureText,
      durationLabel: duration,
    } = this.props;
    const { loading, error, appNotificationVisibility } = this.state;

    return (
      <Wrapper bgColor={Colors.background.fullWhite}>
        {
          appNotificationVisibility && (
            <AppNotification
              name={error ? trans('profile.subscribe_failed') : trans('profile.subscribed_success')}
              type="icon"
              image={error ? ErrorIcon : SuccessIcon}
              handleClose={() => this.setState({ appNotificationVisibility: false })}
            />
          )
        }
        <ToolBar title={pageTitle} fontVariation="bold" onBack={onBack} />
        <ScrollView style={{ paddingHorizontal: 20 }}>
          <Heading
            size={32}
            color={Colors.text.pink}
            fontVariation="bold"
            style={styles.heading}
          >{headingText}</Heading>
          <Title size={24} color={Colors.text.darkGray} style={styles.title}>
            {featureText}
          </Title>
          <View style={[styles.row, styles.features]}>
            <View style={styles.thumbnail}>
              <Image source={SupporterAvatar} />
            </View>
            <AppText style={{ flex: 1 }}>{trans('profile.a_leaf_next_to_your_profile_picture')}</AppText>
          </View>
          <View style={[styles.row, styles.features]}>
            <View style={styles.thumbnail}>
              <Image source={AddPhoto} />
            </View>
            <AppText style={{ flex: 1 }}>{trans('profile.the_ability_to_add_photos_to_your_rides')}</AppText>
          </View>
          {
            helpMore && (
              <View style={[styles.row, styles.features]}>
                <View style={styles.thumbnail}>
                  <Image source={LogoCard} style={{ width: 70 }} resizeMode="contain" />
                </View>
                <AppText style={{ flex: 1 }}>{trans('profile.the_ability_to_add_your_logo_to_your_rides')}</AppText>
              </View>
            )
          }
          <View style={styles.divider} />
          <AppText style={styles.description} color={Colors.text.darkGray}>
            {trans('profile.package_description', { amount: `${amount} kr`, duration, store: Platform.OS === 'ios' ? 'iTunes' : 'Play Store' })}</AppText>
          <AppText
            style={styles.furtherCondition}
            onPress={() => Linking.openURL('https://skjutsgruppen.nu/participant-agreement')}
          >
            {trans('profile.further_conditions_that_regulate_your_use')}
            <AppText color={Colors.text.blue}> {trans('profile.participant_agreement')}</AppText>
          </AppText>
        </ScrollView>
        <View style={styles.footer}>
          {
            loading ? (
              <Loading style={styles.loading} />
            ) : (
              <RoundedButton
                bgColor={Colors.text.pink}
                onPress={this.onSupportPress}
                style={styles.button}
              >
                {`${trans('profile.support')} ${duration}`}
              </RoundedButton>
            )
          }
          <AppText color={Colors.text.darkGray}>{trans('profile.auto_renewed_stop_when_ever_you_want')}</AppText>
        </View>
      </Wrapper>
    );
  }
}

PackageDetail.propTypes = {
  onBack: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
  durationLabel: PropTypes.string.isRequired,
  pageTitle: PropTypes.string,
  headingText: PropTypes.string.isRequired,
  featureText: PropTypes.string.isRequired,
  helpMore: PropTypes.bool.isRequired,
  planId: PropTypes.string.isRequired,
  support: PropTypes.func.isRequired,
  mySupport: PropTypes.shape({
    data: {
      currentSubscriptionPlan: PropTypes.string,
      subscriptions: PropTypes.array,
    },
  }).isRequired,
};

PackageDetail.defaultProps = {
  pageTitle: '',
};

export default compose(withSupport, withMySupport)(PackageDetail);
