import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Image, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { submitComment, withTripComment } from '@services/apollo/comment';
import { Loading } from '@components/common';
import Comment from '@components/comment/list';
import Relation from '@components/relation';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { Navbar } from '@components/new/common';
import Share from '@components/common/share';
import { withShare } from '@services/apollo/auth';
import { compose } from 'react-apollo';
import Date from '@components/date';

const AskComment = withTripComment(Comment);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
  section: {
    padding: 24,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgWrapper: {
    height: 224,
    backgroundColor: '#e0e0e0',
  },
  feedImage: {
    height: 224,
    width: '100%',
  },
  profilePic: {
    height: 60,
    width: 60,
    resizeMode: 'cover',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.border.white,
    position: 'absolute',
    top: 224 - (60 / 2),
    right: 20,
    zIndex: 20,
  },
  detail: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  username: {
    color: Colors.text.blue,
    fontWeight: 'bold',
    marginRight: 4,
  },
  text: {
    lineHeight: 22,
  },
  lightText: {
    color: Colors.text.darkGray,
  },
  stopsLabel: {
    color: Colors.text.pink,
    fontWeight: 'bold',
  },
  fromTo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    marginVertical: 12,
  },
  userComment: {
    margin: 24,
    paddingBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  relationLabelWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 6,
  },
  relationLabel: {
    fontSize: 12,
  },
  chevronDown: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    marginLeft: 16,
    marginTop: 2,
  },
  btnSection: {
    justifyContent: 'space-between',
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 24,
    backgroundColor: Colors.background.fullWhite,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOpacity: 1.0,
    shadowRadius: 2,
    borderRadius: 24,
  },
  btnIcon: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
    marginRight: 16,
  },
  btnLabel: {
    color: Colors.text.gray,
  },
  commentSection: {
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  footer: {
    backgroundColor: Colors.background.fullWhite,
    borderTopWidth: 2,
    borderColor: Colors.border.lightGray,
  },
  footerCommentSection: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerSocialSection: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  moreIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 24,
  },
  moreIcon: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  commentInput: {
    height: '100%',
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 12,
    textAlignVertical: 'center',
  },
  send: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  sendText: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 16,
  },
  actionsWrapper: {
    marginTop: 'auto',
    marginHorizontal: 16,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  action: {
    padding: 16,
  },
  actionLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
  horizontalDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  closeWrapper: {
    backgroundColor: Colors.background.fullWhite,
  },
  closeModal: {
    padding: 16,
  },
});

