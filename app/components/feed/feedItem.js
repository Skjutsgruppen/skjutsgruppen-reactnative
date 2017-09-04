import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  row: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    color: '#222',
    fontSize: 14,
    marginBottom: 5,
  },
  body: {
    color: '#666',
  },
});


const feedItem = ({ feed }) => (
  <View style={styles.row}>
    <Text style={styles.title}>{feed.title}</Text>
    <Text style={styles.body}>{feed.body}</Text>
  </View>
);

feedItem.propTypes = {
  feed: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
};

export default feedItem;
