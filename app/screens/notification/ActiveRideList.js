import React, { PureComponent } from 'react';
import { Wrapper } from '@components/common';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import ToolBar from '@components/utils/toolbar';
import DataList from '@components/dataList';
import { withMyTrips } from '@services/apollo/trip';
import ActiveRideItem from '@components/message/ActiveRideItem';

class ActiveRideList extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  renderActiveRides = () => {
    const { trips } = this.props;

    return (
      <DataList
        data={trips}
        renderItem={({ item }) => (<ActiveRideItem trip={item} />)}
        fetchMoreOptions={{
          variables: { offset: trips.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.trips.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.trips.rows.concat(
              fetchMoreResult.trips.rows,
            );

            return { trips: { ...previousResult.trips, ...{ rows } } };
          },
        }}
      />
    );
  }

  render() {
    return (
      <Wrapper>
        <ToolBar title="Your active rides" />
        {this.renderActiveRides()}
      </Wrapper>
    );
  }
}

ActiveRideList.propTypes = {
  trips: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.numeric,
    error: PropTypes.object,
    refetch: PropTypes.func,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default compose(withMyTrips, withNavigation)(ActiveRideList);
