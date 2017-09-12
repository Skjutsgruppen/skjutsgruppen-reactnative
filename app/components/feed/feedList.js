import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Feed from './feedItem';

const feedList = ({ feeds, ...props }) => (
  <FlatList
    data={feeds}
    renderItem={({ item }) => <Feed key={item.id} feed={item} />}
    keyExtractor={(item, index) => index}
    {...props}
  />);

feedList.propTypes = {
  feeds: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default feedList;
