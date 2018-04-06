import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '@theme';
import { Heading } from '@components/utils/texts';

const cardHeight = Dimensions.get('window').height * 0.25;
const cardWidth = Dimensions.get('window').width * 0.7;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    width: cardWidth,
    height: cardHeight,
    borderRadius: 16,
    backgroundColor: Colors.background.fullWhite,
    marginLeft: 20,
    marginRight: 10,
    marginVertical: 30,
    elevation: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  image: {
    height: cardHeight,
    width: cardWidth,
    resizeMode: 'cover',
    borderRadius: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.text.white,
    textAlign: 'center',
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: cardHeight,
    width: cardWidth,
    padding: 12,
    borderRadius: 16,
  },
});

const GroupItem = ({ style, onPress, imageURI, title, colorOverlay }) => {
  const gradientColors = colorOverlay ? Gradients.transparentPink
    : ['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.25)'];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.wrapper, style]}>
        <Image source={imageURI} style={styles.image} />
        <LinearGradient
          start={{ x: 0.0, y: 0.5 }}
          end={{ x: 1.0, y: 0.5 }}
          colors={gradientColors}
          style={styles.overlay}
        >
          <Heading size={16} centered fontFariation="bold" color={Colors.text.white}>{title}</Heading>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

GroupItem.propTypes = {
  style: ViewPropTypes.style,
  onPress: PropTypes.func.isRequired,
  imageURI: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(), PropTypes.number]).isRequired,
  title: PropTypes.string,
  colorOverlay: PropTypes.bool,
};

GroupItem.defaultProps = {
  style: {},
  imageURI: null,
  title: null,
  colorOverlay: false,
};

export default GroupItem;
