import React from 'react';
import { View } from 'react-native';
import { withSearchGroup } from '@services/apollo/group';
import PropTypes from 'prop-types';
import SearchGroupResult from '@components/group/SearchGroupResult';
import { NavBar } from '@components/common';

const GroupResult = withSearchGroup(SearchGroupResult);

const SearchGroup = ({ navigation }) => {
  const { query } = navigation.state.params;
  return (
    <View>
      <NavBar handleBack={() => navigation.goBack()} />
      <GroupResult navigation={navigation} keyword={query} />
    </View>
  );
};

SearchGroup.navigationOptions = {
  header: null,
};

SearchGroup.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.object,
  }).isRequired,
};

export default SearchGroup;
