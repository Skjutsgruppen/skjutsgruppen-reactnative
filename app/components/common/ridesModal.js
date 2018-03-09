import React from 'react';
import { StyleSheet, View, ScrollView, Text, Modal, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';
import * as Animatable from 'react-native-animatable';
import { Colors } from '@theme';
import TouchableHighlight from '@components/touchableHighlight';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.65)',
    justifyContent: 'flex-end',
  },
  wrapper: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 15,
    overflow: 'hidden',
    backgroundColor: Colors.background.mutedBlue,
    maxHeight: '60%',
  },
  closeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.fullWhite,
    elevation: 15,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  close: {
    padding: 20,
  },
  closeLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
});

const RidesModal = ({
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
    <View style={[styles.content, style]}>
      <Animatable.View
        animation="slideInUp"
        duration={600}
        easing="ease-in-out-cubic"
        style={styles.wrapper}
        useNativeDriver
      >
        <ScrollView>
          {children}
        </ScrollView>
        <View style={styles.closeWrapper}>
          <TouchableHighlight
            style={styles.close}
            onPress={onRequestClose}
          >
            <Text style={styles.closeLabel}>{trans('global.cancel')}</Text>
          </TouchableHighlight>
        </View>
      </Animatable.View>
    </View>
  </Modal>
);

RidesModal.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
  transparent: PropTypes.bool,
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired,
  animationType: PropTypes.string,
};

RidesModal.defaultProps = {
  style: {},
  transparent: true,
  visible: false,
  animationType: 'fade',
};

export default RidesModal;
