import React from 'react';
import { View } from 'react-native';
import { withSearchGroup } from '@services/apollo/group';
import PropTypes from 'prop-types';
import SearchGroupResult from '@components/group/SearchGroupResult';

const GroupResult = withSearchGroup(SearchGroupResult);

const SearchGroup = ({ navigation }) => {
  const { query } = navigation.state.params;

  return (<View><GroupResult navigation={navigation} keyword={query} /></View>);
};

SearchGroup.navigationOptions = {
  title: 'Back',
};

SearchGroup.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.object,
  }).isRequired,
};

export default SearchGroup;
