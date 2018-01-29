import React, { PureComponent } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '@theme/colors';
import { Wrapper } from '@components/common';
import Ride from '@components/message/ride';
import Group from '@components/message/group';
import Notification from '@components/message/notification';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';
import MessageIcon from '@assets/icons/ic_message.png';
import MessageIconActive from '@assets/icons/ic_message_active.png';

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 42,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    marginVertical: 24,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 18,
    overflow: 'hidden',
  },
  searchIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginHorizontal: 16,
    opacity: 0.5,
  },
  searchInput: {
    fontSize: 15,
    height: 36,
    flex: 1,
    borderRadius: 18,
    paddingLeft: 0,
    marginRight: 16,
  },
  content: {
    backgroundColor: Colors.background.fullWhite,
    marginBottom: 100,
  },
  indicator: {
    height: 22,
    width: 22,
    borderRadius: 12,
    backgroundColor: Colors.background.blue,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    top: -8,
    right: -6,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
  newMessageCount: {
    fontSize: 10,
    color: Colors.text.white,
  },
});

class Message extends PureComponent {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Message',
    tabBarIcon: ({ focused }) => (
      <View>
        <Image source={focused ? MessageIconActive : MessageIcon} />
        <View style={styles.indicator}>
          <Text style={styles.newMessageCount}>+10</Text>
        </View>
      </View>
    ),
  };
  render() {
    const { navigation } = this.props;
    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <LinearGradient colors={['#fff', '#ededf9']} style={styles.header}>
          <Text style={styles.title}>{trans('message.messages_and_group')}</Text>
          <View style={styles.searchInputWrapper}>
            <Image
              source={require('@assets/icons/ic_search.png')}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder={trans('message.search')}
              onFocus={() => navigation.navigate('SearchNotification')}
              underlineColorAndroid="transparent"
              style={styles.searchInput}
            />
          </View>
        </LinearGradient>
        <ScrollView>
          <View style={styles.content}>
            <Notification filters="new" />
            <Ride />
            <Group />
            <Notification filters="old" />
          </View>
        </ScrollView>
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
