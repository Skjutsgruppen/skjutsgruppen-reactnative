import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Loading, FloatingNavbar } from '@components/common';
import Comment from '@components/comment/list';
import Colors from '@theme/colors';
import Date from '@components/date';
import { submitComment, withNewsComment } from '@services/apollo/comment';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';

const NewsComment = withNewsComment(Comment);

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
  profilePicWrapper: {
    position: 'absolute',
    top: 224 - (60 / 2),
    right: 20,
    zIndex: 20,
  },
  profilePic: {
    height: 60,
    width: 60,
    resizeMode: 'cover',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.border.white,
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
  relationTitle: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 6,
  },
  downArrow: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    position: 'absolute',
    top: 2,
    right: 0,
  },
  btnSection: {
    justifyContent: 'space-around',
    paddingVertical: 24,
  },
  pillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    maxWidth: '45%',
    borderRadius: 24,
    paddingHorizontal: 24,
    backgroundColor: Colors.background.fullWhite,
    shadowOffset: { width: 0, height: -1 },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 2,
  },
  returnModalContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f6f9fc',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  btnIcon: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
    marginRight: 16,
  },
  btnLabel: {
    fontSize: 18,
    fontWeight: 'bold',
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

class NewsDetail extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: '',
      success: '',
      writingComment: false,
      comment: '',
    };
  }

  onCommentChange = (text) => {
    this.setState({ comment: text });
  }

  onProfilePress = (id) => {
    const { navigation } = this.props;

    navigation.navigate('UserProfile', { profileId: id });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { submit, navigation } = this.props;
    const { comment } = this.state;
    const { news } = navigation.state.params;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        submit({ newsId: news.id, text: comment }).then(() => {
          this.setState({ comment: '', loading: false, error: '', success: getToast(['COMMENT_ADDED']) });
        }).catch((err) => {
          this.setState({ loading: false, error: getToast(err) });
        });
      } catch (err) {
        this.setState({ loading: false, error: getToast(err) });
      }
    } else {
      this.setState({ loading: false, error: getToast(validation.errors) });
    }
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  checkValidation() {
    const errors = [];
    const { comment } = this.state;

    if (comment === '') {
      errors.push('COMMENT_REQUIRED');
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

  renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.footerCommentSection}>
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
  )

  renderButton = () => {
    const { loading } = this.state;
    const content = loading ? <Loading /> : <Text style={styles.sendText}>Send</Text>;
    return (
      <TouchableOpacity onPress={this.onSubmit} style={styles.send}>
        {content}
      </TouchableOpacity>);
  }

  render() {
    const { navigation } = this.props;
    const { news } = navigation.state.params;
    const { error, success } = this.state;

    let image = null;

    if (news.photo) {
      image = (<Image source={{ uri: news.photo }} style={styles.image} />);
    }

    return (
      <View style={styles.wrapper}>
        <FloatingNavbar
          handleBack={this.goBack}
        />
        <ScrollView>
          <View style={styles.imgWrapper} key="photo">
            {image}
          </View>
          <View style={styles.detail}>
            <Text style={[styles.text, styles.lightText]}>
              <Text style={styles.username}>
                Your movement
              </Text>
            </Text>
            <Text style={[styles.date, styles.lightText]}><Date format="MMM DD HH:mm">{news.updatedAt}</Date></Text>
            <Text>{news.body}</Text>
          </View>
          <Toast message={error} type="error" />
          <Toast message={success} type="success" />
          <NewsComment navigation={navigation} onCommentPress={this.onProfilePress} id={news.id} />
        </ScrollView>
        {this.renderFooter()}
      </View>
    );
  }
}

NewsDetail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  submit: PropTypes.func.isRequired,
};

export default compose(submitComment)(NewsDetail);
