import React, { PureComponent } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
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
  GROUP_FEED_TYPE_COMMENT,
  FEEDABLE_SUGGESTION,
  GROUP_FEED_TYPE_SHARE,
  FEEDABLE_LOCATION,
  STRETCH_TYPE_AREA,
  STRETCH_TYPE_ROUTE,
  ACTIVITY_TYPE_SHARE_LOCATION_FEED,
  ACTIVITY_TYPE_CREATE_EXPERIENCE,
} from '@config/constant';
import DataList from '@components/dataList';
import { withNavigation } from 'react-navigation';
import { trans } from '@lang/i18n';
import ConfirmModal from '@components/common/confirmModal';
import { connect } from 'react-redux';
import { withDeleteFeed } from '@services/apollo/feed';
import { AppText } from '@components/utils/texts';
import { getGroupDetails } from '@services/apollo/dataSync';

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
  modalContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
});

const Action = ({ label, onPress }) => (
  <View style={styles.horizontalDivider} >
    <TouchableOpacity style={styles.action} onPress={onPress}>
      <AppText color={Colors.text.blue} fontVariation="bold" centered>{label}</AppText>
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
      feeds: {
        rows: [],
        count: 0,
        loading: false,
      },
      data: {},
      type: '',
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

  onLongPress = ({ isOwner, data, type }) => {
    this.setState({ isLongPressModalOpen: true, isOwner, data, type });
  }

  onLongPressClose = () => {
    this.setState({ isLongPressModalOpen: false });
  }

  onPress = (type, detail) => {
    const { navigation } = this.props;
    const { id } = detail;

    if (type === FEEDABLE_GROUP) {
      navigation.navigate('GroupDetail', { id });
    }

    if (type === FEEDABLE_TRIP) {
      navigation.navigate('TripDetail', { id });
    }

    if (type === FEEDABLE_PROFILE) {
      navigation.navigate('Profile', { profileId: id });
    }

    if (type === FEEDABLE_EXPERIENCE) {
      navigation.navigate('ExperienceDetail', { id });
    }

    if (type === FEEDABLE_LOCATION) {
      const groupId = navigation.state.params ? navigation.state.params.id : null;
      const group = getGroupDetails(groupId);

      if (group.outreach === STRETCH_TYPE_AREA) navigation.navigate('Area', { info: group });
      if (group.outreach === STRETCH_TYPE_ROUTE) navigation.navigate('Route', { info: group });
    }

    if (type === ACTIVITY_TYPE_SHARE_LOCATION_FEED) {
      navigation.navigate('Route', { info: detail, pressShareLocation: true });
    }

    if (type === ACTIVITY_TYPE_CREATE_EXPERIENCE) {
      navigation.navigate('Experience', { trip: detail });
    }
  };

  onReport = () => {
    const { navigation } = this.props;
    const { data, type } = this.state;
    this.onLongPressClose();

    if (type === GROUP_FEED_TYPE_COMMENT) {
      navigation.navigate('Report', { data, type: REPORT_COMMENT_TYPE });
    }

    if (type === FEEDABLE_TRIP) {
      navigation.navigate('Report', { data, type: FEEDABLE_TRIP });
    }

    if (type === FEEDABLE_EXPERIENCE) {
      navigation.navigate('Report', { data, type: FEEDABLE_EXPERIENCE });
    }

    if (type === GROUP_FEED_TYPE_SHARE) {
      navigation.navigate('Report', { data, type: GROUP_FEED_TYPE_SHARE });
    }

    if (type === FEEDABLE_SUGGESTION) {
      navigation.navigate('Report', { data, type: FEEDABLE_SUGGESTION });
    }

    if (type === FEEDABLE_GROUP) {
      navigation.navigate('Report', { data, type: FEEDABLE_GROUP });
    }

    if (type === FEEDABLE_SUGGESTION) {
      navigation.navigate('Report', { data, type: FEEDABLE_SUGGESTION });
    }
  }

  delete = () => {
    const { deleteFeed } = this.props;
    const { data } = this.state;

    this.setState({ delete: true }, () => {
      deleteFeed({ id: data.id })
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
    const { deleting, showConfirm, type } = this.state;
    const message = <AppText>{trans('detail.are_you_sure_to_delete_this_type', { type })}</AppText>;

    return (
      <ConfirmModal
        visible={showConfirm}
        loading={deleting}
        onDeny={() => this.setState({ showConfirm: false })}
        onConfirm={this.delete}
        message={message}
        onRequestClose={() => this.setState({ showConfirm: false })}
      />
    );
  }

  renderLongPressModal() {
    const { isOwner, type } = this.state;
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
            {((isOwner || isAdmin) && type !== FEEDABLE_EXPERIENCE)
              && <Action label={trans('detail.delete')} onPress={() => this.setState({ showConfirm: true, isLongPressModalOpen: false })} />
            }
            {(!isOwner) && <Action label={trans('detail.report')} onPress={() => this.onReport()} />}
          </View>
          <View style={styles.closeWrapper}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={this.onLongPressClose}
            >
              <AppText color={Colors.text.blue} fontVariation="bold" centered>{trans('global.cancel')}</AppText>
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
          shouldUpdateAnimatedValue
          renderItem={({ item }) => (
            <Item
              onPress={this.onPress}
              onSharePress={(shareableType, shareable) =>
                this.setState({ showShareModal: true, shareableType, shareable })}
              feed={item}
              onLongPress={this.onLongPress}
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
          noResultText={trans('global.no_comments_yet')}
        />
        {this.renderShareModal()}
        {this.renderLongPressModal()}
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
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
  deleteFeed: PropTypes.func.isRequired,
};

FeedList.defaultProps = {
  isAdmin: false,
  header: null,
  footer: null,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  withNavigation,
  withDeleteFeed,
  connect(mapStateToProps),
)(FeedList);
