import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  round: {
    width: 38,
    height: 38,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: '#ffffff',
    justifyContent: 'center',
    marginBottom: 6,
  },
  active: {
    backgroundColor: '#00a4f1',
  },
  disabled: {
    backgroundColor: '#fff',
  },
  complete: {
    backgroundColor: '#00ab4a',
  },
  activeText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  text: {
    color: '#777777',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
  },
});

const Tab = ({ label, active, disabled, complete }) => (
  <View style={styles.wrapper}>
    <View style={[
      styles.round,
      disabled && styles.disabled,
      complete && styles.complete,
      active && styles.active,
    ]}
    />
    <Text style={
      [
        styles.text,
        active && styles.activeText,
      ]
    }
    >{label}</Text>
  </View>
);

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  complete: PropTypes.bool.isRequired,
};

export default Tab;
