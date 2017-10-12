import React, { Component } from 'react';
import { Text } from 'react-native';
import TabIcon from '@components/tabIcon';
import { Wrapper } from '@components/common';

class Search extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Message',
    tabBarIcon: ({ focused, tintColor }) => (
      <TabIcon
        iconDefault="ios-search-outline"
        iconFocused="ios-search"
        focused={focused}
        tintColor={tintColor}
      />
    ),
  };

  render() {
    return (
      <Wrapper>
        <Text>Search</Text>
      </Wrapper>
    );
  }
}

export default Search;
