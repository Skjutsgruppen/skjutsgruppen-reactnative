import React, { Component } from 'react';
import { StyleSheet, View, Modal, Text } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';

import { RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import { Heading, Title } from '@components/utils/texts';
import { trans } from '@lang/i18n';
import { withSupport, withMySupport } from '@services/apollo/support';
import PackageDetail from '@components/garden/packageDetail';

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
  crown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  crownOne: {
    height: 14,
    borderRadius: 4,
    width: 4,
    top: 4,
    backgroundColor: Colors.background.yellow,
    transform: [
      { rotate: '-45deg' },
    ],
  },
  crownTwo: {
    height: 14,
    borderRadius: 4,
    width: 4,
    top: -2,
    backgroundColor: Colors.background.yellow,
  },
  crownThree: {
    height: 14,
    borderRadius: 4,
    width: 4,
    top: 4,
    backgroundColor: Colors.background.yellow,
    transform: [
      { rotate: '45deg' },
    ],
  },
});

class Package extends Component {
  state = {
    detailView: false,
  };

  handleDetailView = (visible) => { this.setState({ detailView: visible }); };

  render() {
    const { detailView } = this.state;
    const {
      planId,
      noBackground,
      elevation,
      info,
      amount,
      isHelpMore,
      durationLabel,
    } = this.props;

    let transparentStyle = {};
    transparentStyle = noBackground && { backgroundColor: 'transparent' };
    return (
      <View style={[
        styles.wrapper, { elevation }, { shadowOpacity: noBackground ? 0 : 0.1 }, transparentStyle,
      ]}
      >
        <View style={styles.content}>
          <View style={styles.flexRow}>
            <RoundedButton
              bgColor={Colors.text.pink}
              onPress={() => { this.handleDetailView(true); }}
              style={{ maxWidth: 200 }}
            >
              {`${trans('profile.support')} ${durationLabel}`}
            </RoundedButton>
            <View style={{ marginLeft: 12 }}>
              <View>
                { planId === '10_kr_per_month' &&
                  <View style={styles.crown}>
                    <View style={styles.crownOne} />
                    <View style={styles.crownTwo} />
                    <View style={styles.crownThree} />
                  </View>
                }
              </View>
              <Heading centered color={Colors.text.yellowGreen}>{amount} kr</Heading>
            </View>
          </View>
          {
            info !== '' && info && <Title size={15} color={Colors.text.gray} style={{ marginTop: 30 }}>
              {info}
            </Title>
          }
        </View>
        <Modal visible={detailView} onRequestClose={() => { this.handleDetailView(true); }} animationType="slide">
          <PackageDetail
            onBack={() => { this.handleDetailView(false); }}
            planId={planId}
            amount={amount}
            durationLabel={durationLabel}
            pageTitle={isHelpMore ? trans('profile.logo_and_brand') : trans('profile.you_are_awesome')}
            featureText={isHelpMore ? trans('profile.you_get') : trans('profile.besides_helping_your_movement')}
            headingText={isHelpMore ? trans('profile.show_your_logo_and_brand_in_the_app', { amount, durationLabel }) : trans('profile.support_us_with', { amount, durationLabel })}
            helpMore={isHelpMore}
          />
        </Modal>
      </View>
    );
  }
}

Package.propTypes = {
  planId: PropTypes.string.isRequired,
  noBackground: PropTypes.bool,
  elevation: PropTypes.number.isRequired,
  amount: PropTypes.string.isRequired,
  info: PropTypes.string,
  isHelpMore: PropTypes.bool,
  durationLabel: PropTypes.string.isRequired,
};

Package.defaultProps = {
  noBackground: false,
  info: null,
  isHelpMore: false,
};

export default compose(withSupport, withMySupport)(Package);
