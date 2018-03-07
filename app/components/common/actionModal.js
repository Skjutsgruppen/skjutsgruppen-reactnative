import React, { PureComponent, Children } from 'react';
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
  },
  actionsWrapper: {
    maxHeight: '70%',
    marginTop: 'auto',
    marginHorizontal: 16,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  closeWrapper: {
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

class ActionModal extends PureComponent {
  renderActions = () => {
    const childrenCount = Children.count(this.props.children);
    return (
      <ScrollView>
        {
          Children.map(this.props.children, (action, index) => (
            <View>
              {action}
              {
                (index !== childrenCount - 1) &&
                <View style={styles.horizontalDivider} />
              }
            </View>
          ))
        }
      </ScrollView>
    );
  }

  render() {
    const {
      style,
      transparent,
      visible,
      onRequestClose,
      animationType,
    } = this.props;

    return (
      <Modal
        transparent={transparent}
        visible={visible}
        onRequestClose={onRequestClose}
        animationType={animationType}
      >
        <View style={[styles.modalContent, style]}>
          <View style={styles.actionsWrapper}>
            {this.renderActions()}
          </View>
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
  }
}

ActionModal.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
  transparent: PropTypes.bool,
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired,
  animationType: PropTypes.string,
};

ActionModal.defaultProps = {
  style: {},
  transparent: true,
  visible: false,
  animationType: 'slide',
};

export default ActionModal;
