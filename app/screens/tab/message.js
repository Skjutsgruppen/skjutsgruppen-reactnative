import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '@theme';
import { Heading, AppText } from '@components/utils/texts';
import { Wrapper } from '@components/common';
import Ride from '@components/message/ride';
import Group from '@components/message/group';
import Notification from '@components/message/notification';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';

import MessageIcon from '@assets/icons/ic_message.png';
import MessageIconActive from '@assets/icons/ic_message_active.png';
import IconSearch from '@assets/icons/ic_search.png';
import IconCycle from '@assets/icons/ic_cycle.png';

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  title: {
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
    fontFamily: 'SFUIText-Regular',
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
  noMessage: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  noMessageText: {
    marginTop: 24,
    marginHorizontal: 20,
    lineHeight: 24,
  },
});

class Message extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Message',
    tabBarIcon: ({ focused }) => <Image source={focused ? MessageIconActive : MessageIcon} />,
    // tabBarIcon: ({ focused }) => (
    //   <View>
    //     <Image source={focused ? MessageIconActive : MessageIcon} />
    //     <View style={styles.indicator}>
    //       <Text style={styles.newMessageCount}>+10</Text>
    //     </View>
    //   </View>
    // ),
    tabBarOnPress: ({ scene, jumpToIndex }) => {
      if (scene.focused) {
        const navigationInRoute = scene.route;
        if (!!navigationInRoute
          && !!navigationInRoute.params
          && !!navigationInRoute.params.scrollToTop) {
          navigationInRoute.params.scrollToTop();
        }
      }
      jumpToIndex(3);
    },
  };

  constructor(props) {
    super(props);
    this.scrollView = null;

    this.state = {
      hasNewMessages: true,
      hasActiveRides: true,
      hasGroups: true,
      hasOldMessages: true,
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({ scrollToTop: this.scrollToTop });
    navigation.addListener('didBlur', e => this.tabEvent(e, 'didBlur'));
  }

  shouldComponentUpdate() {
    return true;
  }

  setNoMessages = (type) => {
    if (type === 'new') {
      this.setState({ hasNewMessages: false });
    }
    if (type === 'old') {
      this.setState({ hasOldMessages: false });
    }
    if (type === 'groups') {
      this.setState({ hasGroups: false });
    }
    if (type === 'rides') {
      this.setState({ hasActiveRides: false });
    }
  }

  hasAnyMessage = () => {
    const {
      hasActiveRides,
      hasNewMessages,
      hasOldMessages,
      hasGroups,
    } = this.state;
    return hasActiveRides || hasNewMessages || hasOldMessages || hasGroups;
  }

  scrollToTop = () => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  tabEvent = (e, type) => {
    if (this.scrollView && type === 'didBlur') {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  renderNoMessages = () => (
    <View style={styles.noMessage}>
      <Image source={IconCycle} />
      <AppText centered color={Colors.text.gray} style={styles.noMessageText}>
        Nothing here yet. When you start a conversation with someone
        or join a group you will see them all here. Great right?
      </AppText>
    </View>
  )

  renderMessages = () => (
    <View style={styles.content}>
      <Notification filters="new" setNoMessages={this.setNoMessages} />
      <Ride setNoMessages={this.setNoMessages} />
      <Group setNoMessages={this.setNoMessages} />
      <Notification filters="old" setNoMessages={this.setNoMessages} />
    </View>
  )

  render() {
    const { navigation } = this.props;

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ScrollView ref={(ref) => { this.scrollView = ref; }} showsVerticalScrollIndicator={false}>
          <LinearGradient colors={Gradients.headerWhite} style={styles.header}>
            <Heading style={styles.title}>{trans('message.messages_and_group')}</Heading>
            <View style={styles.searchInputWrapper}>
              <Image
                source={IconSearch}
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
          {
            !this.hasAnyMessage() ? this.renderNoMessages()
              : this.renderMessages()
          }
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
