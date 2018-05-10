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
    fontSize: 18,
    lineHeight: 32,
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
  },
  actions: {
    minWidth: 220,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border.lightGray,
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.border.lightGray,
  },
});

const ConfirmModal = ({
  loading,
  style,
  visible,
  message,
  onRequestClose,
  confirmLabel,
  denyLabel,
  onConfirm,
  onDeny,
  confrimTextColor,
  denyTextColor,
  cancelable,

}) => (
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
            <AppText style={styles.message}>{message}</AppText>
            <View style={styles.actions}>
              <GhostButton
                label={confirmLabel}
                onPress={onConfirm}
                color={confrimTextColor}
              />
              { cancelable && <View style={styles.verticalDivider} /> }

              { cancelable && (
                <GhostButton
                  label={denyLabel}
                  onPress={onDeny}
                  color={denyTextColor}
                />
              )}
            </View>
          </View>
        }
      </View>
    </View>
  </Modal>
);

ConfirmModal.propTypes = {
  loading: PropTypes.bool.isRequired,
  style: ViewPropTypes.style,
  visible: PropTypes.bool,
  message: PropTypes.node.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  denyLabel: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired,
  confrimTextColor: PropTypes.string,
  denyTextColor: PropTypes.string,
  cancelable: PropTypes.bool,
};

ConfirmModal.defaultProps = {
  style: {},
  visible: false,
  confrimTextColor: null,
  denyTextColor: null,
  confirmLabel: 'Ok',
  denyLabel: 'Cancel',
  cancelable: true,

};

export default ConfirmModal;
