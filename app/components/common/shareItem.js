import React from 'react';
import { StyleSheet, View, Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import TouchableHighlight from '@components/touchableHighlight';
import Radio from '@components/add/radio';
import { AppText } from '@components/utils/texts';
import Avatar from '@components/common/avatar';

const styles = StyleSheet.create({
  shareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  imageContainer: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    marginRight: 16,
  },
  image: {
    height: 46,
    width: 46,
  },
  radio: {
    marginLeft: 'auto',
  },
});

const ShareItem = ({
  imageURI,
  isStatic,
  isSupporter,
  readOnly,
  selected,
  label,
  onPress,
  style,
  color,
}) =>
  (
    <TouchableHighlight onPress={onPress}>
      <View style={[styles.shareItem, style]}>
        {imageURI &&
        <View style={styles.imageContainer}>
          {
            isStatic ? (
              <Image source={imageURI} style={styles.image} />
            ) : (
              <Avatar size={48} imageURI={imageURI} isSupporter={isSupporter} />
            )
          }
        </View>
        }
        <AppText style={{ flex: 1, marginRight: 16 }}>{label}</AppText>
        <Radio
          active={selected}
          readOnly={readOnly}
          color={color}
          onPress={onPress}
          style={styles.radio}
        />
      </View>
    </TouchableHighlight>
  );

ShareItem.propTypes = {
  imageURI: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  isStatic: PropTypes.bool,
  isSupporter: PropTypes.bool,
  readOnly: PropTypes.bool,
  selected: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
  color: PropTypes.string,
};

ShareItem.defaultProps = {
  key: null,
  imageURI: null,
  isStatic: false,
  isSupporter: false,
  readOnly: false,
  onPress: () => { },
  style: {},
  color: 'pink',
};

export default ShareItem;
