import React, { Component } from 'react';
import { StyleSheet, View, Modal, Alert } from 'react-native';
import PropTypes from 'prop-types';

import { RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import { Heading, Title } from '@components/utils/texts';
import { trans } from '@lang/i18n';
import PackageDetail from '@screens/garden/packageDetail';
import { unsubscribePayment } from '@services/support/purchase';

const styles = StyleSheet.create({
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
  }

  onSupportPress = () => {
    const { currentlySupporting } = this.props;

    if (currentlySupporting && currentlySupporting !== '') {
      Alert.alert(
        null,
        trans('profile.currently_subscribed'),
        [
          {
            text: trans('profile.unsubscribe_now'),
            onPress: () => unsubscribePayment(),
          },
          { text: trans('global.cancel'), style: 'cancel' },
        ],
      );
    } else {
      this.handleModalVisibility(true);
    }
  }

  handleModalVisibility = visible => this.setState({ modalVisibility: visible });

  render() {
    const { modalVisibility } = this.state;
    const {
      noBackgroud,
      elevation,
      durationLabel,
      amount,
      info,
      planId,
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
              <Heading size={13} centered color={Colors.text.yellowGreen}>per month</Heading>
            </View>
          </View>
          {
            info !== '' && info && <Title size={15} color={Colors.text.gray} style={{ marginTop: 30 }}>
              {info}
            </Title>
          }
        </View>
        <Modal visible={modalVisibility} animationType="slide">
          <PackageDetail title={title} amount={amount} duration={durationLabel} planId={planId} onBack={() => this.handleModalVisibility(false)} />
        </Modal>
      </View>
    );
  }
}

Package.propTypes = {
  noBackgroud: PropTypes.bool,
  elevation: PropTypes.number.isRequired,
  durationLabel: PropTypes.string.isRequired,
  amountPerMonth: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  info: PropTypes.string,
  planId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  currentlySupporting: PropTypes.string,
};

Package.defaultProps = {
  noBackgroud: false,
  info: null,
  currentlySupporting: null,
};

export default Package;
