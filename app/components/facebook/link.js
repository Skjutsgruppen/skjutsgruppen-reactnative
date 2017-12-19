import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withFacebookConnect } from '@services/apollo/facebook';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import Connect from '@components/facebook/connect';
import { Loading } from '@components/common';
import CustomButton from '@components/common/customButton';
import Colors from '@theme/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
  },
});

class LinkFacebook extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { loading: false, linked: false };
    this.onLogin = this.onLogin.bind(this);
    this.unlink = this.unlink.bind(this);
  }

  componentWillMount() {
    this.setState({ linked: (this.props.user.fbId !== '') });
  }

  async onLogin(fbUser, { user }) {
    const { facebookConnect, setLogin } = this.props;
    if (!user) {
      try {
        this.setState({ loading: true });
        const response = await facebookConnect({
          id: fbUser.profile.id,
          email: fbUser.profile.email,
          token: fbUser.token,
        });
        await setLogin({
          token: response.data.connect.token,
          user: response.data.connect.User,
        });
        this.setState({ linked: true, loading: false });
      } catch (error) {
        this.setState({ loading: false });
      }
    }
  }

  async unlink() {
    const { facebookConnect, user, setLogin } = this.props;

    try {
      this.setState({ loading: true });
      const response = await facebookConnect({
        id: '',
        email: user.email,
        token: '',
      });
      await setLogin({
        token: response.data.connect.token,
        user: response.data.connect.User,
      });
      this.setState({ linked: false, loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, linked } = this.state;

    if (loading) {
      return (<Loading />);
    }

    if (linked === true) {
      return (<CustomButton
        bgColor={Colors.background.darkCyan}
        style={styles.button}
        onPress={this.unlink}
      >
        Unlink from facebook
      </CustomButton>);
    }

    return (
      <Connect onLogin={this.onLogin} />
    );
  }
}

LinkFacebook.propTypes = {
  facebookConnect: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
  user: PropTypes.shape({
    fbId: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

const mapDispatchToProps = dispatch => ({
  setLogin: ({ user, token }) => AuthService.setAuth({ user, token })
    .then(() => dispatch(AuthAction.login({ user, token })))
    .catch(error => console.error(error)),
});

export default compose(withFacebookConnect, connect(null, mapDispatchToProps))(LinkFacebook);
