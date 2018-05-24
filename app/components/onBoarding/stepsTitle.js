import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';
import Title from '@components/utils/texts/title';

const styles = StyleSheet.create({
  title: {
    lineHeight: 36,
    marginVertical: 16,
  },
});

const StepsTitle = ({ children, style }) => (
  <View style={style}>
    <Title size={24} color={Colors.text.gray} style={styles.title}>
      {children}
    </Title>
  </View>
);

StepsTitle.propTypes = {
  children: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

StepsTitle.defaultProps = {
  style: {},
};

export default StepsTitle;

