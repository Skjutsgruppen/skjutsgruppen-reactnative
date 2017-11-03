import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import BackButton from './backButton';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    color: Colors.text.purple,
  },
  spacer: {
    width: 54,
  },
});

const NavBar = ({ style, handleBack, title }) => (
  <View style={[style, styles.wrapper]}>
    <BackButton onPress={handleBack} />
    {
      (title !== '') &&
        <Text style={styles.title}>{title}</Text>
    }
    <View style={styles.spacer} />
  </View>
);

NavBar.propTypes = {
  style: View.propTypes.style,
  handleBack: PropTypes.func,
  title: PropTypes.string,
};

NavBar.defaultProps = {
  style: {},
  handleBack: () => {},
  title: '',
};

export default NavBar;
