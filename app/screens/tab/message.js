import React, { PureComponent } from 'react';
import { StyleSheet, ScrollView, View, Image } from 'react-native';
import Colors from '@theme/colors';
import { Wrapper } from '@components/common';
import Ride from '@components/message/ride';
import Group from '@components/message/group';
import Search from '@components/message/search';
import Notification from '@components/message/notification';
import PropTypes from 'prop-types';

import MessageIcon from '@icons/ic_message.png';
import MessageIconActive from '@icons/ic_message_active.png';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
});

class Message extends PureComponent {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Message',
    tabBarIcon: ({ focused }) => <Image source={focused ? MessageIconActive : MessageIcon} />,
  };

  render() {
    const { navigation } = this.props;
    return (
      <Wrapper bgColor={Colors.background.cream}>
        <Search />
        <View style={styles.content}>
          <ScrollView>
            <Notification filters="new" navigation={navigation} />
            <Ride navigation={navigation} />
            <Group navigation={navigation} />
            <Notification filters="old" navigation={navigation} />
          </ScrollView>
        </View>
      </Wrapper>
    );
  }
}

Message.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Message;
