import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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

const styles = StyleSheet.create({
  actionsWrapper: {
    marginTop: 'auto',
    marginHorizontal: 16,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 16,
  },
  action: {
    padding: 16,
  },
  actionLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
  horizontalDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  closeWrapper: {
    backgroundColor: Colors.background.fullWhite,
  },
  closeModal: {
    padding: 16,
  },
});

const Action = ({ label, onPress }) => (
  <View style={styles.horizontalDivider} >
    <TouchableOpacity style={styles.action} onPress={onPress}>
      <Text style={styles.actionLabel}>{label}</Text>
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
