import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import Map from '@assets/icons/icon_map.png';
import ChevronRight from '@assets/icons/icon_chevron_right.png';
import BackButton from '@components/common/backButton';

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
  mapWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  map: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  chevron: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginLeft: 8,
  },
  spacer: {
    width: 54,
  },
});

const NavBar = ({ style, handleBack, title, onMapPress }) => (
  <View style={[style, styles.wrapper]}>
    <BackButton onPress={handleBack} />
    {
      (title !== '') &&
      <Text style={styles.title}>{title}</Text>
    }
    {
      onMapPress ?
        <TouchableOpacity style={styles.mapWrapper} onPress={onMapPress}>
          <Image source={Map} style={styles.map} />
          <Image source={ChevronRight} style={styles.chevron} />
        </TouchableOpacity>
        :
        <View style={styles.spacer} />
    }
  </View>
);

NavBar.propTypes = {
  style: ViewPropTypes.style,
  handleBack: PropTypes.func,
  title: PropTypes.string,
  onMapPress: PropTypes.func,
};

NavBar.defaultProps = {
  style: {},
  handleBack: () => { },
  onMapPress: null,
  title: '',
  map: false,
};

export default NavBar;
