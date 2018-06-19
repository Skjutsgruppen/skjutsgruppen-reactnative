import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import ToolBar from '@components/utils/toolbar';
import UpdatePhonenumber from '@components/common/updatePhonenumber';

const ChangePhoneNumber = ({ navigation }) => (
  <View style={{ flex: 1 }}>
    <ToolBar />
    <UpdatePhonenumber
      isOnboarding={false}
      onNext={() => navigation.goBack()}
    />
  </View>
);

ChangePhoneNumber.navigationOptions = {
  header: null,
};

ChangePhoneNumber.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        verifyPreviousNumber: PropTypes.bool,
      }),
    }).isRequired,
  }).isRequired,
};

export default ChangePhoneNumber;

