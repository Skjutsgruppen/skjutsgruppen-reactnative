import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { AppText } from '@components/utils/texts';

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

const Radio = ({ active, readOnly, color, label, onPress, style, size }) => {
  const sizeStyle = size ? { width: size, height: size } : {};
  if (readOnly) {
    return (
      <View style={[styles.wrapper, style]}>
        <Image source={CheckIconGray} style={sizeStyle} />
        {
          label &&
          <AppText style={styles.label}>{label}</AppText>
        }
      </View>
    );
  }

  let source = CheckIconPink;

  if (color === 'blue') {
    source = CheckIconBlue;
  }

  if (color === 'gray') {
    source = CheckIconGray;
  }

  return (
    <View style={[styles.wrapper, style]}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.dot, sizeStyle, active ? styles.active : {}]}>
          {
            active &&
            <Image source={source} style={sizeStyle} />
          }
        </View>
      </TouchableWithoutFeedback>
      {
        label &&
        <AppText style={styles.label}>{label}</AppText>
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
  size: PropTypes.number,
};
Radio.defaultProps = {
  readOnly: false,
  color: null,
  label: null,
  onPress: () => { },
  style: {},
  size: null,
};

export default Radio;
