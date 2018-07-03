import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { trans } from '@lang/i18n';
import Colors from '@theme/colors';
import { RoundedButton, Loading } from '@components/common';
import StepsHeading from '@components/onBoarding/stepsHeading';
import StepsTitle from '@components/onBoarding/stepsTitle';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { withContactSync } from '@services/apollo/contact';

const styles = StyleSheet.create({
  paddedSection: {
    paddingHorizontal: 30,
  },
  text: {
    color: Colors.text.gray,
    lineHeight: 26,
    marginTop: 16,
    marginBottom: 12,
  },
  button: {
    width: 200,
    marginTop: 48,
    marginBottom: 50,
  },
  image: {
    maxWidth: '100%',
    resizeMode: 'contain',
    marginTop: 16,
    marginBottom: 24,
  },
});

class Sync extends Component {
  state = {
    loading: false,
  };

  onPressSync = async () => {
    const { onSync, syncContacts } = this.props;
    this.setState({ loading: true });
    await syncContacts();
    onSync();
  }

  render() {
    return (
      <View style={styles.paddedSection}>
        <StepsHeading style={{ maxWidth: 240 }}>{trans('onboarding.increase_trust_and_security')}</StepsHeading>
        <StepsTitle>
          {trans('onboarding.press_sync_and_then_allow')}
        </StepsTitle>
        {
          this.state.loading ?
            <Loading />
            :
            <RoundedButton
              onPress={this.onPressSync}
              style={styles.button}
              bgColor={Colors.background.pink}
            >
              {trans('onboarding.sync')}
            </RoundedButton>
        }

      </View>
    );
  }
}

Sync.propTypes = {
  onSync: PropTypes.func.isRequired,
  syncContacts: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });

export default compose(withContactSync, connect(mapStateToProps))(Sync);
