import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Loading } from '@components/common';
import Colors from '@theme/colors';
import DataList from '@components/dataList';
import Friends from '@components/profile/card/friends';
import PropTypes from 'prop-types';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    padding: '20%',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 32,
    textAlign: 'center',
    color: Colors.text.gray,
    marginVertical: 16,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.fullWhite,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowColor: '#000',
    height: 80,
  },
  searchInput: {
    fontSize: 15,
    height: 36,
    flex: 1,
    borderRadius: 18,
    paddingLeft: 16,
    marginRight: 16,
  },
  closeIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginHorizontal: 16,
    opacity: 0.5,
  },
});

class SearchMyFriends extends Component {
  componentWillReceiveProps({ friends, unfriend }) {
    if (unfriend) {
      friends.refetch();
    }
  }

  render() {
    const { friends, onPress, handleRemovePress, queryString } = this.props;
    if (queryString.length < 1) {
      return null;
    }

    if (friends.loading) {
      return (<View style={styles.wrapper}><Loading /></View>);
    }

    if (friends.count === 0) {
      return (<View style={styles.wrapper}>
        <AppText style={styles.text}>No search data.</AppText></View>);
    }

    return (
      <DataList
        data={friends}
        renderItem={({ item }) => (
          <Friends
            key={item.id}
            friend={item}
            onPress={onPress}
            handleRemovePress={(user) => { handleRemovePress(user); }}
          />
        )}
        fetchMoreOptions={{
          variables: { offset: friends.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.friends.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.friends.rows.concat(fetchMoreResult.friends.rows);

            return { friends: { ...previousResult.friends, ...{ rows } } };
          },
        }}
      />
    );
  }
}

SearchMyFriends.propTypes = {
  friends: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  queryString: PropTypes.string.isRequired,
  handleRemovePress: PropTypes.func.isRequired,
  unfriend: PropTypes.bool,
};

SearchMyFriends.defaultProps = {
  unfriend: false,
};

export default SearchMyFriends;
