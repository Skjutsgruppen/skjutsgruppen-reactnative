import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { Loading } from '@components/common';
import { Colors } from '@theme';

const Styles = StyleSheet.create({
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});

const Place = ({ item, loading, onPress }) => (
  <ScrollView
    scrollEnabled
    keyboardShouldPersistTaps="always"
    showsHorizontalScrollIndicator={false}
    showsVerticalScrollIndicator={false}
  >
    <TouchableHighlight
      underlayColor={Colors.background.lightGray}
      onPress={() => onPress(item)}
    >
      <View style={Styles.suggestion}>
        <Text numberOfLines={1}>
          {item.description}
        </Text>
        {loading && <Loading size="small" />}
      </View>
    </TouchableHighlight>
  </ScrollView>
);

Place.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default Place;
