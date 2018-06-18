import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Image, ViewPropTypes, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';
import { Loading } from '@components/common';
import Radio from '@components/add/radio';
import { AppText } from '@components/utils/texts';

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
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  footerSocialSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 18,
  },
  socialLabel: {
    fontSize: 12,
    marginLeft: 6,
  },
  commentInput: {
    ...Platform.select({
      ios: {
        height: 'auto',
      },
      android: {
        height: '100%',
      },
    }),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    paddingRight: 12,
    textAlignVertical: 'center',
    fontFamily: 'SFUIText-Regular',
  },
  send: {
    height: '100%',
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
      // shareFacebook: false,
      shareTwitter: false,
    };
  }

  componentWillMount() {
    const { user } = this.props;
    // if (user.fbId) {
    //   this.setState({ shareFacebook: true });
    // }

    if (user.twitterId) {
      this.setState({ shareTwitter: true });
    }
  }

  handleChange = text => this.setState({ text })

  handleBlur = () => this.setState({ writing: false });

  handleFocus = () => this.setState({ writing: true });

  sendComment = () => {
    // const { text, shareFacebook, shareTwitter } = this.state;
    const { text, shareTwitter } = this.state;
    const { handleSend } = this.props;
    const social = [];

    // if (shareFacebook) {
    //   social.push('Facebook');
    // }

    if (shareTwitter) {
      social.push('Twitter');
    }

    handleSend(text, social);
    this.setState({ text: '' });
  };

  // shareFacebookRadio = () => {
  //   const { shareFacebook } = this.state;

  //   this.setState({ shareFacebook: !shareFacebook });
  // }

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
    const { text } = this.state;

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
        style={styles.commentInput}
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
          {/* <Radio
            color="blue"
            active={this.state.shareFacebook}
            onPress={this.shareFacebookRadio}
            size={24}
          />
          <AppText size={12}>{trans('detail.a_post_on_your_fb_timeline')}</AppText> */}
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

    // if (!!user.fbId && !user.twitterId) {
    //   return (
    //     <View style={styles.footerSocialSection}>
    //       <Radio
    //         color="blue"
    //         active={this.state.shareFacebook}
    //         onPress={this.shareFacebookRadio}
    //         size={24}
    //       />
    //       <AppText size={12}>{trans('detail.a_post_about_this_ride_on_your_fb')}</AppText>
    //     </View>
    //   );
    // }

    if (!user.fbId && !!user.twitterId) {
      return (
        <View style={styles.footerSocialSection}>
          <Radio
            color="blue"
            active={this.state.shareTwitter}
            onPress={this.shareTwitterRadio}
            size={24}
          />
          <AppText size={12}>{trans('detail.a_tweet_about_this_ride')}</AppText>
        </View>
      );
    }

    return null;
  }

  render() {
    const { style } = this.props;
    const { offset } = this.state;

    return (
      <View style={[styles.footer, { bottom: offset }, style]}>
        {this.renderFooter()}
        <View style={styles.footerCommentSection}>
          {this.renderOption()}
          {this.renderCalendar()}
          {this.renderInput()}
          {this.renderSendButton()}
        </View>
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
