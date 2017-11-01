import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import TabIcon from '@components/tabIcon';
import CustomButton from '@components/common/customButton';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.blue,
    paddingTop: 24,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 24,
    marginTop: 12,
  },
  scrollArea: {
    flex: 1,
    height: 300,
    backgroundColor: Colors.background.fullWhite,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 12,
  },
  input: {
    paddingVertical: 8,
    fontSize: 14,
  },
  inputLabel: {
    fontWeight: 'bold',
    color: Colors.text.gray,
    textAlign: 'center',
    paddingVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.background.lightGray,
  },
  locationSwitcher: {
    alignSelf: 'center',
    height: 22,
    width: 22,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  label: {
    color: Colors.text.gray,
    paddingHorizontal: 24,
    marginVertical: 12,
  },
  locationSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
  },
  suggestion: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 11,
    backgroundColor: Colors.background.gray,
    marginRight: 4,
    marginBottom: 12,
    justifyContent: 'center',
  },
  suggestionText: {
    color: Colors.text.white,
    fontSize: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
  },
  changeButton: {
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
  resultsFrom: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  selected: {
    backgroundColor: Colors.background.blue,
  },
  searchBtn: {
    marginHorizontal: 24,
    marginVertical: 32,
  },
  earlierSearchesWrapper: {
    backgroundColor: Colors.background.cream,
    padding: 24,
  },
  earlierSearchtitle: {
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  earlierSearch: {
    paddingVertical: 12,
  },
});

class Search extends Component {
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
      <View style={styles.container}>
        <Text style={styles.title}>Search</Text>
        <ScrollView style={styles.scrollArea}>
          <View style={styles.locationRow}>
            <View style={styles.inputWrapper}>
              <View>
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="From where I am now"
                />
              </View>
              <View style={styles.divider} />
              <View>
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  placeholder="Destination"
                />
              </View>
            </View>
            <View>
              <Text style={styles.inputLabel}>From</Text>
              <TouchableOpacity>
                <Image source={require('@icons/icon_switcher.png')} style={styles.locationSwitcher} />
              </TouchableOpacity>
              <Text style={styles.inputLabel}>To</Text>
            </View>
          </View>
          <Text style={styles.label}>Or choose:</Text>
          <View style={styles.locationSuggestions}>
            <TouchableOpacity style={styles.suggestion}>
              <Text style={styles.suggestionText}>Anywhere</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestion}>
              <Text style={styles.suggestionText}>North</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestion}>
              <Text style={styles.suggestionText}>South</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestion}>
              <Text style={styles.suggestionText}>East</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestion}>
              <Text style={styles.suggestionText}>West</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>All dates and times</Text>
            <TouchableOpacity>
              <Text style={styles.changeButton}>Change</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Show results from</Text>
          <View style={styles.resultsFrom}>
            <TouchableOpacity style={[styles.suggestion, styles.selected]}>
              <Text style={styles.suggestionText}>Offered</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.suggestion, styles.selected]}>
              <Text style={styles.suggestionText}>Asked for</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestion}>
              <Text style={styles.suggestionText}>Public transport</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestion}>
              <Text style={styles.suggestionText}>Groups</Text>
            </TouchableOpacity>
          </View>
          <CustomButton
            bgColor={Colors.background.darkCyan}
            style={styles.searchBtn}
            onPress={() => this.props.navigation.navigate('Detail')}
          >
            Search
          </CustomButton>
          <View style={styles.earlierSearchesWrapper}>
            <Text style={styles.earlierSearchtitle}>Earlier searches</Text>
            <FlatList
              data={[{ key: 'Kumaripati - Lalitpur' }, { key: 'New Road - Kathmandu' }, { key: 'Patan - Lalitpur' }, { key: 'Chovar - Kirtipur' }]}
              renderItem={({ item }) => <Text style={styles.earlierSearch}>{item.key}</Text>}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

Search.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Search;
