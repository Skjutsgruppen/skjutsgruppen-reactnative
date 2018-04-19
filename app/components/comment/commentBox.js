import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { trans } from '@lang/i18n';
import { Colors } from '@theme';
import { Loading } from '@components/common';

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
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 18,
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
        <Text style={styles.sendText}>Send</Text>
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
        placeholder={trans('detail.write')}
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
        <Text>{trans('detail.a_post_on_your_fb_timeline')}</Text>
        <Text style={{ marginLeft: 12 }}>{trans('detail.a_tweet')}</Text>
      </View>
    );
  }

  render() {
    const { style } = this.props;
    const { offset } = this.state;

    return (
      <View style={[styles.footer, { bottom: offset }, style]}>
        <View style={styles.footerCommentSection}>
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
};

CommentBox.defaultProps = {
  loading: false,
  style: {},
  handleShowOptions: () => { },
  hasCalender: false,
  handleShowCalender: () => { },
};

export default CommentBox;

