import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  horizontalDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.65)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  calendarWrapper: {
    height: 380,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeWrapper: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: Colors.background.fullWhite,
    marginTop: 12,
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
      <Animatable.View
        animation="slideInUp"
        iterationCount={1}
        direction="alternate"
        duration={600}
        easing="ease-in-out-cubic"
        style={styles.calendarWrapper}
      >
        {children}
      </Animatable.View>
      <Animatable.View
        animation="slideInUp"
        iterationCount={1}
        direction="alternate"
        duration={620}
        easing="ease-in-out-cubic"
        style={styles.closeWrapper}
      >
        <TouchableOpacity
          style={styles.close}
          onPress={onRequestClose}
        >
          <Text style={styles.closeLabel}>{trans('global.done')}</Text>
        </TouchableOpacity>
      </Animatable.View>
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
  animationType: 'fade',
};

export default CalendarModal;
