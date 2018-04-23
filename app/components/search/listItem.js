import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import Date from '@components/date';
import { FEED_TYPE_OFFER, FEED_TYPE_WANTED } from '@config/constant';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: Colors.background.fullWhite,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 18,
  },
  indicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    position: 'absolute',
    top: 12,
    left: 46,
  },
  pink: {
    backgroundColor: Colors.background.pink,
  },
  blue: {
    backgroundColor: Colors.background.blue,
  },
});

const ListItem = ({ onPress, type, image, title, date }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.wrapper}>
      <Image source={image} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <AppText fontVariation="semibold">{title}</AppText>
        {date && <Date format="MMM DD HH:mm">{date}</Date>}
      </View>
      {type === FEED_TYPE_OFFER && <View style={[styles.indicator, styles.pink]} />}
      {type === FEED_TYPE_WANTED && <View style={[styles.indicator, styles.blue]} />}
    </View>
  </TouchableOpacity>
);

ListItem.propTypes = {
  onPress: PropTypes.func.isRequired,
  type: PropTypes.string,
  image: PropTypes.shape(),
  title: PropTypes.string,
  date: PropTypes.string,
};

ListItem.defaultProps = {
  type: null,
  image: {},
  title: null,
  date: null,
};

export default ListItem;
