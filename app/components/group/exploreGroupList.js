/* global navigator */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Loading } from '@components/common';
import GroupItem from '@components/feed/card/group';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    borderColor: '#dddee3',
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  filterLabelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginHorizontal: 8,
  },
  activeFilterLabelWrapper: {
    backgroundColor: Colors.background.lightGray,
    borderRadius: 4,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1db0ed',
  },
  icon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    marginRight: 6,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#dddddd',
    height: '70%',
    alignSelf: 'center',
  },
  listLabel: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginHorizontal: 20,
    marginVertical: 16,
  },
  messageWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#CED0CE',
    opacity: 0.5,
  },
  errorWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    opacity: 0.5,
  },
  loadingWrapper: {
    flex: 1,
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});

class ExploreGroupsResult extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      loading: true,
      region: {
        latitude: '',
        longitude: '',
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      filterTitle: 'Popular Groups',
      filterType: 'popular',
    });
  }

  componentWillMount() {
    this.currentLocation();
  }

  onPressFilter = (filter) => {
    const { region } = this.state;
    const { exploreGroups } = this.props;

    if (filter === 'nearby') {
      let error = 0;

      if (region.latitude.length === 0 && region.longitude.length === 0) {
        Alert.alert('Error!!', 'Could not track your location. Please check if your GPS is turned off.');
        error += 1;
      }

      if (error === 0) {
        exploreGroups.refetch({
          from: [region.latitude, region.longitude],
          filter,
        });
        this.setState({ filterTitle: 'Groups Near You', filterType: 'nearby' });
      }
    }

    if (filter === 'name') {
      exploreGroups.refetch({
        from: null,
        filter,
        order: 'asc',
      });
      this.setState({ filterTitle: 'A to Z', filterType: 'name' });
    }

    if (filter === 'popular') {
      exploreGroups.refetch({
        from: null,
        filter: 'popular',
      });
      this.setState({ filterTitle: 'Popular Groups', filterType: 'popular' });
    }
  }

  currentLocation = () => {
    this.setState({ loading: true });
    const { region } = this.state;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        region.latitude = position.coords.latitude;
        region.longitude = position.coords.longitude;
        this.setState({ region, loading: false });
      },
      (error) => {
        Alert.alert(error.message);
        this.setState({ loading: false });
      },
      { timeout: 20000, maximumAge: 1000 },
    );
  };

  redirect = (type, detail) => {
    const { navigation } = this.props;

    navigation.navigate('GroupDetail', { group: detail });
  }

  renderHeader = () => <Text style={styles.listLabel}>{this.state.filterTitle}</Text>

  renderFooter = () => {
    const { networkStatus, rows, count } = this.props.exploreGroups;

    if (networkStatus === 1) {
      return <Loading />;
    }

    if (rows.length >= count) {
      return (
        <View
          style={{
            paddingVertical: 60,
            borderTopWidth: 1,
            borderColor: '#CED0CE',
          }}
        />
      );
    }

    return (
      <View
        style={styles.loadingWrapper}
      >
        <Loading />
      </View>
    );
  }

  renderAllGroups() {
    const {
      loading,
      rows,
      count,
      error,
      networkStatus,
      refetch,
      fetchMore,
    } = this.props.exploreGroups;

    if (networkStatus !== 7) {
      return (
        <View
          style={styles.loadingWrapper}
        >
          <Loading />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorWrapper}>
          <Text>Error: {error.message}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={rows}
        renderItem={({ item }) => (
          <GroupItem
            min
            onPress={this.redirect}
            group={item}
            wrapperStyle={{ borderBottomWidth: 0 }}
          />)
        }
        keyExtractor={(item, index) => `${item.id}-${index}`}
        refreshing={networkStatus === 4}
        onRefresh={() => refetch()}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        onEndReached={() => {
          if (loading || rows.length >= count) return;

          fetchMore({
            variables: { offset: rows.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult || fetchMoreResult.exploreGroups.length === 0) {
                return previousResult;
              }

              const prevExploreGroups = previousResult.exploreGroups;
              const updatedGroup = previousResult.exploreGroups.rows.concat(
                fetchMoreResult.exploreGroups.rows,
              );

              return {
                exploreGroups: {
                  ...prevExploreGroups,
                  ...{ rows: updatedGroup },
                },
              };
            },
          });
        }}
      />
    );
  }

  render() {
    return (
      <View style={styles.wrapper} >
        <View style={styles.filterRow}>
          <View style={{ width: '33.33%' }}>
            <TouchableOpacity onPress={() => this.onPressFilter('nearby')}>
              <View
                style={[styles.filterLabelWrapper, this.state.filterType === 'nearby' ? styles.activeFilterLabelWrapper : []]}
              >
                <Image source={require('@icons/icon_location_purple.png')} style={styles.icon} />
                <Text style={styles.filterLabel}>Near You</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.verticalDivider} />
          <View style={{ width: '33.33%' }}>
            <TouchableOpacity onPress={() => this.onPressFilter('popular')}>
              <View
                style={[styles.filterLabelWrapper, this.state.filterType === 'popular' ? styles.activeFilterLabelWrapper : []]}
              >
                <Text style={styles.filterLabel}>Popular</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.verticalDivider} />
          <View style={{ width: '33.33%' }}>
            <TouchableOpacity onPress={() => this.onPressFilter('name')}>
              <View
                style={[styles.filterLabelWrapper, this.state.filterType === 'name' ? styles.activeFilterLabelWrapper : []]}
              >
                <Text style={styles.filterLabel}>A to Z</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {this.renderAllGroups()}
      </View>
    );
  }
}

ExploreGroupsResult.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  exploreGroups: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    networkStatus: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.number,
    error: PropTypes.object,
    refetch: PropTypes.func,
    fetchMore: PropTypes.func,
  }).isRequired,
};

export default ExploreGroupsResult;
