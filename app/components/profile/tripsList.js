import React, { PureComponent } from 'react';
import { View, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { ListSearchBar } from '@components/common';
import DataList from '@components/dataList';
import ListItem from '@components/profile/listItem';
import ListSearchModal from '@components/profile/ListSearchModal';
import { withNavigation } from 'react-navigation';
import { FEEDABLE_TRIP, FEEDABLE_PROFILE } from '@config/constant';

class UserTripsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
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

  onPress = (type, detail) => {
    const { navigation } = this.props;

    if (type === FEEDABLE_TRIP) {
      navigation.navigate('TripDetail', { trip: detail });
    }

    if (type === FEEDABLE_PROFILE) {
      navigation.navigate('Profile', { profileId: detail });
    }

    this.onClose();
  }

  onExperienceIconPress = (experience) => {
    const { navigation } = this.props;
    this.onClose();
    navigation.navigate('ExperienceDetail', { experience });
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
      return (<ListSearchBar onSearchPress={this.onSearchPress} />);
    }

    return null;
  }

  renderDataList = () => {
    const { trips } = this.props;

    return (
      <DataList
        data={trips}
        header={this.renderListSearch}
        renderItem={({ item }) => (
          <ListItem
            trip={item}
            onPress={this.onPress}
            onExperiencePress={this.onExperienceIconPress}
          />
        )}
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
      <View>
        {this.renderDataList()}
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
