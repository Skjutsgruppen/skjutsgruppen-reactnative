import React, { Component } from 'react';
import { Text } from 'react-native';
import TabIcon from '@components/tabIcon';
import { Wrapper } from '@components/common';

class Message extends Component {
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
    return (
      <Wrapper>
        <Text>Message</Text>
      </Wrapper>
    );
  }
}

export default Message;
