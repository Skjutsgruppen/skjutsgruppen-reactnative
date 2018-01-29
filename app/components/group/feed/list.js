import React, { Component } from 'react';
import { View, Modal, StyleSheet, ScrollView } from 'react-native';
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
});

class GroupFeed extends Component {
  constructor(props) {
    super(props);
    this.state = ({ loading: false, modalDetail: {}, modalType: '', isOpen: false, showFoFModal: false, friendsData: [] });
  }

  componentWillMount() {
    const { subscribeToGroupFeed, groupId } = this.props;

    subscribeToGroupFeed({ groupId });
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
      navigation.navigate('ExperienceScreen', { experience: detail });
    }
  };

  onSharePress = (modalType, modalDetail) => {
    this.setState({ isOpen: true, modalType, modalDetail });
  };

  onShare = (share) => {
    this.props.share({ id: this.state.modalDetail.id, type: this.state.modalType, share })
      .then(() => this.setState({ isOpen: false }))
      .catch(console.warn);
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

  setModalVisibility = (show, friendsData) => {
    this.setState({ showFoFModal: show, friendsData });
  }

  setFriendsData = (data) => {
    this.setState({ friendsData: data });
  }

  renderModal() {
    console.log(this.state);
    return (
      <RelationModal
        users={this.state.friendsData}
        onPress={this.onPress}
        setModalVisibility={this.setModalVisibility}
        showFoFModal={this.state.showFoFModal}
      />
    );
  }

  renderShareModal() {
    return (
      <Modal
        visible={this.state.isOpen}
        onRequestClose={() => this.setState({ isOpen: false })}
        animationType="slide"
      >
        <ScrollView>
          <Share
            modal
            showGroup={this.state.modalType !== 'group'}
            onNext={this.onShare}
            onClose={this.onClose}
          />
        </ScrollView>
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
              onSharePress={this.onSharePress}
              groupFeed={item}
              setModalVisibility={this.setModalVisibility}
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
      </View>
    );
  }
}

GroupFeed.propTypes = {
  share: PropTypes.func.isRequired,
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
};

export default compose(withShare, withNavigation)(GroupFeed);
