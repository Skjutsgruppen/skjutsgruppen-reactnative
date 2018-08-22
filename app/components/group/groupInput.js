import React, { Component } from 'react';
import { View, Animated, StyleSheet, Modal, TextInput, Platform, Image, KeyboardAvoidingView } from 'react-native';
import Colors from '@theme/colors';
import TouchableHighlight from '@components/touchableHighlight';
import { AppText } from '@components/utils/texts';
import PropTypes from 'prop-types';
import { RoundedButton } from '@components/common';
import ChevronRight from '@assets/icons/ic_back.png';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 32,
    marginVertical: 16,
    textAlign: 'center',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.fullWhite,
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowColor: '#000',
      },
    }),
    height: 80,
  },
  searchInput: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 15,
    height: 48,
    paddingVertical: 4,
    flex: 1,
    borderRadius: 18,
    paddingLeft: 16,
    marginRight: 16,
  },
  commentInput: {
    height: 80,
    fontFamily: 'SFUIText-Regular',
    fontSize: 14,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        paddingTop: 21,
      },
    }),
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    paddingRight: 0,
  },
  placeInput: {
    backgroundColor: Colors.background.fullWhite,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 0,
    flex: 1,
  },
  chevron: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 14,
    marginTop: 16,
    transform: [{
      rotate: '-90deg',
    }],
  },
  buttonWrapper: {
    marginTop: 'auto',
    backgroundColor: 'white',
    ...Platform.select({
      android: {
        elevation: 15,
      },
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
    }),
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginVertical: 18,
    marginHorizontal: 20,
  },
  backButton: {
    height: 50,
    width: 50,
    marginRight: 20,
  },
  iconWrapper: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginTop: 14,
    marginLeft: 14,
    overflow: 'hidden',
  },
  icon: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: Colors.background.fullWhite,
  },
});

class GroupInput extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      showModal: false,
      text: '',
    });
  }

  handleTextChange = (text) => {
    this.setState({ text });
  }

  handleName = () => {
    this.setState({
      showModal: false,
    });
  }

  handleModalVisibility = (showModal) => {
    this.setState({ showModal });
  }

  renderModal() {
    const { showModal } = this.state;
    const { onChangeText, value, showTextCount, height } = this.props;

    return (
      <Modal
        visible={showModal}
        onRequestClose={() => this.handleModalVisibility(false)}
        animationType="slide"
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <View style={styles.iconWrapper}>
            <TouchableHighlight onPress={() => this.handleModalVisibility(false)} style={styles.backButton}>
              <Animated.View style={styles.icon}>
                <Image source={ChevronRight} style={styles.chevron} />
              </Animated.View>
            </TouchableHighlight>
          </View>
          <TextInput
            underlineColorAndroid="transparent"
            value={value}
            // height={height}
            onChangeText={onChangeText}
            autoCorrect={false}
            style={[styles.commentInput]}
            autoCapitalize={'none'}
            showTextCount
            {...this.props}
          />
          {showTextCount && <AppText style={{ color: Colors.text.gray, textAlign: 'right', paddingHorizontal: 20 }}>{value.length}/22</AppText> }
          <View style={styles.buttonWrapper}>
            <RoundedButton
              bgColor={Colors.background.pink}
              onPress={() => this.handleModalVisibility(false)}
              style={styles.button}
            >
              {trans('global.done')}
            </RoundedButton>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
  render() {
    const { height, inputStyle, value } = this.props;

    return (
      <View>
        <View style={[styles.inputWrapper]}>
          <TouchableHighlight
            style={[styles.placeInput, { height }, { ...inputStyle }]}
            onPress={() => this.handleModalVisibility(true)}
          >
            <AppText size={14} color={Colors.text.gray}>{value && value !== '' ? value : trans('global.write') }</AppText>
          </TouchableHighlight>
          {this.renderModal()}
        </View>
      </View>
    );
  }
}

GroupInput.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  height: PropTypes.number,
  showTextCount: PropTypes.bool,
  inputStyle: TouchableHighlight.propTypes.style,
};

GroupInput.defaultProps = {
  height: 80,
  inputStyle: {},
  showTextCount: false,
};

export default GroupInput;
