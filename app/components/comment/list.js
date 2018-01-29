import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Item from '@components/comment/item';
import { Loading } from '@components/common';
import Colors from '@theme/colors';
import RelationModal from '@components/relationModal';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

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
  block: {
    paddingVertical: 24,
  },
});

class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({ loading: false, showFoFModal: false, friendsData: [], commentsRow: [] });
  }

  componentWillMount() {
    const { subscribeToNewComments, id, user } = this.props;
    subscribeToNewComments({ id, userId: user.id });
  }

  componentWillReceiveProps({ comments, ownerId, user }) {
    const uniqueUsers = [user.id, ownerId];
    let newItem = {};

    const commentsRow = comments.rows.map((item) => {
      newItem = item;
      if (uniqueUsers.indexOf(item.User.id) > -1) {
        newItem = { ...item, showRelation: false };
      } else {
        uniqueUsers.push(item.User.id);
        newItem = { ...item, showRelation: true };
      }
      return newItem;
    });

    this.setState({ commentsRow });
  }

  onPress = (userId) => {
    const { navigation } = this.props;

    this.setState({ showFoFModal: false });
    navigation.navigate('Profile', { profileId: userId });
  }

  setModalVisibility = (show, friendsData) => {
    this.setState({ showFoFModal: show, friendsData });
  }

  setFriendsData = (data) => {
    this.setState({ friendsData: data });
  }

  loadMore = () => {
    const { id, comments } = this.props;
    const { rows, fetchMore } = comments;

    this.setState({ loading: true }, () => {
      fetchMore({
        variables: { id, offset: rows.length },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.setState({ loading: false });
          if (!fetchMoreResult || fetchMoreResult.length === 0) {
            return previousResult;
          }

          const updatedRows = previousResult.comments.rows.concat(fetchMoreResult.comments.rows);

          return { comments: { ...previousResult.comments, ...{ rows: updatedRows } } };
        },
      });
    });
  };

  renderModal() {
    return (
      <RelationModal
        users={this.state.friendsData}
        onPress={this.onPress}
        setModalVisibility={this.setModalVisibility}
        showFoFModal={this.state.showFoFModal}
      />
    );
  }

  renderFooter = () => (<View style={{ paddingBottom: 50 }} />)

  renderHeader = (loading) => {
    if (loading) {
      return (
        <View style={styles.block} >
          <Loading />
        </View>
      );
    }

    const { rows, count } = this.props.comments;

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
    const { comments, onCommentPress } = this.props;
    const { error, rows, count, networkStatus } = comments;
    const { commentsRow } = this.state;

    if (networkStatus === 1 && rows.length < 1) {
      return (<View style={styles.block}><Loading /></View>);
    }

    if (error) {
      return (
        <View style={styles.block}><Text style={styles.infoText}>{error}</Text></View>
      );
    }

    if (rows && rows.length < 1) {
      return (
        <View style={styles.block}><Text style={styles.infoText}>No Comment</Text></View>
      );
    }

    return (
      <View style={{ marginTop: 24 }}>
        <Text style={styles.infoText}>{count} {count > 1 ? 'comments' : 'comment'}</Text>
        <FlatList
          data={commentsRow}
          renderItem={({ item }) => (
            <Item
              onPress={onCommentPress}
              comment={item}
              setModalVisibility={this.setModalVisibility}
            />
          )}
          keyExtractor={(item, index) => index}
          ListHeaderComponent={() => this.renderHeader(this.state.loading)}
          ListFooterComponent={this.renderFooter}
        />
        {this.state.showFoFModal && this.renderModal()}
      </View>
    );
  }
}

List.propTypes = {
  ownerId: PropTypes.number.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  comments: PropTypes.shape({
    loading: PropTypes.boolean,
    rows: PropTypes.array,
    count: PropTypes.number,
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
const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withNavigation, connect(mapStateToProps))(List);
