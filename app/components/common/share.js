import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableWithoutFeedback, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withGroups, withFriends, withBestFriends } from '@services/apollo/auth';
import { compose } from 'react-apollo';
import { Wrapper, Loading } from '@components/common';
import CloseButton from '@components/common/closeButton';
import CustomButton from '@components/common/customButton';
import CheckIcon from '@icons/icon_check_white.png';
import Colors from '@theme/colors';
import FriendList from '@components/friendList';

const styles = StyleSheet.create({
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
    paddingBottom: 64,
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    borderBottomWidth: 2,
  },
  infoTextWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: Colors.background.cream,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 12,
    marginBottom: 24,
    textAlign: 'center',
  },
  text: {
    width: 300,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: 'bold',
    color: Colors.text.gray,
    alignSelf: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
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
  generalWrapper: {
    paddingVertical: 10,
  },
  copyIcon: {
    resizeMode: 'contain',
    height: 30,
    width: 30,
    marginRight: 10,
  },
  socialWrapper: {
    paddingVertical: 10,
  },
  shareCategory: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
  },
  shareCategoryTitle: {
    fontSize: 16,
    color: '#1ca9e5',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
  },
  borderedRow: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  shareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },
  defaultSelectedIcon: {
    width: 28,
    height: 28,
    backgroundColor: '#00aeef',
    marginRight: 10,
    borderRadius: 15,
  },
  shareItemIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    backgroundColor: '#00aeef',
    marginRight: 10,
    borderRadius: 15,
  },
  shareItemIcon: {
    height: 16,
    resizeMode: 'contain',
  },
  smallText: {
    fontSize: 11,
    opacity: 0.7,
  },
  shareToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#999',
    marginLeft: 'auto',
  },
  shareToggleGray: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border.gray,
    backgroundColor: Colors.border.gray,
    marginLeft: 'auto',
  },
  shareToggleActive: {
    backgroundColor: '#a27ba8',
    borderColor: '#a27ba8',
  },
  checkIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  button: {
    padding: 8,
    marginVertical: 32,
    marginHorizontal: 24,
  },
  profilePic: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 12,
  },
});

class Share extends Component {
  constructor(props) {
    super(props);
    this.state = { general: [], friends: [], groups: [] };
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

  renderPic = (photo) => {
    let profileImage = null;

    if (photo) {
      profileImage = (<Image source={{ uri: photo }} style={styles.profilePic} />);
    }

    return profileImage;
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
      <View>
        <Text style={styles.shareCategoryTitle}>Groups</Text>
        {
          groups.rows.map(group => (
            <View key={group.id} style={styles.borderedRow}>
              <TouchableWithoutFeedback
                onPress={() => this.setOption('groups', group.id)}
              >
                <View style={styles.shareItem}>
                  {this.renderPic(group.photo)}
                  <Text>{group.name}</Text>
                  <View
                    style={[styles.shareToggle, this.hasOption('groups', group.id) ? styles.shareToggleActive : {}]}
                  >
                    {
                      this.hasOption('groups', group.id) &&
                      <Image source={CheckIcon} style={styles.checkIcon} />
                    }
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          ))
        }
      </View>
    );
  }

  render() {
    const { friends, bestFriends } = this.props;

    return (
      <Wrapper bgColor={Colors.background.cream}>
        {
          this.isModal() &&
          <View style={styles.navBar}>
            <CloseButton onPress={this.onClose} />
            <Text style={styles.pageTitle} >Share with</Text>
            <View style={styles.map} />
          </View>
        }
        <View style={styles.listWrapper}>
          {!this.isModal() &&
            <View style={styles.infoTextWrapper}>
              <Text style={styles.title}> Invite & Publish</Text>
              <Text style={styles.text}>
                Participants who are part of the movement will
                be automatically added to the group when yo invite them.
                Others who are not participants yet will get a link.
              </Text>
            </View>
          }
          <View style={styles.searchWrapper}>
            <Image source={require('@icons/icon_search_blue.png')} style={styles.searchIcon} />
            <TextInput
              style={styles.searchField}
              placeholder="Search"
            />
          </View>
          {!this.isModal() &&
            <TouchableWithoutFeedback
              onPress={() => this.setOption('general', 'whole_movement')}
            >
              <View style={styles.shareItem}>
                <View style={styles.defaultSelectedIcon} />
                <Text style={styles.shareLabel}>Publish to the whole movement</Text>
                <View
                  style={styles.shareToggleGray}
                >
                  <Image source={CheckIcon} style={styles.checkIcon} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          }
          <TouchableWithoutFeedback
            onPress={() => this.setOption('general', 'copy_to_clip')}
          >
            <View style={styles.shareItem}>
              <Image source={require('@icons/icon_copy.png')} style={styles.copyIcon} />
              <View style={styles.shareLabel}>
                <Text>Copy to clipboard</Text>
                <Text style={styles.smallText}>Paste whereever you want</Text>
              </View>
              <View
                style={[styles.shareToggle, this.hasOption('general', 'copy_to_clip') ? styles.shareToggleActive : {}]}
              >
                {
                  this.hasOption('general', 'copy_to_clip') &&
                  <Image source={CheckIcon} style={styles.checkIcon} />
                }
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.setOption('general', 'facebook')}
          >
            <View style={styles.shareItem}>
              <View style={styles.shareItemIconWrapper}>
                <Image source={require('@icons/icon_facebook.png')} style={styles.shareItemIcon} />
              </View>
              <Text>Your Facebook Timeline</Text>
              <View
                style={[styles.shareToggle, this.hasOption('general', 'facebook') ? styles.shareToggleActive : {}]}
              >
                {
                  this.hasOption('general', 'facebook') &&
                  <Image source={CheckIcon} style={styles.checkIcon} />
                }
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => this.setOption('general', 'tweet')}
          >
            <View style={styles.shareItem}>
              <View style={styles.shareItemIconWrapper}>
                <Image source={require('@icons/icon_twitter.png')} style={styles.shareItemIcon} />
              </View>
              <Text>Tweet</Text>
              <View
                style={[styles.shareToggle, this.hasOption('general', 'tweet') ? styles.shareToggleActive : {}]}
              >
                {
                  this.hasOption('general', 'tweet') &&
                  <Image source={CheckIcon} style={styles.checkIcon} />
                }
              </View>
            </View>
          </TouchableWithoutFeedback>
          <FriendList loading={friends.loading} friends={friends.rows} total={friends.total} title="Friends" setOption={this.setOption} selected={this.state.friends} />
          <FriendList loading={bestFriends.loading} friends={bestFriends.rows} total={bestFriends.total} title="Best Friends" setOption={this.setOption} selected={this.state.friends} />
          {this.showGroup() && this.renderGroups()}
        </View>
        <CustomButton
          onPress={this.onNext}
          bgColor="#38ad9e"
          style={styles.button}
        >
          Share
        </CustomButton>
      </Wrapper>
    );
  }
}

Share.propTypes = {
  onClose: PropTypes.func,
  onNext: PropTypes.func.isRequired,
  groups: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  modal: PropTypes.bool,
  showGroup: PropTypes.bool,
  friends: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  bestFriends: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};

Share.defaultProps = {
  onClose: () => { },
  modal: false,
  showGroup: true,
};

export default compose(withGroups, withBestFriends, withFriends)(Share);
