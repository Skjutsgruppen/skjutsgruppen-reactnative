import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import Colors from '@theme/colors';

const baseStyles = StyleSheet.create({
  textAndroid: {
    fontFamily: 'avenirRegular',
    fontSize: 24,
  },
  textIOS: {
    fontSize: 24,
    backgroundColor: 'transparent',
  },
  semibold: {
    fontFamily: 'avenirSemibold',
  },
  bold: {
    fontFamily: 'avenirBold',
  },
  italic: {
    fontFamily: 'avenir',
  },
});

const Heading = ({ style, fontVariation, size, color, children, ...props }) => {
  let newStyle;
  let fontStyle;
  const extraStyle = { fontSize: size, color };

  if (Platform.OS === 'android') {
    fontStyle = fontVariation ? baseStyles[fontVariation] : {};
    if (Array.isArray(style)) {
      newStyle = [baseStyles.textAndroid, fontStyle, ...style, extraStyle];
    } else {
      newStyle = [baseStyles.textAndroid, fontStyle, style, extraStyle];
    }
  } else if (Platform.OS === 'ios') {
    newStyle = [baseStyles.textIOS, style];
  }

  return (
    <Text {...props} style={newStyle}>
      {children}
    </Text>
  );
};

Heading.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.shape(), PropTypes.array, PropTypes.number]),
  fontVariation: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};

Heading.defaultProps = {
  style: {},
  fontVariation: 'bold',
  size: 24,
  color: Colors.text.black,
};

export default Heading;
