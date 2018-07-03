import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Image, ViewPropTypes, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';
import { Loading } from '@components/common';
import Radio from '@components/add/radio';
import { AppText } from '@components/utils/texts';
import Share from '@services/facebook/share';
import { GROUP_FEED_TYPE_COMMENT } from '@config/constant';

const styles = StyleSheet.create({
  footer: {
    backgroundColor: Colors.background.fullWhite,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  footerCommentSection: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  footerSocialSection: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    ...Platform.select({
      android: {
        position: 'absolute',
        bottom: 4,
        left: 0,
        right: 0,
      },
    }),
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
    paddingHorizontal: 18,
  },
  socialLabel: {
    fontSize: 12,
    marginLeft: 6,
  },
  commentInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'SFUIText-Regular',
    fontSize: 14,
    paddingRight: 12,
    ...Platform.select({
      ios: {
        paddingTop: 21,
      },
    }),
    textAlignVertical: 'center',
  },
  send: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});

class CommentBox extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      writing: false,
      text: '',
      offset: 0,
      shareFacebook: false,
      shareTwitter: false,
    };
  }

  componentWillMount() {
    const { user } = this.props;
    if (user.fbId) {
      this.setState({ shareFacebook: true });
    }

    if (user.twitterId) {
      this.setState({ shareTwitter: true });
    }
  }

  handleChange = text => this.setState({ text })

  handleBlur = () => this.setState({ writing: false });

  handleFocus = () => this.setState({ writing: true });

  sendComment = async () => {
    const { text, shareFacebook, shareTwitter } = this.state;
    const { handleSend, trip } = this.props;
    const social = [];

    if (shareTwitter) {
      social.push('Twitter');
    }

    handleSend(text, social);

    if (shareFacebook) {
      Share.link(GROUP_FEED_TYPE_COMMENT, trip);
    }

    this.setState({ text: '' });
  };

  shareFacebookRadio = () => {
    const { shareFacebook } = this.state;

    this.setState({ shareFacebook: !shareFacebook });
  }

  shareTwitterRadio = () => {
    const { shareTwitter } = this.state;

    this.setState({ shareTwitter: !shareTwitter });
  }

  renderSendButton = () => {
    const { loading } = this.props;
    const { text } = this.state;

    if (loading) {
      return (
        <View style={styles.send}>
          <Loading />
        </View>
      );
    }

    if (text.length < 1) {
      return null;
    }

    return (
      <TouchableOpacity onPress={this.sendComment} style={styles.send}>
        <AppText fontVariation="bold" color={Colors.text.blue}>{trans('global.send')}</AppText>
      </TouchableOpacity>
    );
  }

  renderOption = () => {
    const { handleShowOptions } = this.props;
    const { writing } = this.state;

    if (writing) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={handleShowOptions}
      >
        <Image source={require('@assets/icons/ic_options.png')} style={styles.moreIcon} />
      </TouchableOpacity>
    );
  }

  renderCalendar = () => {
    const { hasCalender, handleShowCalender } = this.props;
    const { writing } = this.state;

    if (!writing && hasCalender) {
      return (
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => handleShowCalender(true)}
        >
          <Image source={require('@assets/icons/ic_calender.png')} style={styles.moreIcon} />
        </TouchableOpacity>
      );
    }
    return null;
  }

  renderInput = () => {
    const { loading } = this.props;
    const { text, writing } = this.state;

    let writtingStyle = {};

    if (Platform.OS === 'android') {
      writtingStyle = { paddingBottom: writing ? 54 : 8 };
    }

    return (
      <TextInput
        value={text}
        onChangeText={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        placeholderTextColor="#000"
        placeholder={trans('global.write')}
        multiline
        underlineColorAndroid="transparent"
        autoCorrect={false}
        autoCapitalize={'none'}
        returnKeyType={'done'}
        style={[styles.commentInput, writtingStyle]}
        editable={!loading}
      />
    );
  }

  renderFooter = () => {
    const { writing } = this.state;
    const { user } = this.props;

    if (!writing) {
      return null;
    }

    if (!!user.fbId && !!user.twitterId) {
      return (
        <View style={styles.footerSocialSection}>
          <Radio
            color="blue"
            active={this.state.shareFacebook}
            onPress={this.shareFacebookRadio}
            size={24}
          />
          <AppText size={12} style={{ marginLeft: 12 }}>{trans('detail.a_post_on_your_fb_timeline')}</AppText>
          <Radio
            color="blue"
            active={this.state.shareTwitter}
            onPress={this.shareTwitterRadio}
            size={24}
            style={{ marginLeft: 16 }}
          />
          <AppText size={12} style={{ marginLeft: 12 }}>{trans('detail.a_tweet')}</AppText>
        </View>
      );
    }

    if (!!user.fbId && !user.twitterId) {
      return (
        <View style={styles.footerSocialSection}>
          <Radio
            color="blue"
            active={this.state.shareFacebook}
            onPress={this.shareFacebookRadio}
            size={24}
          />
          <AppText size={12} style={{ marginLeft: 12 }}>{trans('detail.a_post_about_this_ride_on_your_fb')}</AppText>
        </View>
      );
    }

    if (!user.fbId && !!user.twitterId) {
      return (
        <View style={styles.footerSocialSection}>
          <Radio
            color="blue"
            active={this.state.shareTwitter}
            onPress={this.shareTwitterRadio}
            size={24}
          />
          <AppText size={12} style={{ marginLeft: 12 }}>{trans('detail.a_tweet_about_this_ride')}</AppText>
        </View>
      );
    }

    return null;
  }

  render() {
    const { style } = this.props;
    const { offset, writing } = this.state;

    let commentStyle = {};

    if (Platform.OS === 'android') {
      commentStyle = { height: writing ? 92 : 58 };
    }

    return (
      <View style={[styles.footer, { bottom: offset }, style]}>
        <View style={[styles.footerCommentSection, commentStyle]}>
          {this.renderOption()}
          {this.renderCalendar()}
          {this.renderInput()}
          {this.renderSendButton()}
        </View>
        {this.renderFooter()}
      </View>
    );
  }
}

CommentBox.propTypes = {
  loading: PropTypes.bool,
  style: ViewPropTypes.style,
  handleSend: PropTypes.func.isRequired,
  handleShowOptions: PropTypes.func,
  hasCalender: PropTypes.bool,
  handleShowCalender: PropTypes.func,
  user: PropTypes.shape({
    fbId: PropTypes.string,
    twitterId: PropTypes.string,
  }).isRequired,
  trip: PropTypes.shape({ id: PropTypes.number }).isRequired,
};

CommentBox.defaultProps = {
  loading: false,
  style: {},
  handleShowOptions: () => { },
  hasCalender: false,
  handleShowCalender: () => { },
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(CommentBox);
