import React from 'react';
import PropTypes from 'prop-types';
import Route from './outreach/route';
import Area from './outreach/area';

const OutReach = ({ outreach, onNext }) => {
  if (outreach === 'route') {
    return <Route onNext={onNext} />;
  }

  return <Area onNext={onNext} />;
};

OutReach.propTypes = {
  outreach: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default OutReach;
