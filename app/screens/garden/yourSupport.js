import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';
import { Heading, Title } from '@components/utils/texts';
import Wrapper from '@components/common/wrapper';
import ToolBar from '@components/utils/toolbar';
import Header from '@components/garden/header';
import Package from '@components/garden/subscriptionPackage';
import HelpMore from '@components/garden/helpMore';
import HowItWorks from '@components/garden/howItWorks';
import Costs from '@components/garden/costs';
import { withSupport, withGenerateClientToken, withMySupport, withCancelSupportSubscription } from '@services/apollo/support';
import { withAccount } from '@services/apollo/profile';
import { trans } from '@lang/i18n';
import CrossIcon from '@assets/icons/ic_cross.png';
import ConfirmModal from '@components/common/confirmModal';
import { showPayment } from '@services/braintree/braintreePayment';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horizontalDivider: {
    marginVertical: 32,
    height: 1,
    backgroundColor: Colors.text.lightGray,
  },
  miniDivider: {
    height: 1,
    width: 64,
    backgroundColor: Colors.text.lightGray,
    marginTop: 24,
    marginBottom: 32,
  },
  text: {
    marginTop: 24,
  },
});

class YourSupport extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      subscribing: false,
      showConfirmModal: false,
      alertMessage: '',
      showConfirmCancel: false,
      subscriptionId: null,
    };
  }

  componentDidMount() {
    const { subscribeToUpdatedProfile, data } = this.props;

    subscribeToUpdatedProfile({ id: data.profile.id });
  }

  onSupportSubscribe = (planId) => {
    const { support, generateClientToken, mySupport } = this.props;

    showPayment(generateClientToken, (error, paymentMethodNonce) => {
      if (error) {
        console.warn(error);
        this.setState({ showConfirmModal: true, alertMessage: trans('profile.subscribe_failed') });
        return;
      }

      this.setState({ subscribing: true, showConfirmModal: true });

      support({ planId, paymentMethodNonce })
        .then(() => {
          mySupport.refetch()
            .then(() => {
              this.setState({ subscribing: false, alertMessage: trans('profile.subscribed_success') });
            });
        })
        .catch((e) => {
          console.warn(e);
          this.setState({ subscribing: false, alertMessage: trans('profile.subscribe_failed') });
        });
    });
  }

  onCancelSupportSubscriptionConfirm = (id) => {
    this.setState({ showConfirmCancel: true, subscriptionId: id });
  }

  onCancelSupportSubscription = () => {
    const { cancelSupportSubscription, mySupport } = this.props;
    const { subscriptionId } = this.state;

    this.setState({ subscribing: true, showConfirmModal: true, showConfirmCancel: false });
    cancelSupportSubscription({ id: subscriptionId })
      .then(() => {
        mySupport.refetch()
          .then(() => {
            this.setState({ subscribing: false, alertMessage: trans('profile.auto_renewal_canceled') });
          });
      });
  }

  renderSubscriptions = () => {
    const { mySupport } = this.props;

    if (!(mySupport.data && mySupport.data.subscriptions)) return null;

    return (
      mySupport.data.subscriptions.map(subscription => (
        <View key={subscription.id}>
          <View style={styles.flexRow}>
            <View>
              {
                subscription.Plan.billingCycle === 12 &&
                <Title color={Colors.text.pink} fontVariation="bold">{trans('profile.show_your_logo_and_brand')}</Title>
              }
              <Title color={Colors.text.gray}>
                <Title color={Colors.text.pink} fontVariation="bold">{subscription.Plan.amountPerMonth} kr </Title>
                {trans('profile.every_month')}
              </Title>
              <Title color={Colors.text.gray}>for {subscription.Plan.billingCycle === 12 ? trans('profile.year') : `${subscription.Plan.billingCycle} ${trans('profile.month_s')}`}</Title>
            </View>
            <Heading color={Colors.text.yellowGreen}>{subscription.totalRevenue} kr</Heading>
          </View>
          <Title color={Colors.text.gray} style={styles.text}>
            {subscription.active &&
              <Text>
                {trans('profile.this_support_is_auto_renewed_every')} {subscription.Plan.billingCycle === 12 ? trans('profile.year') : `${subscription.Plan.billingCycle} ${trans('profile.month_s')}`}.
              </Text>
            }
            {
              subscription.supportedMonths > 0 &&
              <Text>
                ({trans('profile.you_are_in')} {subscription.supportedMonths} {trans('profile.of_this_support_and_have_not_been_auto_renewed_yet')})
              </Text>
            }
          </Title>
          {subscription.active &&
            <View>
              <View style={styles.miniDivider} />
              <TouchableOpacity
                onPress={() => this.onCancelSupportSubscriptionConfirm(subscription.id)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                  <Image source={CrossIcon} />
                  <Title
                    color={Colors.text.blue}
                    style={{ flex: 1, marginLeft: 16 }}
                    fontVariation="semibold"
                  >{trans('profile.stop_auto_renewal')}</Title>
                </View>
              </TouchableOpacity>
              <View style={[styles.horizontalDivider, { marginBottom: 12 }]} />
              <View style={[styles.horizontalDivider, { marginTop: 0 }]} />
            </View>
          }
        </View>
      ))
    );
  }

  render() {
    const { mySupport, data } = this.props;
    const { subscribing, showConfirmModal, alertMessage, showConfirmCancel } = this.state;

    if (!mySupport.data || !data.profile) return null;

    const supporter = data.profile.isSupporter;

    return (
      <Wrapper>
        <ToolBar title={trans('profile.your_support')} fontVariation="bold" />
        <ScrollView>
          <Header
            showTitle={false}
            showAvatar={false}
            headingLabel={trans('profile.you_are_a_supporter')}
            infoLabel={trans('profile.you_have_so_far_supported')}
            user={data.profile}
          />
          <View style={{ paddingHorizontal: 30, paddingBottom: 30 }}>
            {this.renderSubscriptions()}
            <Heading size={16} color={Colors.text.yellowGreen}>{trans('profile.total')}</Heading>
            <View style={styles.flexRow}>
              <Title color={Colors.text.gray}>{trans('profile.total_supported')}</Title>
              <Heading size={16} color={Colors.text.yellowGreen}>{mySupport.data.total} kr</Heading>
            </View>
            <Title color={Colors.text.gray} fontVariation="italic" style={styles.text}>
              {trans('profile.your_total_support_so_far')}
            </Title>
            <View style={styles.horizontalDivider} />
            <Title color={Colors.text.pink} fontVariation="bold">{trans('profile.thank_you_for_your_support_so_far')}</Title>
            <Title color={Colors.text.gray} style={styles.text}>
              {trans('profile.if_you_like_to_continue_to_support')}
            </Title>
            <Title color={Colors.text.pink} fontVariation="bold" style={styles.text}>{trans('profile.or_would_you_like_to_support')}</Title>
            <Title color={Colors.text.gray} style={styles.text}>
              {trans('profile.just_click_one_of_the_buttons')}
            </Title>
          </View>
          <Package
            noBackgroud
            elevation={0}
            durationLabel={trans('profile.support_six_month')}
            monthlyAmount={9}
            planId={1}
            supportSubscribe={this.onSupportSubscribe}
            info={trans('profile.total_of_54_auto_renewed_every_six_month')}
          />
          <Package
            elevation={20}
            durationLabel={trans('profile.support_one_month')}
            monthlyAmount={29}
            planId={2}
            supportSubscribe={this.onSupportSubscribe}
            info={trans('profile.total_of_29_auto_renewed_every_six_month')}
          />
          <HelpMore
            supportSubscribe={this.onSupportSubscribe}
          />
          <HowItWorks />
          <Costs supporter={supporter} />
        </ScrollView>
        <ConfirmModal
          loading={subscribing}
          message={alertMessage}
          visible={showConfirmModal}
          onRequestClose={() => this.setState({ showConfirmModal: false })}
          confirmLabel={trans('global.ok')}
          denyLabel={trans('global.cancel')}
          onConfirm={() => this.setState({ showConfirmModal: false })}
          onDeny={() => this.setState({ showConfirmModal: false })}
          cancelable={false}
        />
        <ConfirmModal
          loading={false}
          message={trans('global.cancel_auto_renewal')}
          visible={showConfirmCancel}
          onRequestClose={() => this.setState({ showConfirmCancel: false })}
          confirmLabel={trans('global.ok')}
          denyLabel={trans('global.cancel')}
          onConfirm={() => this.onCancelSupportSubscription()}
          onDeny={() => this.setState({ showConfirmCancel: false })}
        />
      </Wrapper>
    );
  }
}

YourSupport.propTypes = {
  support: PropTypes.func.isRequired,
  generateClientToken: PropTypes.string,
  data: PropTypes.shape({
    profile: PropTypes.shape(),
  }).isRequired,
  mySupport: PropTypes.shape({
    subscriptions: PropTypes.shape(),
    total: PropTypes.number,
  }).isRequired,
  cancelSupportSubscription: PropTypes.func.isRequired,
  subscribeToUpdatedProfile: PropTypes.func.isRequired,
};

YourSupport.defaultProps = {
  generateClientToken: null,
  mySupport: {
    subscriptions: [],
    total: 0,
  },
};

export default compose(
  withSupport,
  withMySupport,
  withGenerateClientToken,
  withCancelSupportSubscription,
  withAccount,
)(YourSupport);

