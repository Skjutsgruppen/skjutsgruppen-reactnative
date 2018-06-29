import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import ActionSheet from 'react-native-actionsheet';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';
import {
  FEED_FILTER_EVERYTHING,
  FEED_FILTER_OFFERED,
  FEED_FILTER_WANTED,
  FEED_FILTER_EXPERIENCE,
  FEED_FILTER_NEARBY,
  FEED_FILTER_NEWS,
} from '@config/constant';
import { AppText } from '@components/utils/texts';
import TouchableHighlight from '@components/touchableHighlight';
import FilterIcon from '@assets/icons/ic_menu.png';
import FilterIconBlue from '@assets/icons/ic_menu_blue.png';

const styles = StyleSheet.create({
  action: {
    padding: 16,
  },
  horizontalDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  menuIconWrapper: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 3,
  },
  menuIcon: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});

const FILTERS = {
  withMap: [FEED_FILTER_EVERYTHING, FEED_FILTER_OFFERED, FEED_FILTER_WANTED],
  withoutMap: [
    FEED_FILTER_EVERYTHING,
    FEED_FILTER_OFFERED,
    FEED_FILTER_WANTED,
    FEED_FILTER_NEARBY,
    FEED_FILTER_NEWS,
    FEED_FILTER_EXPERIENCE,
  ],
};

const FILTER_LABLES = {
  withMap: ['Everything', 'Offered rides', 'Rides that are asked for'],
  withoutMap: [
    'Everything',
    'Offered rides',
    'Rides that are asked for',
    'Close to you',
    'News',
    'Experience',
  ],
};

const Action = ({ label, onPress }) => (
  <View style={styles.horizontalDivider} >
    <TouchableOpacity style={styles.action} onPress={onPress}>
      <AppText centered fontVariation="bold" color={Colors.text.blue}>{label}</AppText>
    </TouchableOpacity>
  </View>
);

Action.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const Filter = ({ onPress, map }) => {
  const filtersToRender = map ? FILTERS.withMap : FILTERS.withoutMap;
  const filtersLablesToRender = map ? FILTER_LABLES.withMap : FILTER_LABLES.withoutMap;
  let filterActionSheet;

  const applyFilter = (index) => {
    if (filtersToRender.length !== index) {
      onPress(filtersToRender[index]);
    }
  };

  return (
    <View style={styles.menuIconWrapper}>
      <TouchableHighlight
        style={styles.menuIcon}
        onPress={() => filterActionSheet.show()}
      >
        <Image source={map ? FilterIconBlue : FilterIcon} />
      </TouchableHighlight>
      <ActionSheet
        ref={(sheet) => { filterActionSheet = sheet; }}
        title={trans('feed.filters')}
        options={[...filtersLablesToRender, 'Cancel']}
        cancelButtonIndex={filtersToRender.length}
        onPress={(index) => { applyFilter(index); }}
      />
    </View>
  );
};

Filter.propTypes = {
  onPress: PropTypes.func.isRequired,
  map: PropTypes.bool,
};

Filter.defaultProps = {
  map: false,
};

export default Filter;
