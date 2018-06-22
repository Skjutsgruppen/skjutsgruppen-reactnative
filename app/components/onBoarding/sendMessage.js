import React from 'react';
import PropTypes from 'prop-types';
import UpdatePhonenumber from '@components/common/updatePhonenumber';

const SendMessage = ({ onNext }) => (
  <UpdatePhonenumber
    isOnboarding
    onNext={() => onNext()}
  />
);

SendMessage.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default SendMessage;
