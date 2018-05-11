import React from 'react';
import { View, ScrollView, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background.cream,
  },
  container: {
    backgroundColor: Colors.background.cream,
    justifyContent: 'center',
    paddingVertical: 50,
  },
});

const Container = ({ children, style }) => (
  <View style={styles.wrapper}>
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.container, style]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  </View>
);

Container.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
};

Container.defaultProps = {
  style: {},
};

export default Container;
