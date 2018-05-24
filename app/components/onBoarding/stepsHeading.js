import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';
import Heading from '@components/utils/texts/heading';

const styles = StyleSheet.create({
  header: {
    lineHeight: 46,
    marginTop: 24,
  },
});

const Stepsheading = ({ children, style }) => (
  <View style={style}>
    <Heading size={32} color={Colors.text.pink} style={styles.header}>
      {children}
    </Heading>
  </View>
);

Stepsheading.propTypes = {
  children: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

Stepsheading.defaultProps = {
  style: {},
};

export default Stepsheading;

