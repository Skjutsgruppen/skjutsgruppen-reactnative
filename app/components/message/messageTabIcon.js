import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { compose } from 'react-apollo';
import { Colors } from '@theme';
import MessageIcon from '@assets/icons/ic_message.png';
import MessageIconActive from '@assets/icons/ic_message_active.png';
import PropTypes from 'prop-types';
import { withUnreadNotification } from '@services/apollo/notification';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    height: '100%',
  },
  indicatorIcon: {
    position: 'absolute',
    top: 8,
    right: 0,
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: Colors.background.blue,
    borderWidth: 2,
    borderColor: '#fff',
  },
});


const MessageTabIcon = ({ unreadNotifications, focused, loading }) => (
  <View style={styles.wrapper}>
    <Image source={focused ? MessageIconActive : MessageIcon} />
    {!loading && unreadNotifications > 0 && <View style={styles.indicatorIcon} />}
  </View>
);

MessageTabIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
  unreadNotifications: PropTypes.number,
  loading: PropTypes.bool.isRequired,
};

MessageTabIcon.defaultProps = {
  unreadNotifications: 0,
};

export default compose(withUnreadNotification)(MessageTabIcon);
