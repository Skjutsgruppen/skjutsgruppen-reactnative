import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: Colors.background.mutedBlue,
    marginBottom: 6,
  },
});

const StickySectionHeader = ({ label }) => (
  <View style={styles.wrapper}>
    <AppText color={Colors.text.blue}>{label}</AppText>
  </View>
);

StickySectionHeader.propTypes = {
  label: PropTypes.string.isRequired,
};

export default StickySectionHeader;
