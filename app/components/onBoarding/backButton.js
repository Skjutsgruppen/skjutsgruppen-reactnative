import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';
import Colors from '@theme/colors';
import AppText from '@components/utils/texts/appText';

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginBottom: 50,
  },
  leftAligned: {
    paddingHorizontal: 0,
    alignSelf: 'flex-start',
  },
});

const BackButton = ({ leftAligned, onPress }) => (
  <AppText
    centered
    color={Colors.text.gray}
    onPress={() => onPress()}
    style={[styles.backButton, leftAligned ? styles.leftAligned : {}]}
  >{trans('onboarding.back')}</AppText>
);

BackButton.propTypes = {
  leftAligned: PropTypes.bool,
  onPress: PropTypes.func,
};

BackButton.defaultProps = {
  leftAligned: false,
  onPress: null,
};

export default BackButton;

