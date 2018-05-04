import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import { Heading, Title } from '@components/utils/texts';

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

const Package = ({ noBackgroud, elevation, durationLabel, monthlyAmount, info }) => {
  let transparentStyle = {};
  transparentStyle = noBackgroud && { backgroundColor: 'transparent' };
  return (
    <View style={[
      styles.wrapper, { elevation }, { shadowOpacity: noBackgroud ? 0 : 0.1 }, transparentStyle,
    ]}
    >
      <View style={styles.content}>
        <View style={styles.flexRow}>
          <RoundedButton bgColor={Colors.text.pink} onPress={() => {}} style={{ maxWidth: 200 }}>
            {durationLabel}
          </RoundedButton>
          <View style={{ marginLeft: 12 }}>
            <Heading centered color={Colors.text.yellowGreen}>{`${monthlyAmount}kr`}</Heading>
            <Heading size={13} centered color={Colors.text.yellowGreen}>per month</Heading>
          </View>
        </View>
        {
          info !== '' && info && <Title size={15} color={Colors.text.gray} style={{ marginTop: 30 }}>
            {info}
          </Title>
        }
      </View>
    </View>
  );
};

Package.propTypes = {
  noBackgroud: PropTypes.bool,
  elevation: PropTypes.number.isRequired,
  durationLabel: PropTypes.string.isRequired,
  monthlyAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  info: PropTypes.string,
};

Package.defaultProps = {
  noBackgroud: false,
  info: null,
};

export default Package;
