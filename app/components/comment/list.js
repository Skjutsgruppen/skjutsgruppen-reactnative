import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Item from '@components/comment/item';
import { Loading } from '@components/common';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  infoText: {
    paddingHorizontal: 24,
    paddingVertical: 6,
    color: Colors.text.gray,
  },
  loadMoreBtn: {
    width: 100,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 8,
    marginVertical: 24,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadMoreText: {
    color: Colors.text.darkGray,
    fontSize: 12,
    textAlign: 'center',
  },
});

class List extends Component {
  constructor(props) {
    super(props);
    this.state = ({ loading: false });
  }

  componentWillMount() {
    const { subscribeToNewComments, id } = this.props;
    subscribeToNewComments({ id });
  }

  loadMore = () => {
    const { comments: { comments, fetchMore }, id } = this.props;
    this.setState({ loading: true }, () => {
      fetchMore({
        variables: { id, offset: comments.rows.length },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.setState({ loading: false });
          if (!fetchMoreResult || fetchMoreResult.comments.length === 0) {
            return previousResult;
          }

          const prevComments = previousResult.comments;

          const rows = previousResult.comments.rows.concat(fetchMoreResult.comments.rows);

          return {
            comments: { ...prevComments, ...{ rows } },
          };
        },
      });
    });
  };

  renderFooter = (loading) => {
    if (loading) {
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: '#CED0CE',
          }}
        >
          <Loading />
        </View>
      );
    }

    const { comments } = this.props.comments;
    const { rows, count } = comments;

    if (rows.length >= count) {
      return null;
    }

    return (
      <TouchableOpacity onPress={this.loadMore} style={styles.loadMoreBtn}>
        <Text style={styles.loadMoreText}>Load More...</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { loading, error, comments } = this.props.comments;
    const { navigation } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return (
        <Text style={styles.infoText}>{error}</Text>
      );
    }

    const { rows, count } = comments;

    if (rows && rows.length < 1) {
      return (
        <Text style={styles.infoText}>No Comment</Text>
      );
    }

    return (
      <View style={{ paddingBottom: 50 }}>
        <Text style={styles.infoText}>{count} {count > 1 ? 'comments' : 'comment'}</Text>
        <FlatList
          data={rows}
          renderItem={
            ({ item }) =>
              (
                <Item
                  navigation={navigation}
                  onPress={this.props.onCommentPress}
                  comment={item}
                />
              )
          }
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0}
          ListFooterComponent={() => this.renderFooter(this.state.loading)}
        />
      </View>
    );
  }
}

List.propTypes = {
  comments: PropTypes.shape({
    loading: PropTypes.boolean,
    comments: PropTypes.shape({
      rows: PropTypes.array,
      count: PropTypes.number,
    }),
    fetchMore: PropTypes.func.isRequired,
    error: PropTypes.object,
  }).isRequired,
  subscribeToNewComments: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  onCommentPress: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default List;
