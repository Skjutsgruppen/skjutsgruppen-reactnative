import React, { PureComponent } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Loading } from '@components/common';
import Colors from '@theme/colors';
import { withMyTrips } from '@services/apollo/trip';
import DataList from '@components/dataList';
import ListItem from '@components/profile/listItem';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  wrapper: {
    padding: '20%',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 32,
    marginVertical: 16,
    textAlign: 'center',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.fullWhite,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowColor: '#000',
    height: 80,
  },
  searchInput: {
    fontSize: 15,
    height: 36,
    flex: 1,
    borderRadius: 18,
    paddingLeft: 16,
    marginRight: 16,
  },
  closeIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginHorizontal: 16,
    opacity: 0.5,
  },
});

const SearchResult = ({ trips, onPress, onExperiencePress, queryString }) => {
  if (queryString.length < 1) {
    return null;
  }

  if (trips.loading) {
    return (<View style={styles.wrapper}><Loading /></View>);
  }

  if (trips.count === 0) {
    return (<View style={styles.wrapper}>
      <Text style={styles.text}>No search data.</Text></View>);
  }

  return (
    <DataList
      data={trips}
      renderItem={({ item }) => (
        <ListItem
          trip={item}
          onExperiencePress={onExperiencePress}
          onPress={onPress}
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
};

SearchResult.propTypes = {
  trips: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
    refetch: PropTypes.func,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onExperiencePress: PropTypes.func.isRequired,
  queryString: PropTypes.string.isRequired,
};

const SearchResultWithData = withMyTrips(SearchResult);

class TripsListSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { searchQuery: '' };
  }

  render() {
    const { onClose, onPress, type, id, onExperienceModalPress } = this.props;
    const { searchQuery } = this.state;
    return (
      <View>
        <View style={[styles.searchInputWrapper]}>
          <TextInput
            placeholder="Search"
            onChangeText={text => this.setState({ searchQuery: text })}
            underlineColorAndroid="transparent"
            style={styles.searchInput}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={() => onClose()}>
            <Image
              source={require('@assets/icons/ic_cross.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
        {
          <SearchResultWithData
            onExperiencePress={onExperienceModalPress}
            id={id}
            onPress={onPress}
            type={type}
            applyQueryString
            active={null}
            queryString={searchQuery}
          />
        }
      </View>
    );
  }
}

TripsListSearch.propTypes = {
  id: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onExperienceModalPress: PropTypes.func.isRequired,
};

export default TripsListSearch;
