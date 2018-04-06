import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import CheckIcon from '@assets/icons/icon_check.png';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  round: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 8,
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
    backgroundColor: '#fff',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
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
    >
      {
        complete &&
          <Image source={CheckIcon} style={styles.icon} />
      }
    </View>
    <AppText
      size={11}
      centered
      fontVarition={active ? 'bold' : null}
      color={active ? Colors.text.darkgray : Colors.text.gray}
    >{label}</AppText>
  </View>
);

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  complete: PropTypes.bool.isRequired,
};

export default Tab;
