import React from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, ViewPropTypes, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'flex-end',
  },
  contentWrapper: {
    alignItems: 'center',
    backgroundColor: Colors.background.fullWhite,
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 25,
      },
    }),
  },
  content: {
    width: 320,
    maxWidth: '100%',
  },
  closeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  close: {
    paddingVertical: 12,
    paddingHorizontal: 18,
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
    <View style={[styles.container, style]}>
      <View
        // animation="slideInUp"
        // iterationCount={1}
        // direction="alternate"
        // duration={600}
        // easing="ease-in-out-cubic"
        style={styles.contentWrapper}
      >
        <View style={styles.content}>
          {children}
          <View style={styles.closeWrapper}>
            <TouchableOpacity
              style={styles.close}
              onPress={onRequestClose}
            >
              {/* <AppText color={Colors.text.blue} centered fontVariation="bold">{trans('global.cancel')}</AppText> */}
              <AppText color={Colors.text.blue} centered>All times</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.close}
              onPress={onRequestClose}
            >
              <AppText color={Colors.text.blue} centered>Done</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
