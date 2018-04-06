import React from 'react';
import { StyleSheet, View, Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import TouchableHighlight from '@components/touchableHighlight';
import Radio from '@components/add/radio';
import { AppText } from '@components/utils/texts';

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
    borderRadius: 23,
  },
  radio: {
    marginLeft: 'auto',
  },
});

const ShareItem = ({
  imageSource,
  hasPhoto,
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
        {
          imageSource &&
          <View style={styles.imageContainer}>
            <Image source={imageSource} style={hasPhoto ? styles.image : {}} />
          </View>
        }
        <AppText>{label}</AppText>
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
  imageSource: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      uri: PropTypes.string,
    }),
  ]),
  hasPhoto: PropTypes.bool,
  readOnly: PropTypes.bool,
  selected: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
  color: PropTypes.string,
};

ShareItem.defaultProps = {
  key: null,
  imageSource: null,
  hasPhoto: false,
  readOnly: false,
  onPress: () => { },
  style: {},
  color: 'pink',
};

export default ShareItem;
