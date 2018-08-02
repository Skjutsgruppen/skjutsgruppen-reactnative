import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
} from 'react-native';

const baseStyles = StyleSheet.create({
  text: {
    fontFamily: 'AvenirLTStd-Black',
    fontSize: 24,
    backgroundColor: 'transparent',
  },
});

const Heading = ({ style, size, color, centered, children, ...props }) => {
  let newStyle;
  const fontSize = size ? { fontSize: size } : {};
  const textColor = color ? { color } : {};
  const textAlign = centered ? { textAlign: 'center' } : {};

  if (Array.isArray(style)) {
    newStyle = [baseStyles.text, ...style, fontSize, textColor, textAlign];
  } else {
    newStyle = [baseStyles.text, style, fontSize, textColor, textAlign];
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
  size: PropTypes.number,
  color: PropTypes.string,
  centered: PropTypes.bool,
};

Heading.defaultProps = {
  style: {},
  size: null,
  color: null,
  centered: false,
};

export default Heading;
