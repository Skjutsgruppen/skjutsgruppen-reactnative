import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
  Platform,
} from 'react-native';

const baseStyles = StyleSheet.create({
  text: {
    fontFamily: 'SFUIDisplay-Regular',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  semibold: {
    fontFamily: Platform.OS === 'ios' ? 'SFUIDisplay-Semibold' : 'SFUIDisplay-Semi-Bold',
  },
  bold: {
    fontFamily: 'SFUIDisplay-Bold',
  },
  italic: {
    fontFamily: 'SFUIDisplay-Regular',
  },
});

const Title = ({ style, fontVariation, size, color, centered, children, ...props }) => {
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

  if (children !== '' && children) {
    return (<Text {...props} style={newStyle}>
      {children}
    </Text>);
  }

  return null;
};

Title.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.shape(), PropTypes.array, PropTypes.number]),
  fontVariation: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  centered: PropTypes.bool,
};

Title.defaultProps = {
  style: {},
  fontVariation: null,
  size: null,
  color: null,
  centered: false,
};

export default Title;
