import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '@theme';
import { AppText } from '@components/utils/texts';

const cardHeight = Dimensions.get('window').height * 0.3;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    height: cardHeight,
    borderRadius: 12,
    backgroundColor: Colors.background.fullWhite,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  image: {
    height: cardHeight,
    width: '100%',
    resizeMode: 'cover',
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
    width: '100%',
    padding: 12,
  },
});

const GroupItem = ({ onPress, imageURI, title, colorOverlay }) => {
  const gradientColors = colorOverlay ? Gradients.transparentPink
    : ['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.35)'];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.wrapper}>
        <Image source={{ uri: imageURI }} style={styles.image} />
        <LinearGradient
          start={{ x: 0.0, y: 0.5 }}
          end={{ x: 1.0, y: 0.5 }}
          colors={gradientColors}
          style={styles.overlay}
        >
          <AppText centered fontVaritaion="semibold" color={Colors.text.white}>{title}</AppText>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

GroupItem.propTypes = {
  onPress: PropTypes.func.isRequired,
  imageURI: PropTypes.string,
  title: PropTypes.string,
  colorOverlay: PropTypes.bool,
};

GroupItem.defaultProps = {
  imageURI: null,
  title: null,
  colorOverlay: false,
};

export default GroupItem;
