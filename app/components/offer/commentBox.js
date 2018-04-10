import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';
import { Loading } from '@components/common';
import Radio from '@components/add/radio';

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Colors.background.fullWhite,
    borderTopWidth: 2,
    borderColor: Colors.border.lightGray,
  },
  footerCommentSection: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
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
    height: '100%',
    flex: 1,
    fontSize: 14,
    paddingRight: 12,
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

  sendComment = () => {
    const { text, shareFacebook, shareTwitter } = this.state;
    const { handleSend } = this.props;
    const social = [];

    if (shareFacebook) {
      social.push('Facebook');
    }

    if (shareTwitter) {
      social.push('Twitter');
    }

    handleSend(text, social);
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
        <Text style={styles.sendText}>Send</Text>
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
          <Radio
            color="blue"
            active={this.state.shareFacebook}
            onPress={this.shareFacebookRadio}
            size={24}
          />
          <Text style={styles.socialLabel}>{trans('trip.a_post_on_your_fb_timeline')}</Text>
          <Radio
            color="blue"
            active={this.state.shareTwitter}
            onPress={this.shareTwitterRadio}
            size={24}
            style={{ marginLeft: 16 }}
          />
          <Text style={styles.socialLabel}>{trans('trip.a_tweet')}</Text>
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
          <Text style={styles.socialLabel}>A post about this ride on your Facebook timeline</Text>
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
          <Text style={styles.socialLabel}>A tweet about this ride</Text>
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
