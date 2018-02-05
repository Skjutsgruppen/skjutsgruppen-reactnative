import React, { PureComponent } from 'react';
import { View, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { ListSearchBar } from '@components/common';
import DataList from '@components/dataList';
import ListItem from '@components/profile/listItem';
import TripsListSearch from '@components/profile/TripsListSearch';
import { withNavigation } from 'react-navigation';

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

  onExperienceModalPress = (experience) => {
    const { navigation } = this.props;
    this.onClose();
    navigation.navigate('ExperienceDetail', { experience });
  }

  renderSearchModal() {
    const { onPress, id, type } = this.props;

    return (
      <Modal
        visible={this.state.isOpen}
        onRequestClose={() => this.setState({ isOpen: false })}
        animationType="slide"
      >
        <TripsListSearch
          id={id}
          type={type}
          onPress={onPress}
          onClose={this.onClose}
          onExperienceModalPress={this.onExperienceModalPress}
        />
      </Modal>
    );
  }

  renderDataList = () => {
    const { trips, onPress } = this.props;

    return (
      <DataList
        data={trips}
        header={trips.count > 0 && <ListSearchBar onSearchPress={this.onSearchPress} />}
        renderItem={({ item }) => (
          <ListItem
            trip={item}
            onPress={onPress}
            onExperiencePress={this.onExperienceModalPress}
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
    const { trips } = this.props;

    return (
      <View>
        {this.renderDataList()}
        {this.renderSearchModal()}
      </View>);
  }
}

UserTripsList.propTypes = {
  id: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
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
