import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  actionLabel: {
    fontSize: 16,
    color: Colors.text.blue,
  },
});

class FBLink extends Component {
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
    const { label } = this.props;
    return (
      <Text
        onPress={this.onPress}
        style={styles.actionLabel}
      >
        {label}
      </Text>
    );
  }
}

FBLink.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
  }),
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string,
};

FBLink.defaultProps = {
  profile: {},
  onPress: PropTypes.func.isRequired,
  label: null,
};


export default FBLink;
