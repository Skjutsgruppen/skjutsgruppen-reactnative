import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '@theme';
import { Heading } from '@components/utils/texts';
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
    fontFamily: 'sfuiTextRegular',
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

class Message extends Component {
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
    return false;
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

  render() {
    const { navigation } = this.props;
    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ScrollView ref={(ref) => { this.scrollView = ref; }} showsVerticalScrollIndicator={false}>
          <LinearGradient colors={Gradients.headerWhite} style={styles.header}>
            <Heading style={styles.title}>{trans('message.messages_and_group')}</Heading>
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
