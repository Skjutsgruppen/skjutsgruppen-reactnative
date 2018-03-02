import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  divider: {
    marginBottom: 24,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
  },
});

const HorizontalDivider = () => <View style={styles.divider} />;

export default HorizontalDivider;
