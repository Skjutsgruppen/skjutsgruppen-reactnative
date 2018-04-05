import React, { PureComponent, Children } from 'react';
import { StyleSheet, ScrollView, View, Text, Modal, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';
import TouchableHighlight from '@components/touchableHighlight';

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
  actionsWrapper: {
    maxHeight: '70%',
    marginTop: 'auto',
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
  },
  closeWrapper: {
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.background.fullWhite,
    overflow: 'hidden',
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
      title,
    } = this.props;

    return (
      <Modal
        transparent={transparent}
        visible={visible}
        onRequestClose={onRequestClose}
        animationType="fade"
      >
        <View style={[styles.modalContent, style]}>
          <Animatable.View
            animation="slideInUp"
            iterationCount={1}
            direction="alternate"
            duration={600}
            easing="ease-in-out-cubic"
            style={styles.actionsWrapper}
          >
            {
              title && title !== '' && <Text style={styles.title}>{title}</Text>
            }
            {this.renderActions()}
          </Animatable.View>
          <Animatable.View
            animation="slideInUp"
            iterationCount={1}
            direction="alternate"
            duration={620}
            easing="ease-in-out-cubic"
            style={styles.closeWrapper}
          >
            <TouchableHighlight
              style={styles.close}
              onPress={onRequestClose}
            >
              <Text style={styles.closeLabel}>{trans('global.cancel')}</Text>
            </TouchableHighlight>
          </Animatable.View>
        </View>
      </Modal >
    );
  }
}

ActionModal.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
  transparent: PropTypes.bool,
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired,
  title: PropTypes.string,
};

ActionModal.defaultProps = {
  style: {},
  transparent: true,
  visible: false,
  title: null,
};

export default ActionModal;
