import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { FEED_FILTER_EVERYTHING, FEED_FILTER_OFFERED, FEED_FILTER_WANTED, FEED_FILTER_NEARBY, FEED_FILTER_NEWS } from '@config/constant';
import { trans } from '@lang/i18n';

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
    backgroundColor: 'rgba(0,0,0,0.3)',
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

const Filter = ({ showModal, onCloseModal, onPress }) => (
  <Modal
    animationType="slide"
    transparent
    visible={showModal}
    onRequestClose={onCloseModal}
  >
    <View style={styles.modalContent}>
      <View style={styles.actionsWrapper}>
        <Text style={styles.title}>Filters:</Text>
        <Action label={trans('feed.everything')} onPress={() => onPress(FEED_FILTER_EVERYTHING)} />
        <Action label={trans('feed.offered_rides')} onPress={() => onPress(FEED_FILTER_OFFERED)} />
        <Action label={trans('feed.rides_that_are_asked_for')} onPress={() => onPress(FEED_FILTER_WANTED)} />
        <Action label={trans('feed.close_to_you')} onPress={() => onPress(FEED_FILTER_NEARBY)} />
        <Action label={trans('feed.news')} onPress={() => onPress(FEED_FILTER_NEWS)} />
      </View>
      <View style={styles.closeWrapper}>
        <TouchableOpacity
          style={styles.closeModal}
          onPress={onCloseModal}
        >
          <Text style={styles.actionLabel}>{trans('global.cancel')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

Filter.propTypes = {
  showModal: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default Filter;
