import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#000',
  },
  inner: {
    height: 8,
    width: 8,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  pink: {
    backgroundColor: Colors.background.pink,
  },
  blue: {
    backgroundColor: Colors.background.pink,
  },
});

const RoundMarker = ({ type, color }) => {
  if (type === 'destination') {
    return (
      <View style={styles.wrapper}>
        <View style={styles.inner} />
      </View>
    );
  }

  return <View style={[styles.wrapper, color ? styles[color] : {}]} />;
};

RoundMarker.propTypes = {
  type: PropTypes.string,
  color: PropTypes.string,
};

RoundMarker.defaultProps = {
  type: null,
  color: null,
};

export default RoundMarker;
