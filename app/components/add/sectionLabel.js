import React from 'react';
import { StyleSheet, Text } from 'react-native';
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

const SectionLabel = ({ label, color }) => (
  <Text style={[
    styles.label,
    GlobalStyles.TextStyles.bold,
    { color: color !== null ? color : Colors.text.pink },
  ]}
  >
    {label}
  </Text>
);

SectionLabel.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
};

SectionLabel.defaultProps = {
  color: Colors.text.pink,
};

export default SectionLabel;
