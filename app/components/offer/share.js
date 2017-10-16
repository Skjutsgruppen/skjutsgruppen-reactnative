import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withMyGroups, withMyFriends } from '@services/apollo/auth';
import { compose } from 'react-apollo';

const styles = StyleSheet.create({
  listWrapper: {
    paddingBottom: 64,
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderBottomWidth: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 12,
    marginBottom: 24,
    marginTop: 12,
    textAlign: 'center',
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
  searchField: {
    height: 45,
    flex: 1,
    marginLeft: 12,
  },
  generalWrapper: {
    paddingVertical: 12,
  },
  socialWrapper: {
    paddingVertical: 12,
  },
  shareCategory: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },
  shareToggle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#a27ba8',
    marginLeft: 'auto',
  },
  buttonWrapper: {
    padding: 8,
    marginBottom: 32,
    margin: 24,
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
    this.state = { general: [], friends: [], groups: [], bestFriends: [] };
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state);
  }

  setOption(type, value) {
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

  hasOption(type, key) {
    const data = this.state[type];

    return data.indexOf(key) > -1;
  }

  isModal() {
    return this.props.modal;
  }

  buttonText() {
    return this.isModal() ? 'Share' : 'Next';
  }

  renderBestFriends() {
    const { friendLoading, friends } = this.props;

    if (friendLoading) {
      return (<View><Text>Loading</Text></View>);
    }


    if (friends.length === 0) {
      return null;
    }

    return (
      <View>
        <Text style={styles.shareCategoryTitle}>Best Friends</Text>
        {
          friends.map(friend => (
            <View key={friend.id} style={styles.borderedRow}>
              <TouchableOpacity
                onPress={() => this.setOption('bestFriends', friend.id)}
              >
                <View style={styles.shareItem}>
                  {this.renderPic(friend.photo)}
                  <Text>{friend.firstName || friend.email}</Text>
                  <View
                    style={[styles.shareToggle, { backgroundColor: this.hasOption('bestFriends', friend.id) ? '#a27ba8' : 'transparent' }]}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ))
        }
      </View>
    );
  }

  renderPic = (photo) => {
    let profileImage = null;

    if (photo) {
      profileImage = (<Image source={{ uri: photo }} style={styles.profilePic} />);
    }

    return profileImage;
  }

  renderFriends() {
    const { friendLoading, friends } = this.props;

    if (friendLoading) {
      return (<View><Text>Loading</Text></View>);
    }

    if (friends.length === 0) {
      return null;
    }

    return (
      <View>
        <Text style={styles.shareCategoryTitle}>Friends</Text>
        {
          friends.map(friend => (
            <View key={friend.id} style={styles.borderedRow}>
              <TouchableOpacity
                onPress={() => this.setOption('friends', friend.id)}
              >
                <View style={styles.shareItem}>
                  {this.renderPic(friend.photo)}
                  <Text>{friend.firstName || friend.email}</Text>
                  <View
                    style={[styles.shareToggle, { backgroundColor: this.hasOption('friends', friend.id) ? '#a27ba8' : 'transparent' }]}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ))
        }
      </View>
    );
  }

  renderGroups() {
    const { groupLoading, groups } = this.props;

    if (groupLoading) {
      return (<View><Text>Loading</Text></View>);
    }

    if (groups.length === 0) {
      return null;
    }

    return (
      <View>
        <Text style={styles.shareCategoryTitle}>Groups</Text>
        {
          groups.map(group => (
            <View key={group.id} style={styles.borderedRow}>
              <TouchableOpacity
                onPress={() => this.setOption('groups', group.id)}
              >
                <View style={styles.shareItem}>
                  {this.renderPic(group.photo)}
                  <Text>{group.name}</Text>
                  <View
                    style={[styles.shareToggle, { backgroundColor: this.hasOption('groups', group.id) ? '#a27ba8' : 'transparent' }]}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ))
        }
      </View>
    );
  }

  render() {
    return (
      <View>
        <View style={styles.listWrapper}>
          {!this.isModal() && <Text style={styles.title}> Share & Publish</Text>}
          <View style={styles.searchWrapper}>
            <Text>Icon</Text>
            <TextInput
              style={styles.searchField}
              placeholder="Search"
            />
          </View>
          <View style={styles.shareCategory}>
            {!this.isModal() &&
              <TouchableOpacity
                onPress={() => this.setOption('general', 'whole_movement')}
              >
                <View style={styles.shareItem}>
                  <Text>Publish to the whole movement</Text>
                  <View
                    style={[styles.shareToggle, { backgroundColor: this.hasOption('general', 'whole_movement') ? '#a27ba8' : 'transparent' }]}
                  />
                </View>
              </TouchableOpacity>
            }
            <TouchableOpacity
              onPress={() => this.setOption('general', 'copy_to_clip')}
            >
              <View style={styles.shareItem}>
                <Text>Copy to clipboard</Text>
                <View
                  style={[styles.shareToggle, { backgroundColor: this.hasOption('general', 'copy_to_clip') ? '#a27ba8' : 'transparent' }]}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.shareCategory}>
            <TouchableOpacity
              onPress={() => this.setOption('general', 'facebook')}
            >
              <View style={styles.shareItem}>
                <Text>Your Facebook Timeline</Text>
                <View
                  style={[styles.shareToggle, { backgroundColor: this.hasOption('general', 'facebook') ? '#a27ba8' : 'transparent' }]}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setOption('general', 'tweet')}
            >
              <View style={styles.shareItem}>
                <Text>Tweet</Text>
                <View
                  style={[styles.shareToggle, { backgroundColor: this.hasOption('general', 'tweet') ? '#a27ba8' : 'transparent' }]}
                />
              </View>
            </TouchableOpacity>
          </View>
          {this.renderBestFriends()}
          {this.renderGroups()}
          {this.renderFriends()}
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            onPress={this.onNext}
            title={this.buttonText()}
            color="#38ad9e"
          />
        </View>
      </View>
    );
  }
}

Share.propTypes = {
  onNext: PropTypes.func.isRequired,
  friends: PropTypes.arrayOf(PropTypes.object),
  friendLoading: PropTypes.bool.isRequired,
  groups: PropTypes.arrayOf(PropTypes.object),
  groupLoading: PropTypes.bool.isRequired,
  modal: PropTypes.bool,
};

Share.defaultProps = {
  friends: [],
  groups: [],
  modal: false,
};

export default compose(withMyGroups, withMyFriends)(Share);
