import React, { PureComponent } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import Colors from '@theme/colors';
import { Wrapper } from '@components/common';
import Ride from '@components/message/ride';
import Group from '@components/message/group';
import Notification from '@components/message/notification';
import PropTypes from 'prop-types';

import MessageIcon from '@assets/icons/ic_message.png';
import MessageIconActive from '@assets/icons/ic_message_active.png';

const styles = StyleSheet.create({
  header: {
    padding: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 18,
    overflow: 'hidden',
  },
  iconWrapper: {
    height: 36,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  searchIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  searchInput: {
    fontSize: 14,
    height: 36,
    flex: 1,
    paddingLeft: 18,
    borderRadius: 18,
  },
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
        <View style={styles.header}>
          <Text style={styles.title}>Messages and groups</Text>
          <View style={styles.searchInputWrapper}>
            <TextInput
              placeholder="Search"
              onFocus={() => navigation.navigate('SearchNotification')}
              underlineColorAndroid="transparent"
              style={styles.searchInput}
            />
            <TouchableOpacity
              style={styles.iconWrapper}
              disabled
            >
              <Image
                source={require('@assets/icons/icon_search_blue.png')}
                style={styles.searchIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <ScrollView>
            <Notification filters="new" />
            <Ride />
            <Group />
            <Notification filters="old" />
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
