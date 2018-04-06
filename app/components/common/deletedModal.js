import React from 'react';
import { StyleSheet, View, Text, Modal, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Loading, GhostButton } from '@components/common';
import Colors from '@theme/colors';

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

const DeletedModal = ({
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
              <Text style={styles.message}>{message}</Text>
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

DeletedModal.propTypes = {
  loading: PropTypes.bool,
  style: ViewPropTypes.style,
  visible: PropTypes.bool,
  message: PropTypes.node.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confrimTextColor: PropTypes.string,
};

DeletedModal.defaultProps = {
  style: {},
  visible: false,
  confrimTextColor: null,
  confirmLabel: 'Ok',
  loading: false,
};

export default DeletedModal;
