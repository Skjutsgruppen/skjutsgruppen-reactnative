import React, { PureComponent } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import TabIcon from '@components/tabIcon';
import Colors from '@theme/colors';
import { Wrapper } from '@components/common';
import Ride from '@components/message/ride';
import Group from '@components/message/group';
import Search from '@components/message/search';
import Notification from '@components/message/notification';
import PropTypes from 'prop-types';

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
    tabBarIcon: ({ focused, tintColor }) => (
      <TabIcon
        iconDefault="ios-chatboxes-outline"
        iconFocused="ios-chatboxes"
        focused={focused}
        tintColor={tintColor}
      />
    ),
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
