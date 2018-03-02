import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: Colors.background.mutedBlue,
    marginBottom: 6,
  },
  text: {
    color: Colors.text.blue,
  },
});

const StickySectionHeader = ({ label }) => (
  <View style={styles.wrapper}>
    <Text style={styles.text}>{label}</Text>
  </View>
);

StickySectionHeader.propTypes = {
  label: PropTypes.string.isRequired,
};

export default StickySectionHeader;
