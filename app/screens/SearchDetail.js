import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import TabIcon from '@components/tabIcon';
import { Wrapper } from '@components/common';
import BackButton from '@components/common/backButton';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  navBar: {
    height: 40,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  searchContent: {
    padding: 24,
    backgroundColor: Colors.background.fullWhite,
  },
  bold: {
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: Colors.text.gray,
    marginTop: 4,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestion: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 11,
    backgroundColor: Colors.background.gray,
    marginRight: 4,
    marginTop: 12,
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: Colors.background.blue,
  },
  whiteText: {
    color: Colors.text.white,
    fontSize: 12,
  },
  searchResults: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
  },
  switchViewWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: 24,
  },
  viewSwitcher: {
    height: 22,
    paddingHorizontal: 20,
    borderRadius: 11,
    backgroundColor: Colors.background.gray,
    marginRight: 16,
    justifyContent: 'center',
  },
});

class SearchDetail extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Search',
    tabBarIcon: ({ focused, tintColor }) => (
      <TabIcon
        iconDefault="ios-search-outline"
        iconFocused="ios-search"
        focused={focused}
        tintColor={tintColor}
      />
    ),
  };
  render() {
    return (
      <Wrapper bgColor={Colors.background.cream}>
        <View style={styles.navBar}>
          <BackButton onPress={() => this.props.navigation.goBack()} />
        </View>
        <View style={styles.searchContent}>
          <Text style={styles.bold}>Gothenburg, Sweden - Barcelona, Spain</Text>
          <Text style={styles.time}>OCT 20, 09:00</Text>
          <View style={styles.suggestionsContainer}>
            <TouchableOpacity style={[styles.suggestion, styles.selected]}>
              <Text style={styles.whiteText}>Offered</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.suggestion, styles.selected]}>
              <Text style={styles.whiteText}>Asked for</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestion}>
              <Text style={styles.whiteText}>Public transport</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestion}>
              <Text style={styles.whiteText}>Groups</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={styles.searchResults}>
          <View style={styles.switchViewWrapper}>
            <TouchableOpacity style={[styles.viewSwitcher, styles.selected]}>
              <Text style={styles.whiteText}>Cards</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewSwitcher}>
              <Text style={styles.whiteText}>List</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Wrapper>
    );
  }
}

SearchDetail.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        refetch: PropTypes.string,
      }),
    }).isRequired,
  }).isRequired,
};

export default SearchDetail;
