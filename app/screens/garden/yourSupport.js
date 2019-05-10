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
import { withMySupport, withCancelSupportSubscription } from '@services/apollo/support';
import { withAccount } from '@services/apollo/profile';
import { trans } from '@lang/i18n';
import CrossIcon from '@assets/icons/ic_cross.png';
import { ConfirmModal } from '@components/common';
import { unsubscribePayment } from '@services/support/purchase';

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
      showConfirmCancel: false,
      subscriptionId: null,
    };
  }

  componentDidMount() {
    const { subscribeToUpdatedProfile, data } = this.props;

    subscribeToUpdatedProfile({ id: data.profile.id });
  }

  onCancelSupportSubscriptionConfirm = (id) => {
    this.setState({ showConfirmCancel: true, subscriptionId: id });
  }

  onCancelSupportSubscription = () => {
    const { mySupport } = this.props;
    unsubscribePayment(mySupport.data.currentlySubscriptionPlan);
  }

  renderSubscriptions = () => {
    const { mySupport } = this.props;

    if (!(mySupport.data && mySupport.data.subscriptions)) return null;
    return (
      mySupport.data.subscriptions.map((subscription, index) => (
        <View key={subscription.id}>
          <View style={styles.flexRow}>
            <View>
              {
                subscription.Plan.billingCycle === 12 &&
                <Title color={Colors.text.pink} fontVariation="bold">{trans('profile.show_your_logo_and_brand')}</Title>
              }
              <Title color={Colors.text.gray}>
                <Title color={Colors.text.pink} fontVariation="bold">{subscription.Plan.amountPerMonth} kr </Title>
                {trans('profile.every')} {subscription.Plan.billingCycle === 12 ? trans('profile.year') : `${subscription.Plan.billingCycle} ${trans('profile.month_s')}`}
              </Title>
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
          {
            !subscription.active && ((mySupport.data.subscriptions.length - 1) === index) &&
            <View>
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
    const { subscribing, showConfirmCancel } = this.state;

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
            <View style={[{ marginTop: 24 }, styles.flexRow]}>
              <Title color={Colors.text.gray}>{trans('profile.total_supported')}</Title>
              <Heading size={16} color={Colors.text.yellowGreen}>{mySupport.data.total} kr</Heading>
            </View>
            <Title color={Colors.text.gray} fontVariation="italic" style={[{ fontStyle: 'italic' }, styles.text]}>
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
            noBackground
            elevation={0}
            durationLabel={trans('profile.one_month')}
            amount="10"
            planId={'10_kr_per_month'}
            info={trans('profile.total_of_10_auto_renewed_every_month')}
            currentlySupporting={mySupport.data.currentSubscriptionPlan}
          />
          <Package
            elevation={20}
            durationLabel={trans('profile.one_month')}
            amount="29"
            planId={'29_kr_per_month_garden'}
            info={trans('profile.total_of_29_auto_renewed_every_month')}
            currentlySupporting={mySupport.data.currentSubscriptionPlan}
          />
          <HelpMore
            currentlySupporting={mySupport.data.currentSubscriptionPlan}
          />
          <HowItWorks />
          <Costs supporter={supporter} />
        </ScrollView>
        <ConfirmModal
          loading={subscribing}
          visible={subscribing}
          cancelable={false}
          onConfirm={() => {}}
          onDeny={() => {}}
          onRequestClose={() => {}}
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
  data: PropTypes.shape({
    profile: PropTypes.shape(),
  }).isRequired,
  mySupport: PropTypes.shape({
    currentSubscriptionPlan: PropTypes.string,
    subscriptions: PropTypes.shape(),
    total: PropTypes.number,
  }).isRequired,
  subscribeToUpdatedProfile: PropTypes.func.isRequired,
};

YourSupport.defaultProps = {
  generateClientToken: null,
  mySupport: {
    currentSubscriptionPlan: null,
    subscriptions: [],
    total: 0,
  },
};

export default compose(
  withMySupport,
  withCancelSupportSubscription,
  withAccount,
)(YourSupport);

