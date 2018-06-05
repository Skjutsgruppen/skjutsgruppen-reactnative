import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { trans } from '@lang/i18n';
import Colors from '@theme/colors';
import { RoundedButton, Loading } from '@components/common';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import Photo from '@components/add/photo';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import BackButton from '@components/onBoarding/backButton';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { withUpdateProfile } from '@services/apollo/auth';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  paddedSection: {
    paddingHorizontal: 30,
  },
  button: {
    width: 200,
    marginVertical: 50,
  },
});

class AddPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, avatar: '', error: '' };
  }

  onSubmit = () => {
    const { avatar } = this.state;
    if (avatar === '') {
      this.onNext();
      return;
    }

    this.setState({ loading: true });
    const {
      updateProfile,
      updateUser,
    } = this.props;

    try {
      updateProfile({
        avatar,
      })
        .then(({ data }) => {
          const { token, User } = data.updateUser;
          updateUser({ token, user: User }).then(() => {
            this.onNext();
          });
        }).catch((err) => {
          this.setState({ loading: false, error: getToast(err) });
        });
    } catch (err) {
      this.setState({ loading: false, error: getToast(err) });
    }
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext();
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.navigate('Onboarding', { activeStep: 6 });
  }

  renderButton = () => {
    const { loading } = this.state;

    if (loading) {
      return (<Loading style={{ marginVertical: 24 }} />);
    }

    return (
      <RoundedButton
        onPress={this.onSubmit}
        style={styles.button}
        bgColor={Colors.background.pink}
      >
        {trans('global.next')}
      </RoundedButton>
    );
  }

  render() {
    const { error } = this.state;

    return (
      <ScrollView>
        <Toast message={error} type="error" />
        <View style={styles.paddedSection}>
          <StepsHeading>{trans('onboarding.how_about_a_photo')}</StepsHeading>
          <StepsTitle>
            {trans('onboarding.we_love_to_see_each_other_and_a_photo')}
          </StepsTitle>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <View>
              <Photo
                onSelect={res => this.setState({ avatar: res.data })}
              />
            </View>
          </View>
          {this.renderButton()}
          <BackButton onPress={() => this.goBack()} leftAligned />
        </View>
      </ScrollView>
    );
  }
}

AddPhoto.propTypes = {
  onNext: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

const mapDispatchToProps = dispatch => ({
  updateUser: ({ user, token }) => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.login({ user, token }))),
});

export default compose(withUpdateProfile,
  withNavigation,
  connect(null, mapDispatchToProps))(AddPhoto);
