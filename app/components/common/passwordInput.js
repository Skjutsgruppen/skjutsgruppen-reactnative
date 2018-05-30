import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    paddingHorizontal: 30,
    backgroundColor: Colors.background.mutedBlue,
  },
  input: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 15,
    height: 80,
    flex: 1,
  },
});

class PasswordInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibility: false,
    };
  }

  toggleVisibility = () => {
    this.setState({
      visibility: !this.state.visibility,
    });
  }

  render() {
    const { visibility } = this.state;
    const { onChangeText, onSubmitEditing, style, ...props } = this.props;
    return (
      <View style={[styles.wrapper, style]}>
        <TextInput
          style={styles.input}
          placeholder={trans('onboarding.password')}
          secureTextEntry={!visibility}
          underlineColorAndroid="transparent"
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          {...props}
        />
        <TouchableOpacity onPress={this.toggleVisibility}>
          <Icon
            name={visibility ? 'ios-eye-off' : 'ios-eye'}
            size={36}
            style={{ color: '#888' }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

PasswordInput.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
};

PasswordInput.defaultProps = {
  style: {},
};

export default PasswordInput;
