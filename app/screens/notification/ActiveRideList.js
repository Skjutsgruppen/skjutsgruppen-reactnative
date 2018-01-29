import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Wrapper, NavBar } from '@components/common';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import DataList from '@components/dataList';
import { withMyTrips } from '@services/apollo/trip';
import ActiveRideItem from '@components/message/ActiveRideItem';

const styles = StyleSheet.create({
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    paddingVertical: 12,
    color: Colors.text.blue,
    marginHorizontal: 24,
  },
  messages: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
  spacedWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  footer: {
    marginVertical: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#CED0CE',
  },
});

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
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <View style={styles.messages}>
          <Text style={styles.sectionTitle}>
            YOUR ACTIVE RIDES
          </Text>
          {this.renderActiveRides()}
        </View>
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
