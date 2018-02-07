import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withMyGroups } from '@services/apollo/group';
import { withFriends, withBestFriends } from '@services/apollo/friend';
import { compose } from 'react-apollo';
import { Loading, RoundedButton } from '@components/common';
import CloseButton from '@components/common/closeButton';
import Colors from '@theme/colors';
import FriendList from '@components/friendList';
import { trans } from '@lang/i18n';
import SectionLabel from '@components/add/sectionLabel';
import ShareItem from '@components/common/shareItem';

const styles = StyleSheet.create({
  list: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 24,
    marginTop: 16,
  },
  wrapper: {
    paddingTop: 16,
  },
  navBar: {
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontWeight: 'bold',
    color: Colors.text.purple,
  },
  map: {
    width: 54,
  },
  listWrapper: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: Colors.background.fullWhite,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  searchIcon: {
    width: 20,
    resizeMode: 'contain',
  },
  searchField: {
    height: 45,
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  shareCategoryTitle: {
    fontSize: 12,
    color: '#1ca9e5',
    marginHorizontal: 24,
    marginBottom: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.gray,
    paddingVertical: '2%',
    paddingHorizontal: 20,
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: 50,
    marginHorizontal: 20,
  },
});

class Share extends Component {
  constructor(props) {
    super(props);
    this.state = { social: [], friends: [], groups: [] };
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state);
  }

  onClose = () => {
    this.props.onClose();
  }

  setOption = (type, value) => {
    const data = this.state[type];

    if (data.indexOf(value) > -1) {
      data.splice(data.indexOf(value), 1);
    } else {
      data.push(value);
    }

    const obj = {};
    obj[type] = data;
    this.setState(obj);
  }

  hasOption = (type, key) => {
    const data = this.state[type];

    return data.indexOf(key) > -1;
  }

  isModal() {
    return this.props.modal;
  }

  showGroup() {
    return this.props.showGroup;
  }

  buttonText() {
    return this.isModal() ? 'Share' : 'Next';
  }

  renderGroups() {
    const { groups } = this.props;

    if (groups.loading) {
      return (<Loading />);
    }

    if (groups.rows.length === 0) {
      return null;
    }

    return (
      <View style={styles.list}>
        <Text style={styles.shareCategoryTitle}>{'Groups'.toUpperCase()}</Text>
        {
          groups.rows.map(group => group && (
            <ShareItem
              key={group.id}
              imageSource={{ uri: group.User.avatar }}
              hasPhoto
              selected={this.hasOption('groups', group.id)}
              label={group.name}
              onPress={() => this.setOption('groups', group.id)}
            />
          ))
        }
      </View>
    );
  }

  render() {
    const { friends, bestFriends, labelColor } = this.props;

    return (
      <View style={styles.wrapper}>
        {
          this.isModal() &&
          <View style={styles.navBar}>
            <CloseButton onPress={this.onClose} />
            <Text style={styles.pageTitle} >{trans('global.share_with')}</Text>
            <View style={styles.map} />
          </View>
        }
        {!this.isModal() &&
          <SectionLabel label={trans('global.invite_and_publish')} color={labelColor} />
        }
        <View style={styles.searchWrapper}>
          <Image source={require('@assets/icons/icon_search_blue.png')} style={styles.searchIcon} />
          <TextInput
            style={styles.searchField}
            placeholder={trans('global.search')}
          />
        </View>
        <View style={styles.listWrapper}>
          {!this.isModal() &&
            <ShareItem
              readOnly
              selected={this.hasOption('social', 'copy_to_clip')}
              label={trans('global.publish_to_whole_movement')}
              onPress={() => {}}
            />
          }
          <ShareItem
            imageSource={require('@assets/icons/ic_copy.png')}
            selected={this.hasOption('social', 'copy_to_clip')}
            label={trans('global.copy_to_clipboard')}
            onPress={() => this.setOption('social', 'copy_to_clip')}
          />
          <ShareItem
            imageSource={require('@assets/icons/ic_facebook.png')}
            selected={this.hasOption('social', 'facebook')}
            label={trans('global.your_fb_timeline')}
            onPress={() => this.setOption('social', 'facebook')}
          />
          <ShareItem
            imageSource={require('@assets/icons/ic_twitter.png')}
            selected={this.hasOption('social', 'tweet')}
            label={trans('global.tweet')}
            onPress={() => this.setOption('social', 'tweet')}
          />
          <FriendList
            loading={bestFriends.loading}
            friends={bestFriends.rows}
            total={bestFriends.count}
            title="Recent"
            setOption={this.setOption}
            selected={this.state.friends}
          />
          <FriendList
            loading={friends.loading}
            friends={friends.rows}
            total={friends.count}
            title="Friends"
            setOption={this.setOption}
            selected={this.state.friends}
          />
          {this.showGroup() && this.renderGroups()}
          <RoundedButton
            onPress={this.onNext}
            bgColor={Colors.background.pink}
            style={styles.button}
          >
            {trans('global.share')}
          </RoundedButton>
        </View>
      </View>
    );
  }
}

Share.propTypes = {
  onClose: PropTypes.func,
  onNext: PropTypes.func.isRequired,
  groups: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  modal: PropTypes.bool,
  showGroup: PropTypes.bool,
  friends: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  bestFriends: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  labelColor: PropTypes.string,
};

Share.defaultProps = {
  onClose: () => { },
  modal: false,
  showGroup: true,
  labelColor: null,
};

export default compose(withMyGroups, withBestFriends, withFriends)(Share);
