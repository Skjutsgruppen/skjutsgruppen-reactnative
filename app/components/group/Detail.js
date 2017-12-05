import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ToastAndroid as Toast } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { submitComment } from '@services/apollo/comment';
import { withGroupFeed } from '@services/apollo/group';
import { withLeaveGroup } from '@services/apollo/notification';
import { Loading, CustomButton, NavBar } from '@components/common';
import Relation from '@components/relation';
import Colors from '@theme/colors';
import FeedList from '@components/group/feed/list';

const GroupFeedList = withGroupFeed(FeedList);

const styles = StyleSheet.create({
  contentWrapper: {
    backgroundColor: '#fff',
  },
  lightText: {
    color: '#777777',
  },
  feed: {
    backgroundColor: '#fff',
    marginBottom: 64,
  },
  feedContent: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#dddee3',
  },
  feedTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  feedImg: {
    width: '100%',
    height: 200,
  },
  imgIcon: {
    height: 55,
    width: 55,
    backgroundColor: '#ddd',
    borderRadius: 36,
    marginRight: 12,
  },
  name: {
    color: '#1db0ed',
    fontWeight: 'bold',
  },
  feedAction: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 2,
    borderColor: '#dddee3',
  },
  verticalDevider: {
    width: 1,
    backgroundColor: '#dddddd',
    height: '70%',
    alignSelf: 'center',
  },
  newGroupInfoWrapper: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#00000011',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newGroupNameWrapper: {
    borderColor: '#ffffff',
    borderBottomWidth: 2,
    marginBottom: 16,
    paddingBottom: 16,
  },
  newGroupName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  newGroupPlace: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
  },
  newGroupInfo: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 16,
  },
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
  },
  footerContent: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    backgroundColor: '#f3f3ed',
    borderTopWidth: 2,
    borderColor: '#cececf',
    paddingVertical: 9,
    paddingLeft: 24,
    paddingRight: 12,
  },
  msgInput: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    borderWidth: 1,
    borderColor: '#b1abab',
    paddingHorizontal: 12,
  },
  send: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.25,
  },
  sendText: {
    color: '#00aeef',
    fontWeight: 'bold',
  },
  profilePic: {
    height: 55,
    width: 55,
    borderRadius: 28,
    marginRight: 12,
  },
  participantWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '33.33%',
    height: 48,
  },
});

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = ({ loading: false, leaveLoading: false, error: '', comment: '' });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { submit, group } = this.props;
    const { comment } = this.state;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        submit(null, group.id, comment).then(() => {
          Toast.show('comment added', Toast.LONG);
          this.setState({ comment: '', loading: false });
        }).catch((err) => {
          this.setState({ loading: false, error: err.message });
        });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    } else {
      Toast.show(validation.errors.join('\n'), Toast.LONG);
      this.setState({ loading: false });
    }
  }


  onCommentPress = (id) => {
    const { navigation } = this.props;
    navigation.navigate('UserProfile', { profileId: id });
  }

  onPress = () => {
    const { group, navigation } = this.props;
    navigation.navigate('UserProfile', { profileId: group.User.id });
  }

  leaveGroup = () => {
    const { group, leaveGroup, refresh } = this.props;
    this.setState(
      { leaveLoading: true },
      () => leaveGroup(group.id)
        .then(refresh)
        .catch(console.error),
    );
  }

  checkValidation() {
    const errors = [];
    const { comment } = this.state;

    if (comment === '') {
      errors.push('Comment is required.');
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }

  isGroupJoined = () => {
    const { group, user } = this.props;

    if (user.id === group.User.id) {
      return false;
    }

    let hasMember = false;

    group.GroupMembers.forEach((member) => {
      if (member.id === user.id) {
        hasMember = true;
      }
    });

    return hasMember;
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  header = (leaveLoading) => {
    const { group } = this.props;
    const { error } = this.state;

    let image = '';
    if (group.photo) {
      image = (<Image source={{ uri: group.photo }} style={styles.feedImg} />);
    } else {
      image = (<Image source={require('@assets/feed-img.jpg')} style={styles.feedImg} />);
    }

    return (<View>
      <View style={styles.feedContent}>
        <View>
          {image}
          <View style={styles.newGroupInfoWrapper}>
            <View style={styles.newGroupNameWrapper}>
              <Text style={styles.newGroupName}>{group.name}</Text>
            </View>
            {
              group.outreach === 'area' &&
              <Text style={styles.newGroupPlace}>
                {[group.country, group.county, group.municipality, group.locality].filter(s => s).join(', ')}
              </Text>
            }

            {
              group.outreach === 'route' &&
              <Text style={styles.newGroupPlace}>
                {group.TripStart.name} - {group.TripEnd.name}
              </Text>
            }
            <Text style={styles.newGroupInfo}>
              {group.type} group, {group.GroupMembers.length} {group.GroupMembers.length > 1 ? 'participants' : 'participant'}
            </Text>
          </View>
        </View>
        {this.isGroupJoined() && this.renderLeaveButton(leaveLoading)}
      </View>
      <Relation users={group.User.relation} />
      {error !== '' && <View><Text>{error}</Text></View>}
    </View>);
  }

  renderButton = () => {
    const { loading } = this.state;
    if (loading) {
      return (<View style={styles.loadingWrapper}><Loading /></View>);
    }
    return (
      <TouchableOpacity onPress={this.onSubmit}>
        <Text style={styles.sendText}> Send</Text>
      </TouchableOpacity>);
  }

  renderCommentForm() {
    return (
      <View>
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <TextInput
              onChangeText={comment => this.setState({ comment })}
              value={this.state.comment}
              style={styles.msgInput}
              placeholder="Write something..."
              autoCorrect={false}
              autoCapitalize={'none'}
              returnKeyType={'done'}
              placeholderTextColor="#666"
              underlineColorAndroid="transparent"
            />

            <View style={styles.send}>
              {this.renderButton()}
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderLeaveButton = (leaveLoading) => {
    if (leaveLoading) {
      return (<Loading />);
    }

    return (
      <CustomButton
        bgColor={Colors.background.green}
        style={styles.button}
        onPress={this.leaveGroup}
      >
        Leave the group
      </CustomButton>
    );
  }

  render() {
    const { group, navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <NavBar handleBack={this.goBack} />
        <GroupFeedList
          header={() => this.header(this.state.leaveLoading)}
          navigation={navigation}
          groupId={group.id}
        />
        {this.renderCommentForm()}
      </View>
    );
  }
}

Detail.propTypes = {
  leaveGroup: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
    photo: PropTypes.string.isRequired,
    GroupMembers: PropTypes.array.isRequired,
    User: PropTypes.object.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  refresh: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withLeaveGroup, submitComment, connect(mapStateToProps))(Detail);
