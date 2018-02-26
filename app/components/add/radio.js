import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import CheckIconPink from '@assets/icons/ic_checked_pink.png';
import CheckIconBlue from '@assets/icons/ic_checked_blue.png';
import CheckIconGray from '@assets/icons/ic_checked_gray.png';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#999',
    backgroundColor: '#fff',
  },
  active: {
    borderWidth: 0,
    borderColor: 'transparent',
  },
  label: {
    marginRight: 40,
    marginLeft: 20,
  },
});

const Radio = ({ active, readOnly, color, label, onPress, style }) => {
  if (readOnly) {
    return (
      <View style={[styles.wrapper, style]}>
        <Image source={CheckIconGray} />
        {
          label &&
          <Text style={styles.label}>{label}</Text>
        }
      </View>
    );
  }

  let source = CheckIconPink;

  if (color === 'blue') {
    source = CheckIconBlue;
  }

  return (
    <View style={[styles.wrapper, style]}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.dot, active ? styles.active : {}]}>
          {
            active &&
            <Image source={source} />
          }
        </View>
      </TouchableWithoutFeedback>
      {
        label &&
        <Text style={styles.label}>{label}</Text>
      }
    </View>
  );
};

Radio.propTypes = {
  active: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool,
  color: PropTypes.string,
  label: PropTypes.string,
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
};
Radio.defaultProps = {
  readOnly: false,
  color: null,
  label: null,
  onPress: () => { },
  style: {},
};

export default Radio;
