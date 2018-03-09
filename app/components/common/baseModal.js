import React from 'react';
import { StyleSheet, View, Text, Modal, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';
import TouchableHighlight from '@components/touchableHighlight';

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.65)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  closeWrapper: {
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.background.fullWhite,
    overflow: 'hidden',
    marginHorizontal: 12,
    marginBottom: 12,
  },
  close: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  closeLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
});

const BaseModal = ({ style, transparent, visible, onRequestClose, children, backdropColor }) => (
  <Modal
    transparent={transparent}
    visible={visible}
    onRequestClose={onRequestClose}
    animationType="fade"
  >
    <View style={[styles.modalContent, style, { backgroundColor: backdropColor }]}>
      {children}
    </View>
    <Animatable.View
      animation="slideInUp"
      duration={620}
      easing="ease-in-out-cubic"
      style={styles.closeWrapper}
      useNativeDriver
    >
      <TouchableHighlight
        style={styles.close}
        onPress={onRequestClose}
      >
        <Text style={styles.closeLabel}>{trans('global.cancel')}</Text>
      </TouchableHighlight>
    </Animatable.View>
  </Modal>
);

BaseModal.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
  transparent: PropTypes.bool,
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired,
  backdropColor: PropTypes.string,
};

BaseModal.defaultProps = {
  style: {},
  transparent: true,
  visible: false,
  backdropColor: 'rgba(255,255,255,0.65)',
};

export default BaseModal;
