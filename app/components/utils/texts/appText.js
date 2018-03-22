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
    fontFamily: 'sfuiTextRegular',
    fontSize: 16,
  },
  textIOS: {
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  semibold: {
    fontFamily: 'sfuiTextSemibold',
  },
  bold: {
    fontFamily: 'sfuiTextBold',
  },
  italic: {
    fontFamily: 'sfuiTextRegularItalic',
  },
});

const AppText = ({ style, fontVariation, size, color, children, ...props }) => {
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

AppText.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.shape(), PropTypes.array, PropTypes.number]),
  fontVariation: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};

AppText.defaultProps = {
  style: {},
  fontVariation: null,
  size: 16,
  color: Colors.text.black,
};
export default AppText;
