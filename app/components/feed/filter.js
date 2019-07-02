import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import PropTypes from 'prop-types';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
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
import TouchableHighlight from '@components/touchableHighlight';
import FilterIcon from '@assets/icons/ic_menu.png';
import FilterIconBlue from '@assets/icons/ic_menu_blue.png';

const styles = StyleSheet.create({
  transparentBg: {
    backgroundColor: 'transparent',
  },
  action: {
    padding: 16,
  },
  actionItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.98)',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    backgroundColor: 'transparent',
    fontSize: 18,
    color: '#007AFF',
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

const actionsheetStyles = {
  body: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  buttonBox: {
    height: 50,
    marginTop: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginHorizontal: 12,
  },
  buttonText: {
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  cancelButtonBox: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
};

const Filter = ({ onPress, map }) => {
  let filterActionSheet;
  const onPressFilter = (filterType) => {
    filterActionSheet.hide();

    setTimeout(() => {
      onPress(filterType);
    }, 300);
  };

  const withoutMap = [
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => { onPressFilter(FEED_FILTER_EVERYTHING); }}
      style={[styles.actionItem, { borderTopLeftRadius: 12, borderTopRightRadius: 12 }]}
    >
      <Text style={styles.actionLabel}>{trans('feed.everything')}</Text>
    </TouchableOpacity>,
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => { onPressFilter(FEED_FILTER_OFFERED); }}
      style={styles.actionItem}
    >
      <Text style={styles.actionLabel}>{trans('feed.offered_rides')}</Text>
    </TouchableOpacity>,
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => { onPressFilter(FEED_FILTER_WANTED); }}
      style={styles.actionItem}
    >
      <Text style={styles.actionLabel}>{trans('feed.rides_that_are_asked_for')}</Text>
    </TouchableOpacity>,
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => { onPressFilter(FEED_FILTER_NEARBY); }}
      style={styles.actionItem}
    >
      <Text style={styles.actionLabel}>{trans('feed.close_to_you')}</Text>
    </TouchableOpacity>,
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => { onPressFilter(FEED_FILTER_NEWS); }}
      style={styles.actionItem}
    >
      <Text style={styles.actionLabel}>{trans('feed.news')}</Text>
    </TouchableOpacity>,
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => { onPressFilter(FEED_FILTER_EXPERIENCE); }}
      style={[styles.actionItem, { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }]}
    >
      <Text style={styles.actionLabel}>{trans('feed.experiences')}</Text>
    </TouchableOpacity>,
  ];

  const withMap = [
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => { onPressFilter(FEED_FILTER_EVERYTHING); }}
      style={[styles.actionItem, { borderTopLeftRadius: 12, borderTopRightRadius: 12 }]}
    >
      <Text style={styles.actionLabel}>{trans('feed.everything')}</Text>
    </TouchableOpacity>,
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => { onPressFilter(FEED_FILTER_OFFERED); }}
      style={styles.actionItem}
    >
      <Text style={styles.actionLabel}>{trans('feed.offered_rides')}</Text>
    </TouchableOpacity>,
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => { onPressFilter(FEED_FILTER_WANTED); }}
      style={[styles.actionItem, { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }]}
    >
      <Text style={styles.actionLabel}>{trans('feed.rides_that_are_asked_for')}</Text>
    </TouchableOpacity>,
  ];

  const options = map ? [...withMap, trans('feed.cancel')] : [...withoutMap, trans('feed.cancel')];

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
        options={options}
        cancelButtonIndex={options.length - 1}
        onPress={() => { }}
        styles={actionsheetStyles}
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
