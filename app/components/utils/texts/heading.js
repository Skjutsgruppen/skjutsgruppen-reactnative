import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
} from 'react-native';

const baseStyles = StyleSheet.create({
  text: {
    fontFamily: 'AvenirLTStd-Book',
    fontSize: 24,
    backgroundColor: 'transparent',
  },
  semibold: {
    fontFamily: 'AvenirLTStd-Medium',
  },
  bold: {
    fontFamily: 'AvenirLTStd-Heavy',
  },
  italic: {
    fontFamily: 'AvenirLTStd-Book',
  },
});

const Heading = ({ style, fontVariation, size, color, centered, children, ...props }) => {
  let newStyle;
  const fontSize = size ? { fontSize: size } : {};
  const textColor = color ? { color } : {};
  const fontStyle = fontVariation ? baseStyles[fontVariation] : {};
  const textAlign = centered ? { textAlign: 'center' } : {};

  if (Array.isArray(style)) {
    newStyle = [baseStyles.text, fontStyle, ...style, fontSize, textColor, textAlign];
  } else {
    newStyle = [baseStyles.text, fontStyle, style, fontSize, textColor, textAlign];
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
  centered: PropTypes.bool,
};

Heading.defaultProps = {
  style: {},
  fontVariation: 'bold',
  size: null,
  color: null,
  centered: false,
};

export default Heading;
