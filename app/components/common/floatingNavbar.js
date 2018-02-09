import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '@theme/colors';
import { FloatingBackButton, ShareButton } from '@components/common';

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
  changeButton: {
    height: 30,
    minWidth: 115,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.pink,
    borderRadius: 15,
    paddingHorizontal: 12,
  },
  whiteText: {
    color: Colors.text.white,
    backgroundColor: 'transparent',
  },
  more: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  spacer: {
    width: 54,
  },
});

const FloatingNavbar = (
  {
    style,
    handleBack,
    title,
    showShare,
    showChange,
    showMore,
    handleShare,
    handleChangePress,
    handleShowMore,
    offset,
  }) =>
  (
    <View style={[styles.wrapper, style, offset && { top: offset }]}>
      <FloatingBackButton onPress={handleBack} />
      {
        (title !== '') &&
        <Text style={styles.title}>{title}</Text>
      }
      {
        showShare && <ShareButton onPress={handleShare} />
      }
      {
        showChange &&
        <TouchableOpacity style={styles.changeButton} onPress={handleChangePress}>
          <Text style={styles.whiteText}>{'Change'.toUpperCase()}</Text>
        </TouchableOpacity>
      }
      {
        showMore &&
        <TouchableOpacity style={styles.more} onPress={handleShowMore}>
          <Icon
            name="ios-more"
            size={48}
            style={{ color: '#fff' }}
          />
        </TouchableOpacity>
      }
      {
        (!showShare && !showChange && !showMore) && <View style={styles.spacer} />
      }
    </View>
  );

FloatingNavbar.propTypes = {
  style: View.propTypes.style,
  handleBack: PropTypes.func,
  showShare: PropTypes.bool,
  showChange: PropTypes.bool,
  showMore: PropTypes.bool,
  handleShare: PropTypes.func,
  handleChangePress: PropTypes.func,
  handleShowMore: PropTypes.func,
  title: PropTypes.string,
  offset: PropTypes.number,
};

FloatingNavbar.defaultProps = {
  style: {},
  handleBack: () => { },
  showShare: false,
  showChange: false,
  showMore: false,
  handleShare: () => { },
  handleChangePress: () => { },
  handleShowMore: () => { },
  title: '',
  offset: 0,
};

export default FloatingNavbar;
