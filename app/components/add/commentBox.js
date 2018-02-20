import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '@theme';
import { GlobalStyles } from '@theme/styles';

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 20,
  },
  label: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  textarea: {
    height: 80,
    backgroundColor: Colors.background.fullWhite,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
    padding: 12,
  },
});

const CommentBox = ({ label, style, inputStyle, value, onChangeText, labelColor, ...props }) => (
  <View style={[styles.wrapper, style]}>
    <Text style={[styles.label, GlobalStyles.TextStyles.bold, { color: labelColor }]}>
      {label}
    </Text>
    <TextInput
      style={[styles.textarea, inputStyle]}
      multiline
      placeholder="Write"
      numberOfLines={4}
      onChangeText={onChangeText}
      underlineColorAndroid="transparent"
      defaultValue={value}
      {...props}
    />
  </View>
);

CommentBox.propTypes = {
  label: PropTypes.string.isRequired,
  info: PropTypes.string,
  style: View.propTypes.style,
  inputStyle: TextInput.propTypes.style,
  value: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  labelColor: PropTypes.string,
};
CommentBox.defaultProps = {
  info: null,
  style: {},
  inputStyle: {},
  value: '',
  labelColor: Colors.text.pink,
};

export default CommentBox;
