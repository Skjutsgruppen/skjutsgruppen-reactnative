import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import PropTypes from 'prop-types';
import Item from '@components/comment/item';
import { Loading } from '@components/common';
import Colors from '@theme/colors';
import RelationModal from '@components/relationModal';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { trans } from '@lang/i18n';
import { withDeleteComment } from '@services/apollo/comment';
import ConfirmModal from '@components/common/confirmModal';

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
  horizontalDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  closeWrapper: {
    borderRadius: 12,
    marginHorizontal: 16,
    backgroundColor: Colors.background.fullWhite,
  },
  closeModal: {
    padding: 16,
  },
  actionsWrapper: {
    marginTop: 'auto',
    marginHorizontal: 16,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  action: {
    padding: 16,
  },
  actionLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
});

const Action = ({ label, onPress }) => (
  <View style={styles.horizontalDivider} >
    <TouchableOpacity style={styles.action} onPress={onPress}>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  </View>
);

Action.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({
      loading: false,
      showFoFModal: false,
      friendsData: [],
      commentsRow: [],
      isLongPressModalOpen: false,
      isOwner: false,
      commentId: null,
      showConfirm: false,
      deleting: false,
    });
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

  onCommentLongPress = (isOwner, commentId) => {
    this.setState({ isLongPressModalOpen: true, isOwner, commentId });
  }

  onCommentLongPressClose = () => {
    this.setState({ isLongPressModalOpen: false });
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

  deleteComment = () => {
    const { deleteComment } = this.props;
    const { commentId } = this.state;

    this.setState({ deleting: true }, () => {
      deleteComment({ id: commentId })
        .then(() => {
          this.setState({ deleting: false, showConfirm: false, isLongPressModalOpen: false });
        })
        .catch((err) => {
          this.setState({ deleting: false, showConfirm: false, isLongPressModalOpen: false });
          console.warn(err);
        });
    });
  }

  renderCommentLongPressModal() {
    const { isOwner } = this.state;

    return (
      <Modal
        visible={this.state.isLongPressModalOpen}
        onRequestClose={() => this.setState({ isLongPressModalOpen: false })}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContent}>
          <View style={styles.actionsWrapper}>
            {isOwner && <Action label="Delete comment" onPress={() => this.setState({ showConfirm: true, isLongPressModalOpen: false })} />}
            {!isOwner && <Action label="Report comment" onPress={() => { }} />}
          </View>
          <View style={styles.closeWrapper}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={this.onCommentLongPressClose}
            >
              <Text style={styles.actionLabel}>{trans('global.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

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

  renderConfirmModal = () => {
    const { deleting, showConfirm } = this.state;
    const message = <Text>Are you sure you want to delete this comment?</Text>;

    return (
      <ConfirmModal
        visible={showConfirm}
        loading={deleting}
        onDeny={() => this.setState({ showConfirm: false })}
        onConfirm={this.deleteComment}
        message={message}
        onRequestClose={() => this.setState({ showConfirm: false })}
      />
    );
  }

  render() {
    const { comments, onCommentPress, showCount } = this.props;
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
        {showCount && <Text style={styles.infoText}>{count} {count > 1 ? 'comments' : 'comment'}</Text>}
        <FlatList
          data={commentsRow}
          renderItem={({ item }) => (
            <Item
              onPress={onCommentPress}
              comment={item}
              setModalVisibility={this.setModalVisibility}
              onCommentLongPress={this.onCommentLongPress}
              renderCommentLongPressModal={this.renderCommentLongPressModal}
            />
          )}
          keyExtractor={(item, index) => index}
          ListHeaderComponent={() => this.renderHeader(this.state.loading)}
          ListFooterComponent={this.renderFooter}
        />
        {this.state.showFoFModal && this.renderModal()}
        {this.renderCommentLongPressModal()}
        {this.renderConfirmModal()}
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
  showCount: PropTypes.bool,
  deleteComment: PropTypes.func.isRequired,
};

List.defaultProps = {
  showCount: false,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withNavigation, withDeleteComment, connect(mapStateToProps))(List);
