import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Item from '@components/comment/item';
import { Loading } from '@components/common';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = ({ loading: false });
  }

  componentWillMount() {
    this.props.subscribeToNewComments({ id: this.props.id });
  }

  loadMore = () => {
    const { comments: { comments, fetchMore }, id } = this.props;
    this.setState({ loading: true }, () => {
      fetchMore({
        variables: { id, offset: comments.length + 1 },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.setState({ loading: false });
          if (!fetchMoreResult || fetchMoreResult.comments.length === 0) {
            return previousResult;
          }

          return {
            comments: previousResult.comments.concat(fetchMoreResult.comments),
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

    return (
      <TouchableOpacity onPress={this.loadMore}>
        <Text>Load More </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { loading, error, comments } = this.props.comments;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return (
        <View>
          <Text>{error}</Text>
        </View>
      );
    }

    if (comments && comments.length < 1) {
      return (
        <View>
          <Text>No Comment</Text>
        </View>
      );
    }

    return (
      <View style={{ paddingBottom: 50 }}>
        <FlatList
          data={comments}
          renderItem={({ item }) => (<Item comment={item} />)}
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
    comments: PropTypes.array,
    fetchMore: PropTypes.func.isRequired,
    error: PropTypes.object,
  }).isRequired,
  subscribeToNewComments: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default List;
