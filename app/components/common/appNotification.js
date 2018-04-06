import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.darkGray,
    paddingLeft: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  icon: {
    paddingHorizontal: 16,
  },
});

const AppNotification = ({ image, name, message, style, handleClose, type }) => {
  if (message === '') {
    return null;
  }

  let imgIcon = image;
  let imageStyle = { marginRight: 12 };

  if (type === 'image') {
    imgIcon = { uri: image };
    imageStyle = styles.image;
  }

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.content}>
        <Image source={imgIcon} style={imageStyle} />
        <View style={{ flex: 1 }}>
          {name !== '' && <AppText color={Colors.text.white} fontVariation="bold">{name}</AppText>}
          <AppText color={Colors.text.white}>{message}</AppText>
        </View>
      </View>
      <TouchableOpacity onPress={handleClose} style={styles.icon}>
        <Icon
          name="ios-close"
          size={45}
          style={{ color: '#fff' }}
        />
      </TouchableOpacity>
    </View>
  );
};

AppNotification.propTypes = {
  type: PropTypes.string,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  message: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
  handleClose: PropTypes.func,
};

AppNotification.defaultProps = {
  type: 'image',
  image: '',
  name: '',
  style: {},
  handleClose: () => { },
};

export default AppNotification;
