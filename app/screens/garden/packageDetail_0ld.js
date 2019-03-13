import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Platform, Linking } from 'react-native';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';
import { Heading, Title, AppText } from '@components/utils/texts';
import Wrapper from '@components/common/wrapper';
import ToolBar from '@components/utils/toolbar';
import { RoundedButton, Loading, AppNotification } from '@components/common';
import { trans } from '@lang/i18n';
import { showPayment } from '@services/support/purchase';
import { withSupport } from '@services/apollo/support';
import { compose } from 'react-apollo';
import ErrorIcon from '@assets/icons/ic_warning.png';
import SuccessIcon from '@assets/icons/ic_checked_green.png';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    paddingVertical: 32,
    paddingHorizontal: 20,
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
    marginVertical: 12,
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
});

class PackageDetail extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    loading: false,
    error: false,
    statusMessage: '',
  }

  onSupportSubscribe = (planId) => {
    const { support, onBack } = this.props;
    this.setState({ loading: true, statusMessage: '' });
    showPayment(planId, (error, purchaseDetail) => {
      if (error) {
        this.setState({ error: true, loading: false, statusMessage: trans('profile.subscribe_failed') });
        return;
      }

      support({ planId,
        transactionId: purchaseDetail.transactionId,
        receipt: purchaseDetail.transactionReceipt,
        originalTransactionId: purchaseDetail.originalTransactionIdentifier ?
          purchaseDetail.originalTransactionIdentifier : purchaseDetail.transactionId,
        device: Platform.OS })
        .then(() => {
          this.setState({ error: false, loading: false, statusMessage: trans('profile.subscribed_success') }, () => onBack());
        })
        .catch((e) => {
          this.setState({ error: true, loading: false, statusMessage: trans('profile.subscribe_failed') });
        });
    });
  }


  redirect = url => Linking.openURL(url);

  render() {
    const { loading, error, statusMessage } = this.state;
    const { amount, duration, planId, onBack, title } = this.props;

    return (
      <Wrapper>
        {
          statusMessage !== '' && statusMessage && !loading && (
            <AppNotification
              name={statusMessage}
              type="icon"
              image={error ? ErrorIcon : SuccessIcon}
              handleClose={() => this.setState({ statusMessage: '' })}
            />
          )
        }
        <ToolBar title={title} fontVariation="bold" onBack={onBack} />
        <ScrollView>
          <View style={styles.content}>
            <Heading
              size={24}
              color={Colors.text.pink}
              fontVariation="bold"
            >Subscription detail</Heading>
            <View style={styles.infos}>
              <View style={styles.row}>
                <Title size={16} color={Colors.text.darkGray} style={styles.info}>Amount</Title>
                <Title size={16} color={Colors.text.darkGray} fontVariation="bold" style={styles.info}>{amount}</Title>
              </View>
              <View style={styles.row}>
                <Title size={16} color={Colors.text.darkGray} style={styles.info}>Duration</Title>
                <Title size={16} color={Colors.text.darkGray} fontVariation="bold" style={styles.info}>{duration}</Title>
              </View>
              <View style={styles.row}>
                <Title size={16} color={Colors.text.darkGray} style={styles.info}>Type</Title>
                <Title size={16} color={Colors.text.darkGray} fontVariation="bold" style={styles.info}>Auto-renewal</Title>
              </View>
            </View>
            {
              loading ? (
                <Loading style={styles.loading} />
              ) : (
                <RoundedButton
                  bgColor={Colors.text.pink}
                  onPress={() => this.onSupportSubscribe(planId)}
                  style={styles.button}
                >
                  Support now
                </RoundedButton>
              )
            }
            <AppText style={styles.description} color={Colors.text.darkGray}>
              {trans('profile.package_description_ios', { amount, duration })}
              <AppText color={Colors.text.blue} onPress={() => this.redirect('https://skjutsgruppen.nu/privacy-policy')}>{trans('profile.privacy_policy')}</AppText>
              <AppText> {trans('global._and_')} </AppText>
              <AppText color={Colors.text.blue} onPress={() => this.redirect('https://skjutsgruppen.nu/participant-agreement')}>{trans('profile.participant_agreement')}</AppText>
            </AppText>
          </View>
        </ScrollView>
      </Wrapper>
    );
  }
}

PackageDetail.propTypes = {
  onBack: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  planId: PropTypes.string.isRequired,
  support: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

// export default PackageDetail;
export default compose(
  withSupport,
)(PackageDetail);
