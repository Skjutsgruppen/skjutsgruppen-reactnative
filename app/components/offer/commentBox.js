import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Image, ViewPropTypes, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { trans } from '@lang/i18n';
import { Colors } from '@theme';
import { Loading } from '@components/common';
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
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 18,
  },
  commentInput: {
    height: Platform.OS === 'ios' ? 'auto' : '100%',
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
      writting: false,
      text: '',
      offset: 0,
    };
  }

  handleChange = text => this.setState({ text })

  handleBlur = () => this.setState({ writting: false });

  handleFocus = () => this.setState({ writting: true });

  sendComment = () => {
    const { text } = this.state;
    const { handleSend } = this.props;
    handleSend(text);
    this.setState({ text: '' });
  };

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
        <AppText fontVariation="bold" colo={Colors.text.blue}>Send</AppText>
      </TouchableOpacity>
    );
  }

  renderOption = () => {
    const { handleShowOptions } = this.props;
    const { writting } = this.state;

    if (writting) {
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
    const { writting } = this.state;

    if (!writting && hasCalender) {
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
    const { writting } = this.state;

    if (!writting) {
      return null;
    }

    return (
      <View style={styles.footerSocialSection}>
        <AppText size={12}>{trans('trip.a_post_on_your_fb_timeline')}</AppText>
        <AppText size={12} style={{ marginLeft: 12 }}>{trans('trip.a_tweet')}</AppText>
      </View>
    );
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
};

CommentBox.defaultProps = {
  loading: false,
  style: {},
  handleShowOptions: () => { },
  hasCalender: false,
  handleShowCalender: () => { },
};

export default CommentBox;
