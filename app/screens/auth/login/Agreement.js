import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { RoundedButton, Loading } from '@components/common';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';
import AppText from '@components/utils/texts/appText';
import Radio from '@components/add/radio';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import { withUpdateProfile } from '@services/apollo/auth';
import AuthAction from '@redux/actions/auth';
import AuthService from '@services/auth/auth';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 30,
    backgroundColor: Colors.background.fullWhite,
  },
  header: {
    lineHeight: 46,
    marginTop: 24,
  },
  title: {
    lineHeight: 36,
    marginVertical: 16,
  },
  button: {
    alignSelf: 'center',
    width: 200,
    marginVertical: 40,
  },
  radioWrapper: {
    marginVertical: 18,
  },
  horizontalDivider: {
    width: 64,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.background.lightGray,
    marginVertical: 12,
  },
  text: {
    lineHeight: 30,
  },
});
class Agreement extends Component {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    this.state = {
      agreementRead: false,
      loading: false,
    };
  }
  onSubmit = () => {
    this.setState({ loading: true });
    const {
      updateProfile,
      updateUser,
      navigation,
    } = this.props;
    const { agreementRead } = this.state;

    if (navigation.state.params && navigation.state.params.skipUpdateProfile) {
      this.setState({ loading: false }, () => navigation.replace('Registration', { ...navigation.state.params }));

      return;
    }

    try {
      updateProfile({
        agreementRead,
      })
        .then(({ data }) => {
          const { token, User } = data.updateUser;
          updateUser({ token, user: User }).then(() => {
            if (!User.agreementAccepted) {
              navigation.replace('Registration');
            } else if (!User.phoneVerified) {
              navigation.replace('Onboarding', { activeStep: 8 });
            } else {
              navigation.replace('Tab');
            }
          });
        }).catch(() => {
          this.setState({ loading: false });
        });
    } catch (err) {
      this.setState({ loading: false });
    }
  }

  onAgreementCheck = () => {
    const { agreementRead } = this.state;
    this.setState({ agreementRead: !agreementRead });
  }

  renderButton = () => {
    const { loading, agreementRead } = this.state;
    if (loading) {
      return (<Loading style={{ marginVertical: 24 }} />);
    }
    return (
      <RoundedButton
        onPress={this.onSubmit}
        style={styles.button}
        bgColor={agreementRead ? Colors.background.pink : Colors.background.lightGray}
        disabled={!agreementRead}
      >
        {trans('global.next')}
      </RoundedButton>
    );
  }

  render() {
    const { agreementRead } = this.state;
    return (
      <ScrollView style={styles.wrapper}>
        <StepsHeading>
          {trans('onboarding.we_are_friends_of_friends_of_friends')}
        </StepsHeading>
        <StepsTitle>
          {trans('onboarding.we_share_equally_of_offer_each_other_rides')}
        </StepsTitle>
        <View style={styles.radioWrapper}>
          <Radio
            active={agreementRead}
            label={trans('onboarding.i_agree')}
            onPress={this.onAgreementCheck}
          />
        </View>
        <View style={styles.horizontalDivider} />
        <AppText style={styles.text}>
          {trans('onboarding.by_clicking_i_agree_you_agree_to_participatory')}
        </AppText>
        <AppText
          onPress={() => Linking.openURL('https://web.skjutsgruppen.nu/participant-agreement')}
          style={styles.text}
          color={Colors.text.blue}
          fontVariation="bold"
        >
          {trans('onboarding.read_all_of_the_agreement_here')}
        </AppText>
        {this.renderButton()}
      </ScrollView>
    );
  }
}
const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => ({
  updateUser: ({ user, token }) => AuthService.setUser(user)
    .then(() => dispatch(AuthAction.login({ user, token }))),
});
Agreement.propTypes = {
  updateUser: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    user: PropTypes.shape(),
  }).isRequired,
};

export default compose(
  withNavigation,
  withUpdateProfile,
  connect(mapStateToProps, mapDispatchToProps))(Agreement);
