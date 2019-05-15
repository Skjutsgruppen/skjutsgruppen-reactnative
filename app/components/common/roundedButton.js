import React from 'react';
import { View, StyleSheet, Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import TouchableHighlight from '@components/touchableHighlight';
import { Title } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 42,
    borderRadius: 24,
    overflow: 'hidden',
  },
  button: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  icon: {
    position: 'absolute',
    left: 24,
    top: 9,
  },
  label: {
    flex: 1,
  },
});

const RoundedButton = ({ children, style, onPress, bgColor, textColor, icon, textStyle, ...props }) => (
  <View style={[styles.wrapper, style]}>
    <TouchableHighlight
      onPress={onPress}
      {...props}
      style={styles.button}
    >
      <View style={[styles.content, { backgroundColor: bgColor }]}>
        {
          icon && icon !== '' && <Image source={icon} style={styles.icon} />
        }
        <Title
          centered
          fontVariation="bold"
          style={[
            styles.label,
            textStyle,
            { color: textColor },
          ]}
        >{children}</Title>
      </View>
    </TouchableHighlight>
  </View>
);

RoundedButton.propTypes = {
  children: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
  onPress: PropTypes.func.isRequired,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  icon: PropTypes.number,
};

RoundedButton.defaultProps = {
  style: {},
  bgColor: '#333',
  textColor: '#fff',
  icon: null,
  textStyle: {},
};

export default RoundedButton;
