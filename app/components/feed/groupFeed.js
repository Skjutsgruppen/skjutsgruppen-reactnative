import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Feed from '@components/feed/feedItem';

const GroupFeed = ({ feeds, ...props }) => (
  <FlatList
    data={feeds}
    renderItem={({ item }) => <Feed key={item.id} feed={item} />}
    keyExtractor={(item, index) => index}
    {...props}
  />
);

GroupFeed.propTypes = {
  feeds: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default GroupFeed;
