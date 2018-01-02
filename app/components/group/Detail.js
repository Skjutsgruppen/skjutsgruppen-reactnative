import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, Image, Modal, TextInput, TouchableOpacity, Alert, TouchableWithoutFeedback, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { submitComment } from '@services/apollo/comment';
import { withGroupFeed } from '@services/apollo/group';
import { withLeaveGroup } from '@services/apollo/notification';
import { withShare } from '@services/apollo/auth';
import { Wrapper, Loading, NavBar } from '@components/common';
import Relation from '@components/relation';
import Colors from '@theme/colors';
import GroupFeed from '@components/group/feed/list';
import Share from '@components/common/share';
import { FEEDABLE_GROUP, FEEDABLE_TRIP, STRETCH_TYPE_AREA, STRETCH_TYPE_ROUTE } from '@config/constant';

const GroupFeedList = withGroupFeed(GroupFeed);

const styles = StyleSheet.create({
  contentWrapper: {
    backgroundColor: '#fff',
  },
  lightText: {
    color: '#777777',
  },
  feed: {
    backgroundColor: '#fff',
    marginBottom: 60,
    flex: 1,
  },
  header: {
    marginBottom: 24,
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
  info: {
    paddingHorizontal: 24,
  },
  stopsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopText: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 8,
  },
  stopsIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 4,
  },
  messageText: {
    paddingTop: 8,
    marginBottom: 16,
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
  button: {
    margin: 24,
  },
  leaveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    bottom: 12,
    height: 32,
    width: 120,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.fullWhite,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  leaving: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leavingText: {
    marginRight: 4,
  },
  leaveText: {
    fontSize: 13,
    color: Colors.text.darkGray,
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
  actionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.fullWhite,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  action: {
    width: '33.33%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  actionDevider: {
    height: '100%',
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border.lightGray,
  },
  actionIcon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    marginRight: 12,
  },
  actionLabel: {
    fontWeight: 'bold',
    color: Colors.text.blue,
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

class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({ loading: false, leaveLoading: false, error: '', comment: '', modalDetail: {}, modalType: '', isOpen: false });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { submit, group } = this.props;
    const { comment } = this.state;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        submit(null, group.id, comment).then(() => {
          Alert.alert('Success!', 'Comment added');
          this.setState({ comment: '', loading: false });
        }).catch((err) => {
          this.setState({ loading: false, error: err.message });
        });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    } else {
      Alert.alert('Alert!', validation.errors.join('\n'));
      this.setState({ loading: false });
    }
  }

  onSharePress = (modalType, modalDetail) => {
    this.setState({ isOpen: true, modalType, modalDetail });
  }

  onShare = (share) => {
    this.props.share({ id: this.state.modalDetail.id, type: this.state.modalType === 'group' ? FEEDABLE_GROUP : FEEDABLE_TRIP, share })
      .then(() => this.setState({ isOpen: false }))
      .catch(console.warn);
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

  onCommentPress = (id) => {
    const { navigation } = this.props;
    navigation.navigate('UserProfile', { profileId: id });
  }

  onPress = () => {
    const { group, navigation } = this.props;
    navigation.navigate('UserProfile', { profileId: group.User.id });
  }

  onMapPress = () => {
    const { navigation, group } = this.props;
    const coordinates = {
      start: group.TripStart,
      end: group.TripEnd,
      stops: group.Stops,
    };

    navigation.navigate('Route', { coordinates });
  }

  leaveGroup = () => {
    const { group, leaveGroup, refresh } = this.props;
    this.setState(
      { leaveLoading: true },
      () => leaveGroup(group.id)
        .then(refresh)
        .catch(console.warn),
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
      if (member && member.id === user.id) {
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

    let image = null;
    if (group.photo) {
      image = (<Image source={{ uri: group.photo }} style={styles.feedImg} />);
    } else if (group.mapPhoto) {
      image = (<Image source={{ uri: group.mapPhoto }} style={styles.feedImg} />);
    } else {
      image = (<Image source={require('@assets/feed-img.jpg')} style={styles.feedImg} />);
    }

    let groupType = '';
    if (group.type === 'OpenGroup') {
      groupType = 'Open';
    } else if (group.type === 'ClosedGroup') {
      groupType = 'Closed';
    }

    return (
      <View style={styles.header}>
        <View style={styles.feedContent}>
          <View>
            {image}
            <View style={styles.newGroupInfoWrapper}>
              <View style={styles.newGroupNameWrapper}>
                <Text style={styles.newGroupName}>{group.name}</Text>
              </View>
              {
                group.outreach === STRETCH_TYPE_AREA &&
                <Text style={styles.newGroupPlace}>
                  {[group.country, group.county, group.municipality, group.locality].filter(s => s).join(', ')}
                </Text>
              }

              {
                group.outreach === STRETCH_TYPE_ROUTE &&
                <Text style={styles.newGroupPlace}>
                  {group.TripStart.name} - {group.TripEnd.name}
                </Text>
              }
              <Text style={styles.newGroupInfo}>
                {groupType} group, {group.GroupMembers.length} {group.GroupMembers.length > 1 ? 'participants' : 'participant'}
              </Text>
            </View>
            {this.isGroupJoined() && this.renderLeaveButton(leaveLoading)}
          </View>
          <View style={styles.info}>
            {
              group.Stops.length > 0 &&
              <View style={styles.stopText}>
                <Image source={require('@icons/icon_stops.png')} style={styles.stopsIcon} />
                <Text style={styles.lightText}>Stops in {group.Stops.map(place => place.name).join(', ')}</Text>
              </View>
            }
            <View style={styles.messageText}>
              <Text>{group.description}</Text>
            </View>
          </View>
        </View>
        <Relation users={group.User.relation} />
        <View style={styles.actionsWrapper}>
          <TouchableOpacity style={styles.action}>
            <Image source={require('@icons/icon_calender.png')} style={styles.actionIcon} />
            <Text style={styles.actionLabel}>Calender</Text>
          </TouchableOpacity>
          <View style={styles.actionDevider} />
          <TouchableOpacity style={[styles.action, styles.shareAction]} onPress={() => this.onSharePress('group', group)}>
            <Image source={require('@icons/icon_share.png')} style={styles.actionIcon} />
            <Text style={styles.actionLabel}>Share</Text>
          </TouchableOpacity>
          <View style={styles.actionDevider} />
          <TouchableOpacity style={styles.action}>
            <Image source={require('@icons/icon_more_green.png')} style={styles.actionIcon} />
            <Text style={styles.actionLabel}>More</Text>
          </TouchableOpacity>
        </View>
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
    );
  }

  renderLeaveButton = leaveLoading => (
    <View style={styles.leaveButton}>
      {
        leaveLoading ?
          <View style={styles.leaving}>
            <Text style={[styles.leaveText, styles.leavingText]}>Leaving</Text>
            <Loading />
          </View>
          :
          <TouchableWithoutFeedback
            onPress={this.leaveGroup}
          >
            <View><Text style={styles.leaveText}> Leave group </Text></View>
          </TouchableWithoutFeedback>
      }
    </View>
  );

  renderShareModal() {
    return (
      <Modal
        visible={this.state.isOpen}
        onRequestClose={() => this.setState({ isOpen: false })}
        animationType="slide"
      >
        <ScrollView>
          <Share
            modal
            showGroup={this.state.modalType !== 'group'}
            onNext={this.onShare}
            onClose={this.onClose}
          />
        </ScrollView>
      </Modal>
    );
  }

  render() {
    const { group, navigation } = this.props;
    const header = this.header(this.state.leaveLoading);
    return (
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} onMapPress={this.onMapPress} />
        <View style={styles.feed}>
          <GroupFeedList
            header={header}
            navigation={navigation}
            groupId={group.id}
          />
        </View>
        {this.renderCommentForm()}
        {this.renderShareModal()}
      </Wrapper>
    );
  }
}

Detail.propTypes = {
  share: PropTypes.func.isRequired,
  leaveGroup: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
    photo: PropTypes.string,
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

export default compose(withShare, withLeaveGroup, submitComment, connect(mapStateToProps))(Detail);
