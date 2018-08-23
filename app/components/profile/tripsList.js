import React, { PureComponent } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import PortionList from '@components/portionList';
import PropTypes from 'prop-types';
import { ListSearchBar } from '@components/common';
import ListItem from '@components/profile/listItem';
import ListSearchModal from '@components/profile/ListSearchModal';
import StickySectionHeader from '@components/profile/stickySectionHeader';
import SectionDivider from '@components/profile/sectionDivider';
import { withNavigation } from 'react-navigation';
import { FEEDABLE_TRIP, FEEDABLE_PROFILE } from '@config/constant';

const styles = StyleSheet.create({
  searchWrapper: {
    paddingTop: 24,
  },
  loadingWrapper: {
    paddingVertical: 50,
  },
});

class UserTripsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { isOpen: false, tripsArray: [] };
  }

  componentWillMount() {
    const { subscribeToNewTrip, id } = this.props;
    subscribeToNewTrip({ userId: id });
  }

  onSearchPress = () => {
    this.setState({ isOpen: true });
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

  onPress = (type, { id }) => {
    const { navigation } = this.props;

    if (type === FEEDABLE_TRIP) {
      navigation.navigate('TripDetail', { id });
    }

    if (type === FEEDABLE_PROFILE) {
      navigation.navigate('Profile', { profileId: id });
    }

    this.onClose();
  }

  onExperienceIconPress = ({ id }) => {
    const { navigation } = this.props;
    this.onClose();
    navigation.navigate('ExperienceDetail', { id });
  }

  renderSearchModal = () => {
    const { id, type } = this.props;

    return (
      <Modal
        visible={this.state.isOpen}
        onRequestClose={() => this.setState({ isOpen: false })}
        animationType="slide"
      >
        <ListSearchModal
          id={id}
          type={type}
          onPress={this.onPress}
          onClose={this.onClose}
          onExperienceIconPress={this.onExperienceIconPress}
          searchCategory="trips"
        />
      </Modal>
    );
  }

  renderListSearch = () => {
    const { trips } = this.props;

    if (trips.count > 0) {
      return (
        <View style={styles.searchWrapper}>
          <ListSearchBar onSearchPress={this.onSearchPress} />
        </View>
      );
    }

    return null;
  }

  renderSectionList = () => {
    const { trips } = this.props;

    return (
      <PortionList
        data={trips}
        renderItem={({ item }) => (
          item.isBlocked ?
            null :
            <ListItem
              trip={item}
              onPress={this.onPress}
              onExperiencePress={this.onExperienceIconPress}
            />
        )}
        listHeader={this.renderListSearch}
        sectionHeader={
          ({ section }) => <StickySectionHeader label={section.title} />
        }
        sectionFooter={() => <SectionDivider />}
        stickySectionHeader
        fetchMoreOptions={{
          variables: { offset: trips.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.trips.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.trips.rows.concat(fetchMoreResult.trips.rows);

            return { trips: { ...previousResult.trips, ...{ rows } } };
          },
        }}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderSectionList()}
        {this.renderSearchModal()}
      </View>);
  }
}

UserTripsList.propTypes = {
  id: PropTypes.number.isRequired,
  trips: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
    refetch: PropTypes.func,
  }).isRequired,
  subscribeToNewTrip: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

UserTripsList.defaultProps = {
  queryString: '',
};

export default withNavigation(UserTripsList);
