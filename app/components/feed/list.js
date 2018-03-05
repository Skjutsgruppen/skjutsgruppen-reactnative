import React, { PureComponent } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import Item from '@components/feed/item';
import { compose } from 'react-apollo';
import Share from '@components/common/share';
import {
  FEEDABLE_PROFILE,
  FEEDABLE_EXPERIENCE,
  FEEDABLE_GROUP,
  FEEDABLE_TRIP,
  REPORT_COMMENT_TYPE,
} from '@config/constant';
import DataList from '@components/dataList';
import { withNavigation } from 'react-navigation';
import { trans } from '@lang/i18n';
import { withDeleteComment } from '@services/apollo/comment';
import ConfirmModal from '@components/common/confirmModal';
import { connect } from 'react-redux';

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

class FeedList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({
      loading: false,
      shareable: {},
      shareableType: '',
      showShareModal: false,
      isLongPressModalOpen: false,
      isOwner: false,
      comment: {},
      feeds: {
        rows: [],
        count: 0,
        loading: false,
      },
      showConfirm: false,
      deleting: false,
    });
  }

  componentWillMount() {
    const { subscribeToNewFeed, id, user } = this.props;

    subscribeToNewFeed({ id, userId: user.id });
  }

  componentWillReceiveProps({ feeds, ownerId, user }) {
    const uniqueUsers = [user.id, ownerId];
    let newItem = {};

    feeds.rows = feeds.rows.map((item) => {
      newItem = item;
      if (uniqueUsers.indexOf(item.User.id) > -1) {
        newItem = { ...item, showRelation: false };
      } else {
        uniqueUsers.push(item.User.id);
        newItem = { ...item, showRelation: true };
      }
      return newItem;
    });

    this.setState({ feeds });
  }

  onCommentLongPress = ({ isOwner, comment }) => {
    this.setState({ isLongPressModalOpen: true, isOwner, comment });
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

  onCommentReport = () => {
    const { navigation } = this.props;
    this.onCommentLongPressClose();

    navigation.navigate('Report', { data: this.state.comment, type: REPORT_COMMENT_TYPE });
  }

  deleteComment = () => {
    const { deleteComment } = this.props;
    const { comment } = this.state;

    this.setState({ deleting: true }, () => {
      deleteComment({ id: comment.id })
        .then(() => {
          this.setState({ deleting: false, showConfirm: false, isLongPressModalOpen: false });
        })
        .catch((err) => {
          this.setState({ deleting: false, showConfirm: false, isLongPressModalOpen: false });
          console.warn(err);
        });
    });
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
            {(!isOwner && !isAdmin) && <Action label="Report comment" onPress={() => this.onCommentReport()} />}
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
    const { header, footer, type } = this.props;
    const { feeds } = this.state;
    return (
      <View style={styles.wrapper}>
        <DataList
          data={feeds}
          header={header}
          footer={footer}
          infinityScroll={type !== FEEDABLE_TRIP}
          renderItem={({ item }) => (
            <Item
              onPress={this.onPress}
              onSharePress={(shareableType, shareable) =>
                this.setState({ showShareModal: true, shareableType, shareable })}
              feed={item}
              onCommentLongPress={this.onCommentLongPress}
            />
          )}
          fetchMoreOptions={{
            variables: { offset: feeds.rows.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult || fetchMoreResult.feeds.rows.length === 0) {
                return previousResult;
              }

              const rows = previousResult.feeds.rows.concat(fetchMoreResult.feeds.rows);

              return { feeds: { ...previousResult.feeds, ...{ rows } } };
            },
          }}
        />
        {this.renderShareModal()}
        {this.renderCommentLongPressModal()}
        {this.renderConfirmModal()}
      </View>
    );
  }
}

FeedList.propTypes = {
  ownerId: PropTypes.number.isRequired,
  isAdmin: PropTypes.bool,
  id: PropTypes.number.isRequired,
  feeds: PropTypes.shape({
    loading: PropTypes.boolean,
    error: PropTypes.object,
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object),
    networkStatus: PropTypes.number,
    refetch: PropTypes.func,
    fetchMore: PropTypes.fetchMore,
  }).isRequired,
  header: PropTypes.element,
  footer: PropTypes.element,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  subscribeToNewFeed: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

FeedList.defaultProps = {
  isAdmin: false,
  header: null,
  footer: null,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  withDeleteComment,
  withNavigation,
  connect(mapStateToProps),
)(FeedList);
