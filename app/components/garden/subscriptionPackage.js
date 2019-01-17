import React, { Component } from 'react';
import { StyleSheet, View, Modal, Alert, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { RoundedButton, Loading } from '@components/common';
import Colors from '@theme/colors';
import { Heading, Title } from '@components/utils/texts';
import { trans } from '@lang/i18n';
import { unsubscribePayment, showPayment } from '@services/support/purchase';
import { withSupport } from '@services/apollo/support';

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapper: {
    backgroundColor: Colors.background.mutedBlue,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 3,
  },
  content: {
    padding: 30,
    backgroundColor: Colors.background.fullWhite,
    marginTop: 30,
    marginHorizontal: 18,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 8,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});

class Package extends Component {
  state = {
    modalVisibility: false,
    loading: false,
  }

  onSupportPress = () => {
    const { currentlySupporting } = this.props;

    if (currentlySupporting) {
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
    } else {
      // this.handleModalVisibility(true);
      this.onSupportSubscribe();
    }
  }

  onSupportSubscribe = () => {
    const { support, planId, showAppNotification } = this.props;
    this.setState({ loading: true, statusMessage: '', modalVisibility: true });
    showPayment(planId, (error, purchaseDetail) => {
      if (error) {
        this.setState(
          { loading: false },
          showAppNotification(true, trans('profile.subscribe_failed')),
        );
        return;
      }

      support({ planId,
        transactionId: purchaseDetail.transactionId,
        receipt: purchaseDetail.transactionReceipt,
        originalTransactionId: purchaseDetail.originalTransactionIdentifier ?
          purchaseDetail.originalTransactionIdentifier : purchaseDetail.transactionId,
        device: Platform.OS })
        .then(() => {
          this.setState(
            { loading: false },
            showAppNotification(false, trans('profile.subscribed_success')),
          );
        })
        .catch(() => {
          this.setState(
            { loading: false },
            showAppNotification(true, trans('profile.subscribe_failed')),
          );
        });
    });
  }

  handleModalVisibility = visible => this.setState({ modalVisibility: visible });

  render() {
    const { loading } = this.state;
    const {
      noBackgroud,
      elevation,
      info,
      title,
      amountPerMonth,
    } = this.props;

    let transparentStyle = {};
    transparentStyle = noBackgroud && { backgroundColor: 'transparent' };
    return (
      <View style={[
        styles.wrapper, { elevation }, { shadowOpacity: noBackgroud ? 0 : 0.1 }, transparentStyle,
      ]}
      >
        <View style={styles.content}>
          <View style={styles.flexRow}>
            <RoundedButton
              bgColor={Colors.text.pink}
              onPress={this.onSupportPress}
              style={{ maxWidth: 200 }}
            >
              {title}
            </RoundedButton>
            <View style={{ marginLeft: 12 }}>
              <Heading centered color={Colors.text.yellowGreen}>{amountPerMonth}kr</Heading>
            </View>
          </View>
          {
            info !== '' && info && <Title size={15} color={Colors.text.gray} style={{ marginTop: 30 }}>
              {info}
            </Title>
          }
        </View>
        <Modal transparent visible={loading} >
          <Loading style={styles.center} />
        </Modal>
      </View>
    );
  }
}

Package.propTypes = {
  noBackgroud: PropTypes.bool,
  elevation: PropTypes.number.isRequired,
  amountPerMonth: PropTypes.string.isRequired,
  info: PropTypes.string,
  planId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  currentlySupporting: PropTypes.string,
  support: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  showAppNotification: PropTypes.func.isRequired,
};

Package.defaultProps = {
  noBackgroud: false,
  info: null,
  currentlySupporting: null,
};

export default withSupport(Package);
