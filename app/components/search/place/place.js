import React from 'react';
import {
  View,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { Loading } from '@components/common';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

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
        <AppText numberOfLines={1}> {item.description} </AppText>
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
