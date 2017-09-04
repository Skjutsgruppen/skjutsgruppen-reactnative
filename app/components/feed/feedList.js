import React from 'react';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Feed from './feedItem';

const feedList = ({ feeds }) => (<FlatList
  data={feeds}
  renderItem={({ item }) => <Feed key={item.id} feed={item} />}
  keyExtractor={(item, index) => index}
/>);

feedList.propTypes = {
  feeds: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = state => ({ feeds: state.feed.items });

export default connect(mapStateToProps)(feedList);
