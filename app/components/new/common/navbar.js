import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
// import { BackButton, ShareButton } from '@components/new/common';
import BackButton from './backButton';
import ShareButton from './shareButton';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.text.purple,
    backgroundColor: 'transparent',
  },
  spacer: {
    width: 54,
  },
});

const Navbar = ({ style, handleBack, title, showShare, handleShare }) => (
  <View style={[styles.wrapper, style]}>
    <BackButton onPress={handleBack} />
    {
      (title !== '') &&
      <Text style={styles.title}>{title}</Text>
    }
    {
      showShare ?
        <ShareButton onPress={handleShare} />
        :
        <View style={styles.spacer} />
    }
  </View>
);

Navbar.propTypes = {
  style: View.propTypes.style,
  handleBack: PropTypes.func,
  showShare: PropTypes.bool,
  handleShare: PropTypes.func,
  title: PropTypes.string,
};

Navbar.defaultProps = {
  style: {},
  handleBack: () => { },
  showShare: false,
  handleShare: () => { },
  title: '',
};

export default Navbar;
