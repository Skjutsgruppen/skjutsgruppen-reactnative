import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Modal, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  horizontalDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  closeWrapper: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: Colors.background.fullWhite,
  },
  close: {
    padding: 16,
  },
  closeLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
});

const CalendarModal = ({
  style,
  transparent,
  visible,
  onRequestClose,
  animationType,
  children,
}) => (
  <Modal
    transparent={transparent}
    visible={visible}
    onRequestClose={onRequestClose}
    animationType={animationType}
  >
    <View style={[styles.modalContent, style]}>
      <ScrollView>
        {children}
      </ScrollView>
      <View style={styles.closeWrapper}>
        <TouchableOpacity
          style={styles.close}
          onPress={onRequestClose}
        >
          <Text style={styles.closeLabel}>{trans('global.cancel')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

CalendarModal.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
  transparent: PropTypes.bool,
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired,
  animationType: PropTypes.string,
};

CalendarModal.defaultProps = {
  style: {},
  transparent: true,
  visible: false,
  animationType: 'slide',
};

export default CalendarModal;