class AskDetail extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({
      loading: false,
      error: '',
      comment: '',
      modalVisible: false,
      writingComment: false,
      modalDetail: {},
      modalType: '',
      isOpen: false,
    });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { submit, navigation } = this.props;
    const { comment } = this.state;
    const { ask } = navigation.state.params;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        submit(ask.id, null, comment).then(() => {
          Alert.alert('Success!', 'Comment added');
          this.setState({ comment: '', loading: false });
        }).catch((err) => {
          this.setState({ loading: false, error: err.message });
        });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    } else {
      Alert.alert('Error!', validation.errors.join('\n'));
      this.setState({ loading: false });
    }
  }

  onSharePress = (modalType, modalDetail) => {
    this.setState({ isOpen: true, modalType, modalDetail });
  }

  onShare = (share) => {
    this.props.share({ id: this.state.modalDetail.id, type: this.state.modalType === 'group' ? 'Group' : 'Trip', share })
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

  onCommentChange = (text) => {
    this.setState({ comment: text });
  }

  onMapPress = () => {
    const { navigation } = this.props;
    const { ask } = navigation.state.params;
    const coordinates = {
      start: ask.TripStart,
      end: ask.TripEnd,
      stops: ask.Stops,
    };

    navigation.navigate('Route', { coordinates });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
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

  handleFocus = () => {
    this.setState({ writingComment: true });
  }

  handleBlur = () => {
    this.setState({ writingComment: false });
  }

  renderButton = () => {
    const { loading } = this.state;
    const content = loading ? <Loading /> : <Text style={styles.sendText}>Send</Text>;
    return (
      <TouchableOpacity onPress={this.onSubmit} style={styles.send}>
        {content}
      </TouchableOpacity>);
  }

  renderModal() {
    return (
      <Modal
        animationType="slide"
        transparent
        onRequestClose={() => this.setState({ modalVisible: false })}
        visible={this.state.modalVisible}
      >
        <View style={styles.modalContent}>
          <View style={styles.actionsWrapper}>
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>Create your experience</Text>
            </TouchableOpacity>
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>Share your live location </Text>
            </TouchableOpacity>
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>Mute two hours</Text>
            </TouchableOpacity>
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>Mute one day</Text>
            </TouchableOpacity>
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>Mute forever</Text>
            </TouchableOpacity>
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>Embeded with HTML</Text>
            </TouchableOpacity>
            <View style={styles.horizontalDivider} />
            <TouchableOpacity
              style={styles.action}
            >
              <Text style={styles.actionLabel}>Report this ride</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.closeWrapper}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => this.setModalVisible(!this.state.modalVisible)}
            >
              <Text style={styles.actionLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

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


  renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.footerCommentSection}>
        {
          !this.state.writingComment &&
          <TouchableOpacity
            style={styles.moreIconWrapper}
            onPress={() => this.setModalVisible(true)}
          >
            <Image source={require('@icons/icon_more_gray.png')} style={styles.moreIcon} />
          </TouchableOpacity>
        }
        <TextInput
          value={this.state.comment}
          onChangeText={text => this.onCommentChange(text)}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          placeholderTextColor="#000"
          placeholder="Write"
          multiline
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoCapitalize={'none'}
          returnKeyType={'done'}
          style={styles.commentInput}
        />
        {
          this.state.writingComment &&
          this.renderButton()
        }
      </View>
      {
        this.state.writingComment &&
        <View style={styles.footerSocialSection}>
          <Text>A post on your Facebook timeline</Text>
          <Text style={{ marginLeft: 12 }}>A Tweet</Text>
        </View>
      }
    </View>
  );

  render() {
    const { navigation } = this.props;
    const { ask } = navigation.state.params;
    const { error } = this.state;

    let image = null;
    if (ask.mapPhoto) {
      image = (<Image source={{ uri: ask.mapPhoto }} style={styles.feedImage} />);
    }
    if (ask.photo) {
      image = (<Image source={{ uri: ask.photo }} style={styles.feedImage} />);
    }

    let profileImage = null;
    if (ask.User.photo) {
      profileImage = (<Image source={{ uri: ask.User.photo }} style={styles.profilePic} />);
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }

    return (
      <View style={styles.wrapper}>
        <Navbar handleBack={this.goBack} showShare handleShare={() => this.onSharePress('ask', ask)} />
        <ScrollView>
          <TouchableOpacity onPress={this.onMapPress}>
            <View style={styles.imgWrapper}>
              {image}
            </View>
          </TouchableOpacity>
          {profileImage}
          <View style={styles.detail}>
            <Text style={[styles.text, styles.lightText]}>
              <Text style={styles.username} onPress={() => { }}>
                {ask.User.firstName || ask.User.email}
              </Text>
              <Text> asks for a ride.</Text>
            </Text>
            <Text style={styles.fromTo}>{ask.TripStart.name} - {ask.TripEnd.name}</Text>
            <Text style={[styles.date, styles.lightText]}><Date format="MMM DD HH:mm">{ask.date}</Date></Text>
            {
              ask.Stops.length > 0 &&
              <Text style={[styles.text, styles.lightText]}>
                <Text style={styles.stopsLabel}>Stops in </Text>
                {ask.Stops.map(place => place.name).join(', ')}
              </Text>
            }
          </View>
          <View style={styles.userComment}>
            <Text style={[styles.text]}>{ask.description}</Text>
          </View>
          {
            ask.User.relation.length > 0 &&
            <View style={{ alignItems: 'center' }}>
              <Text>This is how you know</Text>
              <Relation users={ask.User.relation} />
            </View>
          }
          {error !== '' && <View><Text>{error}</Text></View>}
          <AskComment onCommentPress={this.onCommentPress} id={ask.id} />
        </ScrollView>
        {this.renderFooter()}
        {this.renderModal()}
        {this.renderShareModal()}
      </View>
    );
  }
}

AskDetail.propTypes = {
  share: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default compose(withShare, submitComment)(AskDetail);
