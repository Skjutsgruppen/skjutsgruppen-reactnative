import React from 'react';
import {
  Platform,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import PropTypes from 'prop-types';

let KyeboardHandlingView;

if (Platform.OS === 'android') {
  KyeboardHandlingView = View;
} else {
  KyeboardHandlingView = KeyboardAvoidingView;
}

const KeyboardView = ({ children, ...props }) => (
  <KyeboardHandlingView {...props}>
    {children}
  </KyeboardHandlingView>
);

KeyboardView.propTypes = {
  children: PropTypes.node,
};

KeyboardView.defaultProps = {
  children: null,
};

export default KeyboardView;
