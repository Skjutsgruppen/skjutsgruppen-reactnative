import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
} from 'react-native';
import Colors from '@theme/colors';
import Relation from '@components/common/relation';
import ProfilePic from '@assets/profilePic.jpg';
import Comment from '@components/common/comment';

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
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  feedImage: {
    height: 224,
    width: '100%',
    backgroundColor: '#e0e0e0',
    // resizeMode: 'cover',
  },
  profilePic: {
    height: 60,
    width: 60,
    resizeMode: 'cover',
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: '#ddd',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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

const users = [
  {
    source: ProfilePic,
  },
  {
    source: ProfilePic,
  },
  {
    source: ProfilePic,
  },
  {
    source: ProfilePic,
  },
];

class FeedDetail extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    modalVisible: false,
    comment: '',
    writingComment: false,
  }

  onCommentChange = (text) => {
    this.setState({ comment: text });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  handleFocus = () => {
    this.setState({ writingComment: true });
  }

  handleBlur = () => {
    this.setState({ writingComment: false });
  }

  handleSendComment = () => {
    Keyboard.dismiss();
    this.setState({ comment: '' });
  }

  renderModal() {
    return (
      <Modal
        animationType="slide"
        transparent
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

  renderNavbar = () => (
    <View style={styles.navbar}>
      <TouchableOpacity>
        <Image source={require('@icons/ic_chevron_left.png')} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image source={require('@icons/ic_share_white.png')} />
      </TouchableOpacity>
    </View>
  );

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
          style={styles.commentInput}
        />
        {
          this.state.writingComment &&
          <TouchableOpacity onPress={this.handleSendComment} style={styles.send}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
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
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
        {this.renderNavbar()}
        <ScrollView>
          <Image source={require('@assets/feed-map.jpg')} style={styles.feedImage} />
          <Image source={require('@assets/profilePic.jpg')} style={[styles.profilePic]} />
          <View style={styles.detail}>
            <Text style={[styles.text, styles.lightText]}>
              <Text style={styles.username} onPress={() => Alert.alert('this is alert')}>Lovisa </Text>
              offers 1 seat
            </Text>
            <Text style={styles.fromTo}>Gothemburg, Sweden - Barcelona, Barca - Street, Spain</Text>
            <Text style={[styles.date, styles.lightText]}>Oct 20, 2017, 09.00</Text>
            <Text style={[styles.text, styles.lightText]}>
              <Text style={styles.stopsLabel}>Stops in </Text>Berlin, paris
            </Text>
          </View>
          <View style={styles.userComment}>
            <Text style={[styles.text]}>Hi everyone I'm going down to Barcelona, chilaxing for a while. Wanna join? I would love if you help to drive part of the way and help pay for the gas. And hey - I got a dog! :-)</Text>
          </View>
          <View style={styles.relationLabelWrapper}>
            <Text style={[styles.lightText, styles.relationLabel]}>This is how you know Johline</Text>
            <TouchableOpacity>
              <Image source={require('@assets/icons/icon_chevron_down.png')} style={styles.chevronDown} />
            </TouchableOpacity>
          </View>
          <Relation users={users} size={40} />
          <View style={[styles.section, styles.flexRow, styles.btnSection]}>
            <TouchableOpacity style={styles.pillBtn}>
              <Image source={require('@icons/icon_return.png')} style={styles.btnIcon} />
              <Text style={styles.btnLabel}>Return</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pillBtn}>
              <Image source={require('@icons/icon_calender.png')} style={styles.btnIcon} />
              <Text style={styles.btnLabel}>Recurring</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.commentSection}>
            <Comment />
            <Comment />
            <Comment />
          </View>
        </ScrollView>
        {
          this.renderFooter()
        }
        {
          this.renderModal()
        }
      </KeyboardAvoidingView>
    );
  }
}

export default FeedDetail;
