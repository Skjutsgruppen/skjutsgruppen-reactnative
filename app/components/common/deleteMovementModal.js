import React from 'react';
import { StyleSheet, View, Modal, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Loading, GhostButton, RoundedButton } from '@components/common';
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
    maxWidth: '100%',
    minWidth: 300,
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
  deleteWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 550,
    paddingHorizontal: 24,
  },
});

const DeleteMovementModal = ({
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
          <View style={styles.deleteWrapper}>
            {
              message && <View style={{ marginBottom: 40 }}>{message}</View>
            }
            <RoundedButton
              bgColor={Colors.background.pink}
              onPress={onConfirm}
              textStyle={{ fontSize: 20 }}
              textColor={Colors.text.white}
            >
              {confirmLabel}
            </RoundedButton>

            { cancelable && (
              <GhostButton
                label={denyLabel}
                onPress={onDeny}
                color={Colors.text.black}
                containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                style={{ justifyContent: 'flex-start' }}
              />
            )}
          </View>
        }
      </View>
    </View>
  </Modal>
);

DeleteMovementModal.propTypes = {
  loading: PropTypes.bool.isRequired,
  style: ViewPropTypes.style,
  visible: PropTypes.bool,
  message: PropTypes.node,
  onRequestClose: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  denyLabel: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired,
  confrimTextColor: PropTypes.string,
  denyTextColor: PropTypes.string,
  cancelable: PropTypes.bool,
};

DeleteMovementModal.defaultProps = {
  style: {},
  visible: false,
  confrimTextColor: null,
  denyTextColor: null,
  confirmLabel: 'Ok',
  denyLabel: 'Cancel',
  cancelable: true,
  message: null,
};

export default DeleteMovementModal;
