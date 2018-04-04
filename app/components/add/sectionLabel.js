import React from 'react';
import { StyleSheet, Text, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';
import { GlobalStyles } from '@theme/styles';

const styles = StyleSheet.create({
  label: {
    marginBottom: 12,
    marginHorizontal: 20,
    marginTop: 12,
  },
});

const SectionLabel = ({ label, color, style }) => (
  <Text style={[
    styles.label,
    GlobalStyles.TextStyles.bold,
    style,
    { color: color !== null ? color : Colors.text.pink },
  ]}
  >
    {label}
  </Text>
);

SectionLabel.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  style: ViewPropTypes.style,
};

SectionLabel.defaultProps = {
  color: Colors.text.pink,
  style: {},
};

export default SectionLabel;
