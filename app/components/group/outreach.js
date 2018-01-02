import React from 'react';
import PropTypes from 'prop-types';
import Route from '@components/group/outreach/route';
import Area from '@components/group/outreach/area';
import { STRETCH_TYPE_ROUTE } from '@config/constant';

const OutReach = ({ outreach, onNext }) => {
  if (outreach === STRETCH_TYPE_ROUTE) {
    return <Route onNext={onNext} />;
  }

  return <Area onNext={onNext} />;
};

OutReach.propTypes = {
  outreach: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default OutReach;
