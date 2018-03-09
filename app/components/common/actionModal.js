import React, { PureComponent, Children } from 'react';
import { StyleSheet, ScrollView, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import { Colors } from '@theme';
import BaseModal from '@components/common/baseModal';

const styles = StyleSheet.create({
  horizontalDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  actionsWrapper: {
    maxHeight: '70%',
    marginTop: 'auto',
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
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
    } = this.props;

    return (
      <BaseModal
        transparent={transparent}
        visible={visible}
        onRequestClose={onRequestClose}
        style={style}
      >
        <Animatable.View
          animation="slideInUp"
          duration={600}
          easing="ease-in-out-cubic"
          style={styles.actionsWrapper}
          useNativeDriver
        >
          {this.renderActions()}
        </Animatable.View>
      </BaseModal>
    );
  }
}

ActionModal.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
  transparent: PropTypes.bool,
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired,
};

ActionModal.defaultProps = {
  style: {},
  transparent: true,
  visible: false,
};

export default ActionModal;
