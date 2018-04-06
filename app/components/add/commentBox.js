import React from 'react';
import { StyleSheet, View, TextInput, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { Colors } from '@theme';
import { AppText, Heading } from '@components/utils/texts';

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
    fontFamily: 'SFUIText-Regular',
    backgroundColor: Colors.background.fullWhite,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  singleLined: {
    paddingVertical: 30,
  },
});

const CommentBox = (
  { label, style, inputStyle, value, onChangeText, showTextCount, labelColor, multiline, ...props },
) =>
  (
    <View style={[styles.wrapper, style]}>
      <Heading size={16} color={labelColor} fontVariation="bold" style={styles.label}>
        {label}
      </Heading>
      {
        multiline && (
          <TextInput
            style={[styles.textarea, inputStyle]}
            multiline
            placeholder="Write"
            numberOfLines={4}
            onChangeText={onChangeText}
            underlineColorAndroid="transparent"
            placeholderTextColor={Colors.text.gray}
            defaultValue={value}
            {...props}
          />
        )
      }
      {
        !multiline && (
          <TextInput
            style={[styles.textarea, styles.singleLined, inputStyle]}
            placeholder="Write"
            numberOfLines={1}
            onChangeText={onChangeText}
            underlineColorAndroid="transparent"
            placeholderTextColor={Colors.text.gray}
            defaultValue={value}
            {...props}
          />
        )
      }
      {showTextCount && <AppText style={{ color: Colors.text.gray, textAlign: 'right', paddingHorizontal: 20 }}>{value.length}/22</AppText>}
    </View>
  );

CommentBox.propTypes = {
  label: PropTypes.string.isRequired,
  info: PropTypes.string,
  style: ViewPropTypes.style,
  inputStyle: TextInput.propTypes.style,
  value: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  labelColor: PropTypes.string,
  showTextCount: PropTypes.bool,
  multiline: PropTypes.bool,
};
CommentBox.defaultProps = {
  info: null,
  style: {},
  inputStyle: {},
  value: '',
  labelColor: Colors.text.pink,
  showTextCount: false,
  multiline: true,
};

export default CommentBox;
