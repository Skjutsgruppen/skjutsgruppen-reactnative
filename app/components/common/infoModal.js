import React from 'react';
import { StyleSheet, View, Modal, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Loading, GhostButton } from '@components/common';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  content: {
    margin: 20,
    paddingTop: 20,
    borderRadius: 12,
    backgroundColor: Colors.background.fullWhite,
    elevation: 5,
  },
  message: {
    lineHeight: 32,
    marginHorizontal: 20,
    marginVertical: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border.lightGray,
  },
});

const InfoModal = ({
  loading,
  style,
  visible,
  message,
  onRequestClose,
  confirmLabel,
  onConfirm,
  confrimTextColor,
}) =>
  (
    <Modal
      transparent
      visible={visible}
      animationType={'fade'}
      onRequestClose={onRequestClose}
    >
      <View style={[styles.backdrop, style]}>
        <View style={[styles.content, loading && { width: 100 }]}>
          {loading && (<View style={{ paddingBottom: 25 }}><Loading /></View>)}
          {
            !loading &&
            <View>
              <AppText size={18} centered style={styles.message}>{message}</AppText>
              <View style={styles.actions}>
                <GhostButton
                  label={confirmLabel}
                  onPress={onConfirm}
                  color={confrimTextColor}
                />
              </View>
            </View>
          }
        </View>
      </View>
    </Modal>
  );

InfoModal.propTypes = {
  loading: PropTypes.bool,
  style: ViewPropTypes.style,
  visible: PropTypes.bool,
  message: PropTypes.node.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confrimTextColor: PropTypes.string,
};

InfoModal.defaultProps = {
  style: {},
  visible: false,
  confrimTextColor: null,
  confirmLabel: 'Ok',
  loading: false,
};

export default InfoModal;
