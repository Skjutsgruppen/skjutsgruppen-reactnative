import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
} from 'react-native';

const baseStyles = StyleSheet.create({
  text: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  semibold: {
    fontFamily: 'SFUIText-SemiBold',
  },
  bold: {
    fontFamily: 'SFUIText-Bold',
  },
  italic: {
    fontFamily: 'SFUIText-RegularItalic',
  },
});

const AppText = ({ style, fontVariation, size, color, centered, children, ...props }) => {
  let newStyle;
  const fontStyle = fontVariation ? baseStyles[fontVariation] : {};
  const fontSize = size ? { fontSize: size } : {};
  const textColor = color ? { color } : {};
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

AppText.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.shape(), PropTypes.array, PropTypes.number]),
  fontVariation: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  centered: PropTypes.bool,
};

AppText.defaultProps = {
  style: {},
  fontVariation: null,
  size: null,
  color: null,
  centered: false,
};
export default AppText;
