import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CustomButton from '@components/common/customButton';

class Button extends Component {
  static contextTypes = {
    isLoggedIn: PropTypes.bool,
    login: PropTypes.func,
    logout: PropTypes.func,
    props: PropTypes.shape({}),
  };

  onPress = () => {
    if (!this.context.isLoggedIn) {
      this.context.login();
    } else {
      this.props.onPress();
    }
  }

  render() {
    const { profile } = this.props;
    return (
      <CustomButton
        onPress={this.onPress}
        bgColor="#3b5998"
      >
        {this.context.isLoggedIn && profile ? `Continue as ${profile.name || ''}` : 'Sign in with Facebook'}
      </CustomButton>
    );
  }
}

Button.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
  }),
  onPress: PropTypes.func.isRequired,
};

Button.defaultProps = {
  profile: {},
  onPress: PropTypes.func.isRequired,
};


export default Button;
