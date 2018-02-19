import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  offerType: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
  },
  pink: {
    backgroundColor: Colors.background.pink,
  },
  blue: {
    backgroundColor: Colors.background.blue,
  },
});

const TripTypePill = ({ color, label }) => (
  <View style={[styles.offerType, styles[color]]}>
    <AppText
      color={Colors.text.white}
      size={12}
    >
      {label}
    </AppText>
  </View>
);

TripTypePill.propTypes = {
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default TripTypePill;
