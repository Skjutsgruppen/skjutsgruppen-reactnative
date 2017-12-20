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
    const { profile } = this.props;
    if (!this.context.isLoggedIn) {
      this.context.login();
    } else if (profile.name) {
      this.props.onPress();
    } else {
      this.context.logout();
    }
  }

  render() {
    const { profile, label } = this.props;
    return (
      <CustomButton
        onPress={this.onPress}
        bgColor="#3b5998"
      >
        {this.context.isLoggedIn && profile.name ? `Continue as ${profile.name || ''}` : label}
      </CustomButton>
    );
  }
}

Button.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
  }),
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string,
};

Button.defaultProps = {
  profile: {},
  onPress: PropTypes.func.isRequired,
  label: '',
};


export default Button;
