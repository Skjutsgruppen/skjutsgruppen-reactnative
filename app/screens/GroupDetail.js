import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ToastAndroid as Toast } from 'react-native';
import { submitComment, withGroupComment } from '@services/apollo/comment';
import { Loading } from '@components/common';
import Comment from '@components/comment/list';
import Relation from '@components/relation';
import PropTypes from 'prop-types';

const GroupComment = withGroupComment(Comment);

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

class GroupDetail extends Component {
  static navigationOptions = {
    title: 'back',
  };

  constructor(props) {
    super(props);
    this.state = ({ loading: false, error: '', comment: '' });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { submit, navigation } = this.props;
    const { comment } = this.state;
    const { group } = navigation.state.params;
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

  render() {
    const { navigation } = this.props;
    const { group } = navigation.state.params;
    const { error } = this.state;

    let image = '';
    if (group.photo) {
      image = (<Image source={{ uri: group.photo }} style={styles.feedImg} />);
    } else {
      image = (<Image source={require('@assets/feed-img.jpg')} style={styles.feedImg} />);
    }

    let profileImage = null;
    if (group.User.photo) {
      profileImage = (<Image source={{ uri: group.User.photo }} style={styles.profilePic} />);
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.contentWrapper}>
          <View style={styles.feed}>
            <View style={styles.feedContent}>
              <View style={styles.feedTitle}>
                {profileImage}
                <Text style={styles.lightText}>
                  <Text style={styles.name}>
                    {group.User.firstName || group.User.email}
                  </Text>
                  <Text> created a group</Text>
                </Text>
              </View>
              <View>
                {image}
                <View style={styles.newGroupInfoWrapper}>
                  <View style={styles.newGroupNameWrapper}>
                    <Text style={styles.newGroupName}>{group.name}</Text>
                  </View>
                  {
                    group.outreach === 'area' &&
                    <Text style={styles.newGroupPlace}>
                      {[group.country, group.county, group.municipality, group.locality].filter(s => typeof s !== 'undefined').join(', ')}
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
            </View>
            <Relation users={group.User.relation} />
            <GroupComment id={group.id} />
            {error !== '' && <View><Text>{error}</Text></View>}
          </View>
        </ScrollView>
        {this.renderCommentForm()}
      </View>
    );
  }
}

GroupDetail.propTypes = {
  submit: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default submitComment(GroupDetail);
