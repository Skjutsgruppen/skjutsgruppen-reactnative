import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
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
import { ActionModal, ModalAction } from '@components/common';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  action: {
    padding: 16,
  },
  horizontalDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
});

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

const Filter = ({ showModal, onCloseModal, onPress, map }) => (
  <ActionModal
    visible={showModal}
    onRequestClose={onCloseModal}
    title="Filters:"
  >
    <ModalAction label={trans('feed.everything')} onPress={() => onPress(FEED_FILTER_EVERYTHING)} />
    <ModalAction label={trans('feed.offered_rides')} onPress={() => onPress(FEED_FILTER_OFFERED)} />
    <ModalAction label={trans('feed.rides_that_are_asked_for')} onPress={() => onPress(FEED_FILTER_WANTED)} />
    {!map && [
      <ModalAction key={trans('feed.close_to_you')} label={trans('feed.close_to_you')} onPress={() => onPress(FEED_FILTER_NEARBY)} />,
      <ModalAction key={trans('feed.news')} label={trans('feed.news')} onPress={() => onPress(FEED_FILTER_NEWS)} />,
      <ModalAction key={trans('feed.experience')} label={trans('feed.experience')} onPress={() => onPress(FEED_FILTER_EXPERIENCE)} />,
    ]}
  </ActionModal>
);

Filter.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
  map: PropTypes.bool,
};

Filter.defaultProps = {
  map: false,
};

export default Filter;
