import React from 'react';
import PropTypes from 'prop-types';
import Group from './card/group';

const groupItem = ({ group, onPress }) => (<Group onPress={onPress} group={group} />);

groupItem.propTypes = {
  group: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default groupItem;
