import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image, TouchableHighlight, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '@theme';
import { Heading } from '@components/utils/texts';
import { Wrapper } from '@components/common';
import Ride from '@components/message/ride';
import Group from '@components/message/group';
import Notification from '@components/message/notification';
import SharedLocation from '@components/message/sharedLocation';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';
import AppText from '@components/utils/texts/appText';

import MessageIcon from '@assets/icons/ic_message.png';
import MessageIconActive from '@assets/icons/ic_message_active.png';
import IconSearch from '@assets/icons/ic_search.png';

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  title: {
    marginBottom: 24,
  },
  searchBarWrapper: {
    height: 36,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 18,
  },
  searchIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginHorizontal: 16,
    opacity: 0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  content: {
    backgroundColor: Colors.background.fullWhite,
    marginBottom: 100,
  },
});

class Message extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: trans('message.message'),
    tabBarIcon: ({ focused }) => (
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
        <Image source={focused ? MessageIconActive : MessageIcon} />
        <View style={{ position: 'absolute', top: 8, right: 0, height: 16, width: 16, borderRadius: 8, backgroundColor: Colors.background.blue, borderWidth: 2, borderColor: '#fff' }} />
      </View>
    ),
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
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({ scrollToTop: this.scrollToTop });
    navigation.addListener('didBlur', e => this.tabEvent(e, 'didBlur'));
  }

  shouldComponentUpdate() {
    return true;
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

  renderMessages = () => (
    <View style={styles.content}>
      <SharedLocation />
      <Notification filters="new" />
      <Ride />
      <Group />
      <Notification filters="old" />
    </View>
  )

  render() {
    const { navigation } = this.props;

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ScrollView ref={(ref) => { this.scrollView = ref; }} showsVerticalScrollIndicator={false}>
          <LinearGradient colors={Gradients.headerWhite} style={styles.header}>
            <Heading style={styles.title}>{trans('message.messages_and_group')}</Heading>
            <TouchableHighlight
              style={styles.searchBarWrapper}
              onPress={() => navigation.navigate('SearchNotification')}
              underlayColor="#f5f5f5"
            >
              <View style={styles.searchBar}>
                <Image
                  source={IconSearch}
                  style={styles.searchIcon}
                />
                <AppText size={15} color="#aeaeae">{trans('message.search_messages')}</AppText>
              </View>
            </TouchableHighlight>
          </LinearGradient>
          {this.renderMessages()}
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
