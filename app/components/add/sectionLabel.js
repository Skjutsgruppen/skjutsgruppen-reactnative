import React from 'react';
import { StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';
import { Heading } from '@components/utils/texts';

const styles = StyleSheet.create({
  label: {
    marginBottom: 12,
    marginHorizontal: 20,
    marginTop: 32,
  },
});

const SectionLabel = ({ label, color, style }) => (
  <Heading
    size={16}
    style={[styles.label, style]}
    fontVariation="bold"
    color={color !== null ? color : Colors.text.pink}
  >
    {label}
  </Heading>
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
