import React, { Component } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import Item from '@components/group/feed/item';
import { compose } from 'react-apollo';
import { withShare } from '@services/apollo/share';
import Share from '@components/common/share';
import {
  FEEDABLE_PROFILE,
  FEEDABLE_EXPERIENCE,
  FEEDABLE_GROUP,
  FEEDABLE_TRIP,
} from '@config/constant';
import RelationModal from '@components/relationModal';
import DataList from '@components/dataList';
import { withNavigation } from 'react-navigation';
import { trans } from '@lang/i18n';
import { withDeleteComment } from '@services/apollo/comment';
import ConfirmModal from '@components/common/confirmModal';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
  infoText: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    color: Colors.text.gray,
  },
  loadMoreText: {
    color: Colors.text.darkGray,
    fontSize: 12,
    textAlign: 'center',
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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

class GroupFeed extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      loading: false,
      shareable: {},
      shareableType: '',
      showShareModal: false,
      showFoFModal: false,
      friendsData: [],
      isLongPressModalOpen: false,
      isOwner: false,
      commentId: null,
      showConfirm: false,
      deleting: false,
    });
  }

  componentWillMount() {
    const { subscribeToGroupFeed, groupId } = this.props;

    subscribeToGroupFeed({ groupId });
  }

  onCommentLongPress = ({ isOwner, commentId }) => {
    this.setState({ isLongPressModalOpen: true, isOwner, commentId });
  }

  onCommentLongPressClose = () => {
    this.setState({ isLongPressModalOpen: false });
  }

  onPress = (type, detail) => {
    const { navigation } = this.props;

    if (type === FEEDABLE_GROUP) {
      navigation.navigate('GroupDetail', { group: detail });
    }

    if (type === FEEDABLE_TRIP) {
      navigation.navigate('TripDetail', { trip: detail });
    }

    if (type === FEEDABLE_PROFILE) {
      navigation.navigate('Profile', { profileId: detail });
    }

    if (type === FEEDABLE_EXPERIENCE) {
      navigation.navigate('ExperienceDetail', { experience: detail });
    }
  };

  setModalVisibility = (show, friendsData) => {
    this.setState({ showFoFModal: show, friendsData });
  }

  setFriendsData = (data) => {
    this.setState({ friendsData: data });
  }

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

  renderCommentLongPressModal() {
    const { isOwner } = this.state;
    const { isAdmin } = this.props;
    return (
      <Modal
        visible={this.state.isLongPressModalOpen}
        onRequestClose={() => this.setState({ isLongPressModalOpen: false })}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContent}>
          <View style={styles.actionsWrapper}>
            {(isOwner || isAdmin)
              && <Action label="Delete comment" onPress={() => this.setState({ showConfirm: true, isLongPressModalOpen: false })} />
            }
            {(!isOwner && !isAdmin) && <Action label="Report comment" onPress={() => { }} />}
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

  renderShareModal() {
    const { showShareModal, shareable, shareableType } = this.state;
    return (
      <Modal
        visible={showShareModal}
        onRequestClose={() => this.setState({ showShareModal: false })}
        animationType="slide"
      >
        <Share
          modal
          type={shareableType}
          detail={shareable}
          onClose={() => this.setState({ showShareModal: false })}
        />
      </Modal>
    );
  }

  render() {
    const { groupFeed, header } = this.props;

    return (
      <View style={styles.wrapper}>
        <DataList
          data={groupFeed}
          header={header}
          renderItem={({ item }) => (
            <Item
              onPress={this.onPress}
              onSharePress={(shareableType, shareable) =>
                this.setState({ showShareModal: true, shareableType, shareable })}
              groupFeed={item}
              setModalVisibility={this.setModalVisibility}
              onCommentLongPress={this.onCommentLongPress}
            />
          )}
          fetchMoreOptions={{
            variables: { offset: groupFeed.rows.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult || fetchMoreResult.groupFeed.rows.length === 0) {
                return previousResult;
              }

              const rows = previousResult.groupFeed.rows.concat(fetchMoreResult.groupFeed.rows);

              return { groupFeed: { ...previousResult.groupFeed, ...{ rows } } };
            },
          }}
        />
        {this.renderShareModal()}
        {this.state.showFoFModal && this.renderModal()}
        {this.renderCommentLongPressModal()}
        {this.renderConfirmModal()}
      </View>
    );
  }
}

GroupFeed.propTypes = {
  isAdmin: PropTypes.bool,
  groupId: PropTypes.number.isRequired,
  groupFeed: PropTypes.shape({
    loading: PropTypes.boolean,
    error: PropTypes.object,
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object),
    networkStatus: PropTypes.number,
    refetch: PropTypes.func,
    fetchMore: PropTypes.fetchMore,
  }).isRequired,
  header: PropTypes.element.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  subscribeToGroupFeed: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

GroupFeed.defaultProps = {
  isAdmin: false,
};

export default compose(withShare, withDeleteComment, withNavigation)(GroupFeed);
