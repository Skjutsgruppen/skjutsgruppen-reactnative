import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { Colors } from '@theme';
import { Heading } from '@components/utils/texts';
import Agreement from '@components/onBoarding/agreement';
import Registration from '@components/onBoarding/registration';
import Signup from '@components/onBoarding/signup';
import ConfirmEmail from '@components/onBoarding/confirmEmail';
import CheckEmail from '@components/onBoarding/checkEmail';
import UserInfo from '@components/onBoarding/userInfo';
import AddPhoto from '@components/onBoarding/addPhoto';
import SendMessage from '@components/onBoarding/sendMessage';
// import WaitingTextMessage from '@components/onBoarding/waitingTextMessage';
import { Wrapper, ProgressBar } from '@components/common';
import { trans } from '@lang/i18n';
import SyncContacts from '@components/onBoarding/syncContacts';
import NumberConfirmed from '@components/onBoarding/numberConfirmed';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 12,
  },
  progress: {
    paddingHorizontal: 30,
  },
  stepsCount: {
    marginTop: 10,
    marginBottom: 6,
  },
});

class Onboarding extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeStep: 1,
      totalSteps: 10,
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    if (navigation.state.params && navigation.state.params.activeStep) {
      const { activeStep } = navigation.state.params;
      this.setState({ activeStep });
    }
  }

  onAgreementNext = () => {
    this.setState({ activeStep: 2 });
  }

  onRegisterNext = () => {
    this.setState({ activeStep: 3 });
  }

  onSignUpNext = () => {
    this.setState({ activeStep: 4 });
  }

  onConfirmEmailNext = () => {
    this.setState({ activeStep: 5 });
  }

  onCheckEmailNext = () => {
    this.setState({ activeStep: 6 });
  }

  onUserInfoNext = () => {
    this.setState({ activeStep: 7 });
  }

  onAddPhotoNext = () => {
    this.setState({ activeStep: 8 });
  }

  onSendMessageNext = () => {
    this.setState({ activeStep: 9 });
  }

  // onWaitingTextMessageNext = () => {
  //   this.setState({ activeStep: 10 });
  // }

  onSyncContacts = () => {
    this.setState({ activeStep: 10 });
    // const { navigation } = this.props;
    // navigation.replace('Tab', { askContactPermission: false });
  }

  onNumberConfirmedNext = () => {
    const { navigation } = this.props;
    navigation.replace('Tab');
  }

  renderProgress = () => {
    const { activeStep, totalSteps } = this.state;
    const progressAmount = (activeStep / totalSteps) * 100;
    if (activeStep > totalSteps) {
      return null;
    }

    return (
      <View style={styles.progress}>
        <ProgressBar amount={progressAmount} color={Colors.background.pink} changesColor={false} />
        <Heading
          size={16}
          style={styles.stepsCount}
          fontVariation="bold"
          color={activeStep === totalSteps ? Colors.text.pink : Colors.text.lightGray}
        >
          {activeStep !== totalSteps && <Heading size={16} fontVariation="bold" color={Colors.text.pink}>{trans('add.step', { activeStep })}{' '}</Heading>}
          {activeStep !== totalSteps && trans('add.out_of', { value: totalSteps })}
          {activeStep !== totalSteps && <Heading size={16} fontVariation="bold">, {trans('add.well_done')}</Heading>}
          {activeStep === totalSteps && <Heading size={16} fontVariation="bold">{trans('onboarding.all_done')}</Heading>}
        </Heading>
      </View>
    );
  }

  render() {
    const { activeStep } = this.state;

    return (
      <Wrapper bgColor={Colors.background.fullWhite} style={styles.wrapper}>
        {this.renderProgress()}
        {
          (activeStep === 1) &&
          <Agreement onNext={this.onAgreementNext} />
        }
        {
          (activeStep === 2) &&
          <Registration onNext={this.onRegisterNext} />
        }
        {
          (activeStep === 3) &&
          <Signup onNext={this.onSignUpNext} />
        }
        {
          (activeStep === 4) &&
          <ConfirmEmail onNext={this.onConfirmEmailNext} />
        }
        {
          (activeStep === 5) &&
          <CheckEmail onNext={this.onCheckEmailNext} />
        }
        {
          (activeStep === 6) &&
          <UserInfo onNext={this.onUserInfoNext} />
        }
        {
          (activeStep === 7) &&
          <AddPhoto onNext={this.onAddPhotoNext} />
        }
        {
          (activeStep === 8) &&
          <SendMessage onNext={this.onSendMessageNext} />
        }
        {/* {
          (activeStep === 9) &&
          <WaitingTextMessage onNext={this.onWaitingTextMessageNext} />
        } */}
        {
          (activeStep === 9) &&
          <SyncContacts onNext={this.onSyncContacts} />
        }
        {
          (activeStep === 10) &&
          <NumberConfirmed onNext={this.onNumberConfirmedNext} />
        }
      </Wrapper>
    );
  }
}

Onboarding.propTypes = {
  navigation: PropTypes.shape({
    reset: PropTypes.func,
  }).isRequired,
};

export default withNavigation(Onboarding);
