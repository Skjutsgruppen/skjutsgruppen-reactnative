import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  radio: {
    height: 40,
    width: 40,
    borderRadius: 24,
    borderWidth: 8,
    borderColor: '#ffffff',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#777777',
    marginTop: 8,
    textAlign: 'center',
  },
});

const Radio = ({ onPress, label, checked }) => (
  <View style={styles.wrapper}>
    <TouchableWithoutFeedback
      onPress={onPress}
    >
      <View style={[styles.radio, { backgroundColor: checked ? '#1db0ed' : '#ffffff' }]} />
    </TouchableWithoutFeedback>
    <AppText style={styles.label}>{label}</AppText>
  </View>
);

Radio.propTypes = {
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
};

export default Radio;
